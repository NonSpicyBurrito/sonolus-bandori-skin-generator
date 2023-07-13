import { fetchImage } from '../fetch.mjs'
import { Aggregate } from '../utils/Aggregate.mjs'
import { Image } from '../utils/Image.mjs'
import { rotate } from '../utils/processing.mjs'
import { Server } from '../utils/servers.mjs'
import { clean } from './index.mjs'

export type LaneResources = Awaited<ReturnType<typeof getLaneResources>>

export const getLaneResources = async (id: string, server: Server, texts: string[]) => {
    const name = clean(id)
    console.log('Getting lane', name, 'resources...')

    console.log('Fetching assets...')
    const [stageImage, lineImage] = await Promise.all([
        fetchImage(`/assets/${server}/ingameskin/fieldskin/${id}_rip/bg_line_rhythm.png`),
        fetchImage(`/assets/${server}/ingameskin/fieldskin/${id}_rip/game_play_line.png`),
    ])

    console.log('Extracting sprites...')

    const topRatio = minimize((x) => getTopRatioFitness(stageImage, x), 0.01, 0.025, 0.0001)
    const flattened = stretchTop(stageImage, topRatio)

    const laneRatio = minimize((x) => getLaneRatioFitness(flattened, x), 0.13, 0.135, 0.0001)
    const lane = mirrorAverageHeight(
        merge(flattened, [0.5 - laneRatio * 2, 0.5, 0.5 + laneRatio * 2], laneRatio),
    )
    const laneAlternative = mirrorAverageHeight(
        merge(
            flattened,
            [0.5 - laneRatio * 3, 0.5 - laneRatio * 1, 0.5 + laneRatio * 1, 0.5 + laneRatio * 3],
            laneRatio,
        ),
    )

    const middle = middleAverage(lane)

    const borderRatio = 0.5 - laneRatio * 3.5
    const borderLeft = merge(mirrorAverageHeight(flattened), [borderRatio / 2], borderRatio)
    const borderRight = await rotate(borderLeft, 180)
    const borderTop = await rotate(borderLeft, 90)
    const borderBottom = await rotate(borderLeft, -90)

    const cornerTopLeft = cornerize(borderLeft)
    const cornerTopRight = await rotate(cornerTopLeft, 90)
    const cornerBottomLeft = await rotate(cornerTopLeft, -90)
    const cornerBottomRight = await rotate(cornerTopLeft, 180)

    const line = flattenWidth(lineImage)

    const slot = circularize(mirrorAverageWidth(line))

    return {
        name,
        texts,

        stageImage,
        lineImage,

        lane,
        laneAlternative,

        middle,

        borderLeft,
        borderRight,
        borderTop,
        borderBottom,

        cornerTopLeft,
        cornerTopRight,
        cornerBottomLeft,
        cornerBottomRight,

        line,

        slot,
    }
}

const minimize = (f: (x: number) => number, min: number, max: number, interval: number) => {
    const mem = new Map<number, number>()
    const get = (x: number) => {
        const y = mem.get(x)
        if (y === undefined) {
            const y = f(x)
            mem.set(x, y)
            return y
        } else {
            return y
        }
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const mid = (min + max) / 2

        const fMin = get(min)
        const fMid = get(mid)
        const fMax = get(max)

        if (fMin > fMid !== fMid > fMax) break

        if (fMin > fMax) {
            min = mid
        } else {
            max = mid
        }
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (max - min <= interval) break

        const mid = (min + max) / 2
        const left = (min + mid) / 2
        const right = (mid + max) / 2

        const fLeft = get(left)
        const fMid = get(mid)
        const fRight = get(right)

        if (fLeft < fMid && fLeft < fRight) {
            max = mid
        } else if (fMid < fLeft && fMid < fRight) {
            min = left
            max = right
        } else if (fRight < fMid && fRight < fLeft) {
            min = mid
        } else {
            throw 'Unexpected ordering'
        }
    }

    return (min + max) / 2
}

const getTopRatioFitness = (image: Image, topRatio: number) => {
    const { width, height, channels } = image
    const aggregates = [...Array(width * channels)].map(() => new Aggregate())

    const center = (width - 1) / 2
    for (let y = 0; y < height; y++) {
        const ratio = topRatio + (y / (height - 1)) * (1 - topRatio)

        for (let x = 0; x < width; x++) {
            const nx = (x - center) * ratio + center

            for (let c = 0; c < channels; c++) {
                aggregates[x * channels + c].update(image.interpolateX(nx, y, c))
            }
        }
    }

    return aggregates.reduce((sum, { m2 }) => sum + m2, 0)
}

const getLaneRatioFitness = (image: Image, laneRatio: number) => {
    const { width, channels } = image
    let sum = 0

    const offset = width * laneRatio * 2
    for (let x = 0; x < width; x++) {
        if (x < width * 0.1) continue
        if (x > width * 0.9) continue

        const nx = x - offset
        if (nx < 0) continue

        for (let c = 0; c < channels; c++) {
            sum += Math.abs(image.get(x, 0, c) - image.interpolateX(nx, 0, c))
        }
    }

    return sum
}

const stretchTop = (image: Image, topRatio: number) => {
    const { width, height, channels } = image
    const sums = Array<number>(width * channels).fill(0)

    const center = (width - 1) / 2
    for (let y = 0; y < height; y++) {
        const ratio = topRatio + (y / (height - 1)) * (1 - topRatio)

        for (let x = 0; x < width; x++) {
            const nx = (x - center) * ratio + center

            for (let c = 0; c < channels; c++) {
                sums[x * channels + c] += image.interpolateX(nx, y, c)
            }
        }
    }

    return new Image(Buffer.from(sums.map((sum) => Math.round(sum / height))), width, 1, channels)
}

const merge = (image: Image, centers: number[], size: number) => {
    const { width, channels } = image
    const nWidth = Math.ceil(width * size)
    const sums = Array<number>(nWidth * channels).fill(0)

    for (const center of centers) {
        const offset = (center - size / 2) * (width - 1)

        for (let x = 0; x < nWidth; x++) {
            const nx = (x / (nWidth - 1)) * (width * size) + offset

            for (let c = 0; c < channels; c++) {
                sums[x * channels + c] += image.interpolateX(nx, 0, c)
            }
        }
    }

    return new Image(
        Buffer.from(sums.map((sum) => Math.round(sum / centers.length))),
        nWidth,
        1,
        channels,
    )
}

const mirrorAverageHeight = (image: Image) => {
    const { width, channels } = image
    const output = Image.create(width, 1, channels)

    for (let x = 0; x < width; x++) {
        for (let c = 0; c < channels; c++) {
            output.set(
                x,
                0,
                c,
                Math.round((image.get(x, 0, c) + image.get(width - 1 - x, 0, c)) / 2),
            )
        }
    }

    return output
}

const middleAverage = (image: Image) => {
    const { width, channels } = image
    const sums = Array<number>(channels).fill(0)

    let count = 0
    for (let x = 0; x < width; x++) {
        if (x / (width - 1) < 0.1) continue
        if (x / (width - 1) > 0.9) continue

        count++

        for (let c = 0; c < channels; c++) {
            sums[c] += image.get(x, 0, c)
        }
    }

    return new Image(Buffer.from(sums.map((sum) => Math.round(sum / count))), 1, 1, channels)
}

const cornerize = (image: Image) => {
    const { width, channels } = image
    const output = Image.create(width, width, channels)

    for (let y = 0; y < width; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < channels; c++) {
                output.set(x, y, c, image.get(Math.min(x, y), 0, c))
            }
        }
    }

    return output
}

const flattenWidth = (image: Image) => {
    const { width, height, channels } = image
    const sums = Array<number>(height * channels).fill(0)

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < channels; c++) {
                sums[y * channels + c] += image.get(x, y, c)
            }
        }
    }

    return new Image(Buffer.from(sums.map((sum) => Math.round(sum / width))), 1, height, channels)
}

const mirrorAverageWidth = (image: Image) => {
    const { height, channels } = image
    const output = Image.create(1, height, channels)

    for (let y = 0; y < height; y++) {
        for (let c = 0; c < channels; c++) {
            output.set(
                0,
                y,
                c,
                Math.round((image.get(0, y, c) + image.get(0, height - 1 - y, c)) / 2),
            )
        }
    }

    return output
}

const circularize = (image: Image) => {
    const { height, channels } = image
    const output = Image.create(height, height, channels)

    const center = (height - 1) / 2
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < height; x++) {
            const radius = Math.sqrt((x - center) * (x - center) + (y - center) * (y - center))
            const ny = Math.max(0, center - radius)

            for (let c = 0; c < channels; c++) {
                output.set(x, y, c, image.interpolateY(0, ny, c))
            }
        }
    }

    return output
}
