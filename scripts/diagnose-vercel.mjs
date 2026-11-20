import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { diagnoseVercelFile } from './lib/site-input-hash.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
diagnoseVercelFile(root, 'A');
