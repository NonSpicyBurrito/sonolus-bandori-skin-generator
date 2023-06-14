import convert from 'color-convert'
import { KernelEnum } from 'sharp'
import { Image } from './Image.mjs'

export const resize = async (
    image: Image,
    width: number,
    height: number,
    kernel: keyof KernelEnum = 'nearest',
) =>
    new Image(
        await image.toSharp().resize(width, height, { fit: 'fill', kernel }).toBuffer(),
        width,
        height,
        image.channels,
    )

export const crop = async (image: Image, x: number, y: number, width: number, height: number) =>
    new Image(
        await image.toSharp().extract({ left: x, top: y, width, height }).toBuffer(),
        width,
        height,
        image.channels,
    )

export const rotate = async (image: Image, angle: -90 | 90 | 180) =>
    new Image(
        await image.toSharp().rotate(angle).toBuffer(),
        angle === 180 ? image.width : image.height,
        angle === 180 ? image.height : image.width,
        image.channels,
    )

export const greyScale = (image: Image) => {
    if (image.channels !== 4) throw 'Unsupported'

    const result = Image.create(image.width, image.height, image.channels)
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const value =
                0.21 * image.get(x, y, 0) + 0.72 * image.get(x, y, 1) + 0.07 * image.get(x, y, 2)

            result.set(x, y, 0, value)
            result.set(x, y, 1, value)
            result.set(x, y, 2, value)
            result.set(x, y, 3, image.get(x, y, 3))
        }
    }

    return result
}

export const recolor = (image: Image, h: number) => {
    if (image.channels !== 4) throw 'Unsupported channels'
    const result = Image.create(image.width, image.height, image.channels)

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const [, s, v] = convert.rgb.hsv(
                image.get(x, y, 0),
                image.get(x, y, 1),
                image.get(x, y, 2),
            )
            const [r, g, b] = convert.hsv.rgb([h, s, v])

            result.set(x, y, 0, r)
            result.set(x, y, 1, g)
            result.set(x, y, 2, b)
            result.set(x, y, 3, image.get(x, y, 3))
        }
    }

    return result
}

export const colorize = (image: Image, h: number, s: number) => {
    if (image.channels !== 4) throw 'Unsupported channels'
    const result = Image.create(image.width, image.height, image.channels)

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const [, , v] = convert.rgb.hsv(
                image.get(x, y, 0),
                image.get(x, y, 1),
                image.get(x, y, 2),
            )
            const [r, g, b] = convert.hsv.rgb([h, s, v])

            result.set(x, y, 0, r)
            result.set(x, y, 1, g)
            result.set(x, y, 2, b)
            result.set(x, y, 3, image.get(x, y, 3))
        }
    }

    return result
}
