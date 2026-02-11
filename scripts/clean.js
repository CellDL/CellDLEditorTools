import fs from 'node:fs'

for (const path of [
    'dist',
    'node_modules',
    'src/assets/bg-rdf'
]) {
    if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true, force: true })
    }
}
