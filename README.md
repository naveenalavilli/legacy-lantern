# Legacy Lantern

A private, local-first remembrance studio for the Hacktoberfest 2026 **Ghost in the Machine** challenge.

Legacy Lantern turns a specific family memory into a short keepsake using the open-weight [Qwen2.5-0.5B-Instruct](https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct) model. Inference runs inside the browser through [Transformers.js](https://huggingface.co/docs/transformers.js), using WebGPU when available and WASM as a fallback. No story, name, or prompt is sent to an inference API.

## Run it

The app has no build step. Serve the directory from a local web server:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`. The first generation downloads and caches the quantized model. Subsequent use can work offline.

## Why open AI matters here

Remembrances may contain names, family history, cultural practices, and intimate moments. A closed API would require uploading that material to somebody else's server. With an open-weight model and an open runtime, the trust boundary is the device itself. The model can also be inspected, replaced, or preserved even if a vendor disappears.

## Privacy model

- No accounts, analytics, database, or server-side inference
- Model weights and static shell cached in the browser
- User input lives only in the current page session
- Keepsakes export as plain text with no lock-in

## Stack

- Vanilla HTML, CSS, and JavaScript
- Transformers.js 3.7.3
- Qwen2.5-0.5B-Instruct (quantized)
- WebGPU / WASM
- Service Worker + Web App Manifest

## License

MIT
