cmake_minimum_required(VERSION 3.20)
project(hello_wasm LANGUAGES CXX)

# Require modern C++ standard
set(CMAKE_CXX_STANDARD 26)

# Define the executable target (output will be hello.wasm)
add_executable(hello.wasm hello.cpp)

# Optionally allow user to set FAST_IO_DIR
set(FAST_IO_DIR "" CACHE PATH "Path to fast_io installation")

# Disable exceptions and rtti for this target
target_compile_options(hello.wasm PRIVATE
    -fno-exceptions
    -fno-rtti
)

# If FAST_IO_DIR is provided, add its include path
if(FAST_IO_DIR)
    target_include_directories(hello.wasm PRIVATE "${FAST_IO_DIR}/include")
endif()

# Linker options:
# --export : explicitly mark functions as exports so they are accessible from JavaScript
#   __wasm_call_ctors : runs all global/static constructors (initializes global state before use)
#   __wasm_call_dtors : runs all global/static destructors and atexit handlers (cleans up resources)
#   get_html_ptr / get_html_len : custom functions to expose the HTML buffer
target_link_options(hello.wasm PRIVATE
    -Wl,--export=__wasm_call_ctors
    -Wl,--export=__wasm_call_dtors
    -Wl,--export=get_html_ptr
    -Wl,--export=get_html_len
)

# Install the wasm binary directly into the install prefix
install(TARGETS hello.wasm
    RUNTIME DESTINATION .
)
