/**
 *
 * MIT License
 *
 * Copyright (c) 2023 subframe7536
 *
 */

import type { LoadInBrowserOption } from './types'
import type { PyodideInterface } from 'pyodide'

import { loadPyodide } from 'pyodide'

export type { LoadInBrowserOption } from './types'
/**
 * Load `fonttools` in `browser`, default index URL is `import.meta.url`
 */
export async function loadInBrowser(
  options: LoadInBrowserOption = {},
): Promise<PyodideInterface> {
  const packages = ['fonttools']
  if (options?.woff2) {
    packages.push('brotli')
  }
  return await loadPyodide({ ...options, packages })
}
