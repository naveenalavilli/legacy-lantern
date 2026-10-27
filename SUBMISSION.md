---
title: "I built a lantern for memories that never leave your device"
published: false
tags: devchallenge, hf26challenge, opensource, ai
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26).*

## What I Built

Legacy Lantern is a private remembrance studio. You give it a name, a relationship, a few favorite things, and one moment you still carry. It turns those details into a short keepsake—but the memory never leaves your browser.

I interpreted “Ghost in the Machine” less as a haunted machine and more as the human trace inside one: the details a model could never know until somebody chooses to preserve them. Día de los Muertos shaped the visual language—marigold orange, candlelight, and an invitation to remember with warmth instead of turning grief into spectacle.

The crucial constraint was privacy. Family memories can contain names, history, traditions, and intimate details. I did not want “private” to mean “we promise our API will handle it carefully.” I wanted it to mean there is no API request at all.

## Demo

**Live demo:** `[add deployment URL]`

On first use, Legacy Lantern downloads a quantized open-weight model. After that, generation happens on the device and the model remains in the browser cache. The keepsake can be copied or downloaded as plain text.

I tested the full path in Chromium: model download, local inference, rendering, copy/export controls, and the offline-ready application shell.

## Code

{% github `[add GitHub repository]` %}

There is deliberately very little machinery to hide behind: vanilla HTML, CSS, and JavaScript, an open model, an open inference runtime, and a service worker.

## How I Built It

The model is **Qwen2.5-1.5B-Instruct**, using the quantized ONNX conversion maintained by the Hugging Face community. **Transformers.js** runs it directly in Chromium, preferring WebGPU and falling back to WASM.

The prompt is assembled locally from the form. It asks the model for a short tribute, restricts it to supplied details, and explicitly tells it not to invent biography or beliefs. I tightened that instruction after an early test model ignored the requested language—a useful reminder that “it ran” is not the same as “it worked.”

The rest of the architecture is intentionally small:

- a static, responsive interface with no framework and no build step
- a Web App Manifest and service worker for an installable, cached shell
- no account, analytics, database, cookies, or server-side inference
- plain-text export so the keepsake is not locked into the app
- visible model-loading progress and a WASM fallback for wider hardware support

The first model download is the tradeoff. It is substantially larger and slower than calling a hosted endpoint. I initially tested 360M and 500M parameter models, but both invented details too readily for a remembrance tool; the 1.5B model is an intentional quality-over-download-size decision. In return, later generations do not need to disclose the memory to a third party.

## Why Does Open Innovation Matter?

Open AI changes the trust boundary.

With a closed inference API, every remembrance would cross the network and land on infrastructure the family does not control. A privacy policy would be carrying the whole burden. Here, the model weights and runtime come to the memory. The memory does not go to them.

Openness also makes the project durable. The model can be inspected, swapped, quantized differently, or archived. The interface can survive a vendor changing prices or shutting down an endpoint. For a project about keeping stories alive, depending on a service that might disappear felt like the wrong architecture.

This is where the open approach worked better than a closed one: not because it was faster, but because it made a stronger promise technically possible.

## The Spirit of It

My test memory was small: a grandmother whose kitchen smelled like cinnamon on Sundays, bread made without measuring, and boleros hummed while the bowls were washed.

That specificity is the point. A general model knows what a grandmother is. It does not know *that* kitchen, *that* song, or *that* Sunday. The person supplies the soul; the model only helps shape the lantern around it.

## Prize Categories

I am entering the overall Hacktoberfest Open-Source AI Challenge. I kept the project focused on the open-weight, local-inference requirement rather than adding a partner technology that did not strengthen the idea.
