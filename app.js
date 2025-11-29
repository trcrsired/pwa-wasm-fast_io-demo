

async function loadWasm() {
  // Check if WebAssembly is supported
  if (typeof WebAssembly === "undefined") {
    document.getElementById("output").innerHTML =
      "<p><strong>WebAssembly is not supported in this browser.</strong><br>";
    return;
  }

  try {
    const response = await fetch("hello.wasm");
    const memory = new WebAssembly.Memory({ initial: 8 });

    const importObject = {
      env: { memory },
      wasi_snapshot_preview1: {
        proc_exit: (code) => {
          throw new WebAssembly.RuntimeError("WASM exited with code " + code);
        }
      }
    };
    const { instance } = await WebAssembly.instantiateStreaming(response, importObject);

    const exports = instance.exports;
  
    exports._start();
    const ptr = exports.get_html_ptr();
    const len = exports.get_html_len();

    const bytes = new Uint8Array(exports.memory.buffer, ptr, len);
    const html = new TextDecoder("utf-8").decode(bytes);

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
