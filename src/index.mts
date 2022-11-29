import fs from 'fs-extra'
import { getCatalog } from './catalog.mjs'
import { generate } from './generate.mjs'
import { getResources } from './resources/index.mjs'

const packageName = process.env.npm_package_name
if (!packageName) throw 'Package name not available'

const packageVersion = process.env.npm_package_version
if (!packageVersion) throw 'Package version not available'

fs.emptyDirSync('output')

const catalog = await getCatalog()

const resources = await getResources(catalog)

for (const note of resources.notes) {
    for (const directionalFlick of resources.directionalFlicks) {
        for (const lane of resources.lanes) {
            const { name, info, data, texture, thumbnail } = await generate(
                note,
                directionalFlick,
                lane,
                resources.misc,
                packageName,
                packageVersion
            )

            fs.outputJsonSync(`output/${name}/info.json`, info, { spaces: 4 })
            fs.outputFileSync(`output/${name}/data`, data)
            await texture.toFile(`output/${name}/texture.png`)
            await thumbnail.toFile(`output/${name}/thumbnail.png`)
        }
    }
}
