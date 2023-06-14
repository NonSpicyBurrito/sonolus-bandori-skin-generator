import { fetchJson } from './fetch.mjs'
import { clean } from './resources/index.mjs'
import { Server, servers } from './utils/servers.mjs'

export type Catalog = Awaited<ReturnType<typeof getCatalog>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Asset = any

export const getCatalog = async () => {
    console.log('Getting catalog...')

    console.log('Fetching asset info...')
    const assets = await Promise.all(
        servers.map((server) => fetchJson(`/api/explorer/${server}/assets/_info.json`)),
    )

    console.log('Fetching names...')
    const [noteInfo, directionalFlickInfo, laneInfo] = await Promise.all(
        ['notes', 'directionalFlicks', 'lanes'].map((name) =>
            fetchJson(`/api/skin/${name}.all.3.json`),
        ),
    )

    return collectAssets(assets, {
        notes: {
            info: noteInfo,
            getter: (asset) => asset.ingameskin.noteskin,
            prefix: 'skin',
        },
        directionalFlicks: {
            info: directionalFlickInfo,
            getter: (asset) => asset.ingameskin.noteskin,
            prefix: 'directionalflickskin',
        },
        lanes: {
            info: laneInfo,
            getter: (asset) => asset.ingameskin.fieldskin,
            prefix: 'skin',
        },
    })
}

type Info = Record<string, { assetBundleName: string; skinName: string[] }>

const collectAssets = <
    T extends Record<string, { info: Info; getter: (asset: Asset) => Asset; prefix: string }>,
>(
    assets: Asset[],
    collector: T,
) =>
    Object.fromEntries(
        Object.entries(collector).map(([key, { info, getter, prefix }]) => [
            key,
            Object.entries(
                assets
                    .map((asset) =>
                        Object.keys(getter(asset))
                            .filter((name) => name.startsWith(prefix))
                            .filter((name) => !name.endsWith('sample')),
                    )
                    .reduce(
                        (all, names, index) => ({
                            ...Object.fromEntries(
                                names.map((name) => [name.slice(prefix.length), servers[index]]),
                            ),
                            ...all,
                        }),
                        {} as Record<string, Server>,
                    ),
            ).map(([id, server]) => ({ id, server, texts: getTexts(info, id) })),
        ]),
    ) as { [K in keyof T]: { id: string; server: Server; texts: string[] }[] }

const getTexts = (info: Info, id: string) => {
    const fallback = capitalize(clean(id))

    const skin = Object.values(info).find((skin) => skin.assetBundleName === `skin${id}`)
    if (!skin) return servers.map(() => fallback)

    return servers.map(
        (_, i) => skin.skinName[i] || skin.skinName.filter((name) => !!name)[0] || fallback,
    )
}

const capitalize = (text: string) => text[0].toUpperCase() + text.slice(1)
