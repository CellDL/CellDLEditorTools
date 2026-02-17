/******************************************************************************

CellDL Editor Tools

Copyright (c) 2022 - 2026 David Brooks

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

const CELLDL_METADATA_ID = 'celldl-rdf-metadata'

const TurtleContentType = 'text/turtle'

//==============================================================================

export function getBgRdf(celldl: string): string {
    const parser = new DOMParser()
    const document = parser.parseFromString(celldl, 'image/svg+xml') as XMLDocument

    const metadataElement = document.getElementById(CELLDL_METADATA_ID)
    if (
        metadataElement &&
        (!('contentType' in metadataElement.dataset) || metadataElement.dataset.contentType === TurtleContentType)
    ) {
        for (const childNode of metadataElement.childNodes) {
            if (childNode.nodeName === '#cdata-section') {
                return (<CDATASection>childNode).data
            }
        }
    }
    return ''
}

//==============================================================================
//==============================================================================
