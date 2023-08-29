import { Image } from '../utils/Image.mjs'

export type MiscResources = Awaited<ReturnType<typeof getMiscResources>>

export const getMiscResources = async () => {
    console.log('Generating misc resources...')

    const cover = new Image(Buffer.from([16, 16, 16, 255]), 1, 1, 4)

    const gridNeutral = new Image(Buffer.from([128, 128, 128, 255]), 1, 1, 4)
    const gridRed = new Image(Buffer.from([255, 64, 64, 255]), 1, 1, 4)
    const gridGreen = new Image(Buffer.from([64, 255, 64, 255]), 1, 1, 4)
    const gridBlue = new Image(Buffer.from([64, 64, 255, 255]), 1, 1, 4)
    const gridYellow = new Image(Buffer.from([255, 255, 64, 255]), 1, 1, 4)
    const gridPurple = new Image(Buffer.from([255, 64, 255, 255]), 1, 1, 4)
    const gridCyan = new Image(Buffer.from([64, 255, 255, 255]), 1, 1, 4)

    return {
        cover,

        gridNeutral,
        gridRed,
        gridGreen,
        gridBlue,
        gridYellow,
        gridPurple,
        gridCyan,
    }
}
