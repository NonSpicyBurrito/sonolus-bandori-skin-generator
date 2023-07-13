import { Image } from '../utils/Image.mjs'

export type MiscResources = Awaited<ReturnType<typeof getMiscResources>>

export const getMiscResources = async () => {
    console.log('Generating misc resources...')

    const cover = new Image(Buffer.from([16, 16, 16, 255]), 1, 1, 4)

    return {
        cover,
    }
}
