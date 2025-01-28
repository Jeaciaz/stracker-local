import {$} from 'bun'

await Promise.all([$`bun run dev:frontend`, $`bun run dev:backend`])
