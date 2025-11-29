#include <cstddef>
#include <fast_io.h>
#include <fast_io_dsal/string.h>
#include <fast_io_dsal/string_view.h>

namespace
{
// Embed HTML using a UTF-8 raw string literal with char8_t
inline constexpr ::fast_io::u8string_view html_strvw(
u8R"abc(<section>
  <h1>PWA fast_io Demo</h1>
  <p>This DOM fragment is generated from C++ ::fast_io::u8string and ::fast_io::u8string_view to test heap allocation.</p>
  <ul>
    <li>Fast</li>
    <li>Portable</li>
    <li>Fun</li>
  </ul>
  <p>
    Source code is available at
    <a href="https://github.com/trcrsired/pwa-wasm-fast_io-demo" target="_blank">
      https://github.com/trcrsired/pwa-wasm-fast_io-demo
    </a>.
    <br>
    This project is licensed under the GNU General Public License v3.0.
  </p>
</section>
)abc"
);

inline ::fast_io::u8string html_str(html_strvw);
}

extern "C"
{
    [[__gnu__::__visibility__("default")]]
    char8_t const* get_html_ptr() noexcept {
        return html_str.c_str();
    }

    [[__gnu__::__visibility__("default")]]
    ::std::size_t get_html_len() noexcept {
        return html_str.size(); // exclude null terminator
    }
}
