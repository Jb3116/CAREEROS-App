import { pipeline, env } from '@huggingface/transformers';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const distPath = join(process.cwd(), 'node_modules', 'onnxruntime-web', 'dist');
const fileUrl = pathToFileURL(distPath).href + '/';

env.backends.onnx.wasm.wasmPaths = fileUrl;
env.backends.onnx.wasm.numThreads = 1;
env.cacheDir = join(process.cwd(), '.cache');

console.log('Testing @huggingface/transformers with clean cache in:', env.cacheDir);

try {
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    dtype: 'fp32',
  });
  console.log('Model loaded successfully!');

  const output = await extractor('machine learning', { pooling: 'mean', normalize: true });
  console.log('REAL TRANSFORMER FORWARD PASS SUCCESSFUL!');
  console.log('Dimensions:', output.dims);
  console.log('Length:', output.data.length);
  console.log('First 10 values:', Array.from(output.data.slice(0, 10)));
} catch (err) {
  console.error('Error during transformer execution:', err);
}
