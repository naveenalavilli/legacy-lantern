const form = document.querySelector('#memory-form');
const memory = document.querySelector('#memory');
const count = document.querySelector('#count');
const status = document.querySelector('#model-status');
const generateButton = document.querySelector('#generate');
const result = document.querySelector('#result');
const tribute = document.querySelector('#tribute');
let generator;

memory.addEventListener('input', () => { count.textContent = memory.value.length; });

async function getGenerator() {
  if (generator) return generator;
  status.textContent = 'Loading the open model locally… first run may take a minute.';
  const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.3');
  env.allowLocalModels = false;
  generator = await pipeline('text-generation', 'onnx-community/Qwen2.5-1.5B-Instruct', {
    dtype: 'q4',
    device: navigator.gpu ? 'webgpu' : 'wasm',
    progress_callback: ({ status: state, progress, file }) => {
      if (state === 'progress') status.textContent = `Preparing ${file || 'model'} · ${Math.round(progress || 0)}%`;
    }
  });
  return generator;
}

function promptFor(data) {
  return [{ role: 'system', content: `You are a careful remembrance writer. Write only in ${data.language}. Create a specific tribute of 70-90 words. Every image and fact must come from the user's details; do not add flowers, places, events, beliefs, or biography. Avoid clichés about angels, heaven, or death. Sound ${data.voice}. Start with a provided sensory detail, honor the person's impact, and end with one gentle line addressed directly to them. Return only the tribute.` },
    { role: 'user', content: `Person: ${data.name}\nRelationship: ${data.relationship}\nMemory: ${data.memory}\nFavorite things: ${data.details || 'not provided'}` }];
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  generateButton.disabled = true;
  try {
    const pipe = await getGenerator();
    status.textContent = 'Shaping the memory on this device…';
    const output = await pipe(promptFor(data), { max_new_tokens: 140, repetition_penalty: 1.12, do_sample: false });
    const generated = output?.[0]?.generated_text;
    const text = Array.isArray(generated) ? generated.at(-1)?.content : generated;
    if (!text) throw new Error('The model returned an empty remembrance.');
    tribute.textContent = text.trim();
    document.querySelector('#result-name').textContent = data.name;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    status.textContent = 'Ready offline — model and memories remain on this device.';
  } catch (error) {
    console.error(error);
    status.textContent = 'The local model could not start. Check WebGPU support or connection for the first download, then try again.';
  } finally { generateButton.disabled = false; }
});

document.querySelector('#copy').addEventListener('click', async (event) => {
  await navigator.clipboard.writeText(tribute.textContent);
  event.currentTarget.textContent = 'Copied';
  setTimeout(() => { event.currentTarget.textContent = 'Copy keepsake'; }, 1400);
});

document.querySelector('#download').addEventListener('click', () => {
  const name = document.querySelector('#result-name').textContent;
  const blob = new Blob([`A lantern for ${name}\n\n${tribute.textContent}\n\nCreated privately with Legacy Lantern.`], { type:'text/plain' });
  const link = Object.assign(document.createElement('a'), { href:URL.createObjectURL(blob), download:`legacy-lantern-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}.txt` });
  link.click(); URL.revokeObjectURL(link.href);
});

document.querySelector('#again').addEventListener('click', () => form.scrollIntoView({ behavior:'smooth' }));
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('./sw.js');
