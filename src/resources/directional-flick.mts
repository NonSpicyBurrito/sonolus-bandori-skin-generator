import { fetchImage, fetchJson } from '../fetch.mjs'
import { rotate } from '../utils/processing.mjs'
import { Server } from '../utils/servers.mjs'
import { extractUnitySprite } from '../utils/unity-sprite.mjs'
import { clean } from './index.mjs'

export type DirectionalFlickResources = Awaited<ReturnType<typeof getDirectionalFlickResources>>

export const getDirectionalFlickResources = async (id: string, server: Server, texts: string[]) => {
    const name = clean(id)
    console.log('Getting directional flick', name, 'resources...')

    console.log('Fetching assets...')
    const [spritesImage, sprites] = await Promise.all([
        fetchImage(
            `/assets/${server}/ingameskin/noteskin/directionalflickskin${id}_rip/DirectionalFlickSprites.png`
        ),
        fetchJson(`/assets/${server}/ingameskin/noteskin/directionalflickskin${id}_rip/.sprites`),
    ])

    console.log('Extracting sprites...')

    const noteLeft = await rotate(
        await extractUnitySprite(spritesImage, sprites, 'note_flick_l_3'),
        90
    )
    const noteRight = await rotate(
        await extractUnitySprite(spritesImage, sprites, 'note_flick_r_3'),
        -90
    )

    const markerLeft = await rotate(
        await extractUnitySprite(spritesImage, sprites, 'note_flick_top_l'),
        90
    )
    const markerRight = await rotate(
        await extractUnitySprite(spritesImage, sprites, 'note_flick_top_r'),
        -90
    )

    return {
        name,
        texts,

        noteLeft,
        noteRight,

        markerLeft,
        markerRight,
    }
}
