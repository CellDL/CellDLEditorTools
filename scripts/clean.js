import fs from 'node:fs'

for (const path of [
    'cache',
    'dist',
    'node_modules'
]) {
    if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true, force: true })
    }
}
