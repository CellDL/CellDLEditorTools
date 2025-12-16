/******************************************************************************

CellDL Editor

Copyright (c) 2022 - 2025 David Brooks

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

******************************************************************************/

import { type PyodideAPI } from '@pyodide/pyodide'
import { type PyProxy } from "@pyodide/ffi.d.ts"

import * as $rdf from '@editor/metadata/index'

//==============================================================================

import { test as runTest } from './test'

//==============================================================================

const rdfModule = {
    blankNode: $rdf.blankNode,
    literal: function(value: any, options={}) {
        if ('datatype' in options) {
            // @ts-expect-error:
            return $rdf.literal(value, options.datatype)
        }
        return $rdf.literal(value)
    },
    namedNode: $rdf.namedNode,

    isBlankNode: $rdf.isBlankNode,
    isLiteral: $rdf.isLiteral,
    isNamedNode: $rdf.isNamedNode,

    RdfStore: function(): $rdf.RdfStore {
        return new $rdf.RdfStore()
    }
}

//==============================================================================

const pythonPackages = [
    'bg2cellml-0.8.2-py3-none-any.whl',
    'flexcache-0.3-py3-none-any.whl',
    'flexparser-0.4-py3-none-any.whl',
    'lark-1.3.1-py3-none-any.whl',
    'lxml-6.0.2-cp313-cp313-pyodide_2025_0_wasm32.whl',
    'mpmath-1.3.0-py3-none-any.whl',
    'networkx-3.5-py3-none-any.whl',
    'pint-0.25-py3-none-any.whl',
    'platformdirs-4.5.0-py3-none-any.whl',
    'sympy-1.14.0-py3-none-any.whl',
    'typing_extensions-4.15.0-py3-none-any.whl',
    'ucumvert-0.3.0-py3-none-any.whl',
]

//==============================================================================

const SETUP_FRAMEWORK = `
import traceback
from bg2cellml.bondgraph.framework import get_framework

def show_issues(issues, debug=False):
    for issue in issues:
        if debug:
            text = traceback.format_exception(issue)
        else:
            text = traceback.format_exception_only(issue)
        print(''.join(text))

framework = await get_framework()
if framework.has_issues:
    show_issues(framework.issues)
`
//==============================================================================

let pyodide = globalThis.pyodide

let bg2cellmlGlobals: PyProxy

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

sleep(0.1).then(async () => {
    pyodide = globalThis.pyodide
    await navigator.locks.request("initialise-framework", async (lock) => {
        if (!globalThis.pyodideInitialised) {
            pyodide.registerJsModule("oximock", rdfModule)
            await pyodide.loadPackage(pythonPackages.map(pkg => `/pyodide/wheels/${pkg}`))
            bg2cellmlGlobals = pyodide.globals.get("dict")()
            globalThis.pyodideInitialised = true
        }
        if (!bg2cellmlGlobals.has('framework')) {
            await pyodide.runPythonAsync(SETUP_FRAMEWORK, { globals: bg2cellmlGlobals })
        }
        console.log('Initialised BG-RDF framework 😊...')
    })
})

//==============================================================================
//==============================================================================

export async function rdfTest() {
    await runTest(pyodide)
}

//==============================================================================

export async function bg2cellml() {
    await pyodide.runPythonAsync(`
import pyodide.http

model_uri = '/models/bvc.ttl'
response = await pyodide.http.pyfetch(model_uri)
if response.ok:
    debug = True
    no_issues = True

    model_source = await response.text()
    bgrdf_model = framework.make_bondgraph_model('http://localhost/models/bvc.ttl', model_source, debug=debug)
    if bgrdf_model.has_issues:
        print('Issues loading Bondgraph Model:')
        show_issues(bgrdf_model.issues, debug)
        no_issues = False
    else:
        print('Model processed... 😊😊')

    if no_issues:
        cellml_model = bgrdf_model.make_cellml_model()
        cellml = cellml_model.to_xml()
        ##print(cellml)
        print('😊 😊 😊')
`, { globals: bg2cellmlGlobals })
}

//==============================================================================
//==============================================================================
