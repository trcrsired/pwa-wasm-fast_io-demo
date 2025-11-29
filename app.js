

async function loadWasm() {
  // Check if WebAssembly is supported
  if (typeof WebAssembly === "undefined") {
    document.getElementById("output").innerHTML =
      "<p><strong>WebAssembly is not supported in this browser.</strong><br>";
    return;
  }

  try {
    // Fetch the compiled WebAssembly binary
    const response = await fetch("hello.wasm");

    // Create a linear memory object for the WASM instance
    const memory = new WebAssembly.Memory({ initial: 8 });

    // Define the import object passed into the WASM module
    // - Provide the memory under `env`
    // - Override WASI's `proc_exit` so the page doesn't terminate
    const importObject = {
      env: { memory },
      wasi_snapshot_preview1: {
        proc_exit: (code) => {
          throw new WebAssembly.RuntimeError("WASM exited with code " + code);
        }
      }
    };

    // Instantiate the WASM module with streaming compilation
    const { instance } = await WebAssembly.instantiateStreaming(response, importObject);

    // Grab the exported functions and memory from the instance
    const exports = instance.exports;

    let html;

    // Run global/static constructors (normally done inside `_start`)
    exports.__wasm_call_ctors();

    try {
      // Call exported functions to get pointer + length of the HTML buffer
      const ptr = exports.get_html_ptr();
      const len = exports.get_html_len();

      // Create a typed view into WASM memory and decode it as UTF‑8
      const bytes = new Uint8Array(exports.memory.buffer, ptr, len);
      html = new TextDecoder("utf-8").decode(bytes);

      // At this point, `html` contains the string produced by the WASM module
    }
    finally {
      // Always run global destructors/cleanup (atexit, static dtors, etc.)
      // This ensures resources are released even if an error was thrown above
      exports.__wasm_call_dtors();
    }

    // `html` now holds the decoded string, safe to inject into the DOM
    // Inject into DOM
    document.getElementById("output").innerHTML = html;
  } catch (err) {
    // Handle errors gracefully
    console.error("Failed to load WASM:", err);
    document.getElementById("output").innerHTML =
      "<p><strong>Failed to load WebAssembly module.</strong></p>";
  }
}

loadWasm();
