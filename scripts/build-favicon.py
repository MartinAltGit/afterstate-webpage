import base64
import pathlib

p = pathlib.Path(r"c:\Users\Martin\Desktop\WORK\Afterstate webpage\app\assets\logo-afterstate.png")
b64 = base64.b64encode(p.read_bytes()).decode()
svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#5A848A"/>
  <image href="data:image/png;base64,{b64}" x="8" y="14" width="48" height="36" style="filter: brightness(0) invert(1)"/>
</svg>
"""
out = pathlib.Path(r"c:\Users\Martin\Desktop\WORK\Afterstate webpage\app\assets\favicon.svg")
out.write_text(svg, encoding="utf-8")
print("wrote", out, "bytes", len(svg))
