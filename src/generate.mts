import { compressSync, SkinData, SkinDataTransform, SkinSpriteName } from 'sonolus-core'
import { DirectionalFlickResources } from './resources/directional-flick.mjs'
import { LaneResources } from './resources/lane.mjs'
import { MiscResources } from './resources/misc.mjs'
import { NoteResources } from './resources/note.mjs'
import { Image } from './utils/Image.mjs'
import { crop, resize } from './utils/processing.mjs'
import { localizations, servers } from './utils/servers.mjs'
import { scale } from './utils/transform.mjs'

export const generate = async (
    note: NoteResources,
    directionalFlick: DirectionalFlickResources,
    lane: LaneResources,
    misc: MiscResources,
    packageName: string,
    packageVersion: string
) => {
    const name = `bandori-${note.name}-${directionalFlick.name}-${lane.name}`
    console.log('Generating', name, 'resources...')

    const sprites = getSprites(note, directionalFlick, lane, misc)
    const layouts = getLayouts(sprites)

    const info = getInfo(
        note.texts,
        directionalFlick.texts,
        lane.texts,
        packageName,
        packageVersion
    )
    const data = getData(layouts)
    const texture = await getTexture(layouts)
    const thumbnail = await getThumbnail(note, directionalFlick, lane)

    return {
        name,

        info,
        data,
        texture,
        thumbnail,
    }
}

const getSprites = (
    note: NoteResources,
    directionalFlick: DirectionalFlickResources,
    lane: LaneResources,
    misc: MiscResources
) => {
    const unitTransform = scale(1, 1)

    const noteTransform = scale(1.3, 1.2)
    const longTransform = unitTransform
    const markerTransform = scale(0.75, 0.75)
    const simLineTransform = scale(1, 0.5)

    return [
        {
            names: [SkinSpriteName.NoteHeadNeutral, SkinSpriteName.NoteTailNeutral],
            image: note.noteNeutral,
            transform: noteTransform,
        },
        {
            names: [SkinSpriteName.NoteHeadRed, SkinSpriteName.NoteTailRed],
            image: note.noteRed,
            transform: noteTransform,
        },
        {
            names: [SkinSpriteName.NoteHeadGreen, SkinSpriteName.NoteTailGreen],
            image: note.noteGreen,
            transform: noteTransform,
        },
        {
            names: [SkinSpriteName.NoteHeadBlue, SkinSpriteName.NoteTailBlue],
            image: note.noteBlue,
            transform: noteTransform,
        },
        {
            names: [SkinSpriteName.NoteHeadYellow, SkinSpriteName.NoteTailYellow],
            image: note.noteYellow,
            transform: noteTransform,
        },
        {
            names: [SkinSpriteName.NoteHeadPurple, SkinSpriteName.NoteTailPurple],
            image: note.notePurple,
            transform: noteTransform,
        },
        {
            names: [SkinSpriteName.NoteHeadCyan, SkinSpriteName.NoteTailCyan],
            image: note.noteCyan,
            transform: noteTransform,
        },

        {
            names: [SkinSpriteName.NoteTickNeutral],
            image: note.tickNeutral,
            transform: noteTransform,
        },
        {
            names: [SkinSpriteName.NoteTickRed],
            image: note.tickRed,
            transform: noteTransform,
        },
        {
            names: [SkinSpriteName.NoteTickGreen],
            image: note.tickGreen,
            transform: noteTransform,
        },
        {
            names: [SkinSpriteName.NoteTickBlue],
            image: note.tickBlue,
            transform: noteTransform,
        },
        {
            names: [SkinSpriteName.NoteTickYellow],
            image: note.tickYellow,
            transform: noteTransform,
        },
        {
            names: [SkinSpriteName.NoteTickPurple],
            image: note.tickPurple,
            transform: noteTransform,
        },
        {
            names: [SkinSpriteName.NoteTickCyan],
            image: note.tickCyan,
            transform: noteTransform,
        },

        {
            names: [SkinSpriteName.NoteConnectionNeutral],
            image: note.longNeutral,
            transform: longTransform,
        },
        {
            names: [SkinSpriteName.NoteConnectionRed],
            image: note.longRed,
            transform: longTransform,
        },
        {
            names: [SkinSpriteName.NoteConnectionGreen],
            image: note.longGreen,
            transform: longTransform,
        },
        {
            names: [SkinSpriteName.NoteConnectionBlue],
            image: note.longBlue,
            transform: longTransform,
        },
        {
            names: [SkinSpriteName.NoteConnectionYellow],
            image: note.longYellow,
            transform: longTransform,
        },
        {
            names: [SkinSpriteName.NoteConnectionPurple],
            image: note.longPurple,
            transform: longTransform,
        },
        {
            names: [SkinSpriteName.NoteConnectionCyan],
            image: note.longCyan,
            transform: longTransform,
        },

        {
            names: [SkinSpriteName.NoteConnectionNeutralSeamless],
            image: note.slideNeutral,
            transform: longTransform,
        },
        {
            names: [SkinSpriteName.NoteConnectionRedSeamless],
            image: note.slideRed,
            transform: longTransform,
        },
        {
            names: [SkinSpriteName.NoteConnectionGreenSeamless],
            image: note.slideGreen,
            transform: longTransform,
        },
        {
            names: [SkinSpriteName.NoteConnectionBlueSeamless],
            image: note.slideBlue,
            transform: longTransform,
        },
        {
            names: [SkinSpriteName.NoteConnectionYellowSeamless],
            image: note.slideYellow,
            transform: longTransform,
        },
        {
            names: [SkinSpriteName.NoteConnectionPurpleSeamless],
            image: note.slidePurple,
            transform: longTransform,
        },
        {
            names: [SkinSpriteName.NoteConnectionCyanSeamless],
            image: note.slideCyan,
            transform: longTransform,
        },

        {
            names: [
                SkinSpriteName.SimultaneousConnectionNeutral,
                SkinSpriteName.SimultaneousConnectionNeutralSeamless,
            ],
            image: note.simLineNeutral,
            transform: simLineTransform,
        },
        {
            names: [
                SkinSpriteName.SimultaneousConnectionRed,
                SkinSpriteName.SimultaneousConnectionRedSeamless,
            ],
            image: note.simLineRed,
            transform: simLineTransform,
        },
        {
            names: [
                SkinSpriteName.SimultaneousConnectionGreen,
                SkinSpriteName.SimultaneousConnectionGreenSeamless,
            ],
            image: note.simLineGreen,
            transform: simLineTransform,
        },
        {
            names: [
                SkinSpriteName.SimultaneousConnectionBlue,
                SkinSpriteName.SimultaneousConnectionBlueSeamless,
            ],
            image: note.simLineBlue,
            transform: simLineTransform,
        },
        {
            names: [
                SkinSpriteName.SimultaneousConnectionYellow,
                SkinSpriteName.SimultaneousConnectionYellowSeamless,
            ],
            image: note.simLineYellow,
            transform: simLineTransform,
        },
        {
            names: [
                SkinSpriteName.SimultaneousConnectionPurple,
                SkinSpriteName.SimultaneousConnectionPurpleSeamless,
            ],
            image: note.simLinePurple,
            transform: simLineTransform,
        },
        {
            names: [
                SkinSpriteName.SimultaneousConnectionCyan,
                SkinSpriteName.SimultaneousConnectionCyanSeamless,
            ],
            image: note.simLineCyan,
            transform: simLineTransform,
        },

        {
            names: [SkinSpriteName.DirectionalMarkerNeutral],
            image: note.markerNeutral,
            transform: markerTransform,
        },
        {
            names: [SkinSpriteName.DirectionalMarkerRed],
            image: note.markerRed,
            transform: markerTransform,
        },
        {
            names: [SkinSpriteName.DirectionalMarkerGreen],
            image: note.markerGreen,
            transform: markerTransform,
        },
        {
            names: [SkinSpriteName.DirectionalMarkerBlue],
            image: note.markerBlue,
            transform: markerTransform,
        },
        {
            names: [SkinSpriteName.DirectionalMarkerYellow],
            image: note.markerYellow,
            transform: markerTransform,
        },
        {
            names: [SkinSpriteName.DirectionalMarkerPurple],
            image: note.markerPurple,
            transform: markerTransform,
        },
        {
            names: [SkinSpriteName.DirectionalMarkerCyan],
            image: note.markerCyan,
            transform: markerTransform,
        },

        {
            names: [SkinSpriteName.StageMiddle],
            image: lane.middle,
            transform: unitTransform,
        },

        {
            names: [SkinSpriteName.StageLeftBorder, SkinSpriteName.StageLeftBorderSeamless],
            image: lane.borderLeft,
            transform: unitTransform,
        },
        {
            names: [SkinSpriteName.StageRightBorder, SkinSpriteName.StageRightBorderSeamless],
            image: lane.borderRight,
            transform: unitTransform,
        },
        {
            names: [SkinSpriteName.StageTopBorder, SkinSpriteName.StageTopBorderSeamless],
            image: lane.borderTop,
            transform: unitTransform,
        },
        {
            names: [SkinSpriteName.StageBottomBorder, SkinSpriteName.StageBottomBorderSeamless],
            image: lane.borderBottom,
            transform: unitTransform,
        },

        {
            names: [SkinSpriteName.StageTopLeftCorner],
            image: lane.cornerTopLeft,
            transform: unitTransform,
        },
        {
            names: [SkinSpriteName.StageTopRightCorner],
            image: lane.cornerTopRight,
            transform: unitTransform,
        },
        {
            names: [SkinSpriteName.StageBottomLeftCorner],
            image: lane.cornerBottomLeft,
            transform: unitTransform,
        },
        {
            names: [SkinSpriteName.StageBottomRightCorner],
            image: lane.cornerBottomRight,
            transform: unitTransform,
        },

        {
            names: [SkinSpriteName.Lane, SkinSpriteName.LaneSeamless],
            image: lane.lane,
            transform: unitTransform,
        },
        {
            names: [SkinSpriteName.LaneAlternative, SkinSpriteName.LaneAlternativeSeamless],
            image: lane.laneAlternative,
            transform: unitTransform,
        },

        {
            names: [SkinSpriteName.JudgmentLine],
            image: lane.line,
            transform: unitTransform,
        },
        {
            names: [SkinSpriteName.NoteSlot],
            image: lane.slot,
            transform: unitTransform,
        },

        {
            names: [SkinSpriteName.StageCover],
            image: misc.cover,
            transform: unitTransform,
        },

        {
            names: ['Bandori Stage'],
            image: lane.stageImage,
            transform: unitTransform,
        },
        {
            names: ['Bandori Judgment Line'],
            image: lane.lineImage,
            transform: scale(1, lane.lineImage.height / lane.lineImage.width / (90 / 1800)),
        },

        {
            names: ['Bandori Directional Flick Note Left'],
            image: directionalFlick.noteLeft,
            transform: noteTransform,
        },
        {
            names: ['Bandori Directional Flick Note Right'],
            image: directionalFlick.noteRight,
            transform: noteTransform,
        },

        {
            names: ['Bandori Directional Flick Marker Left'],
            image: directionalFlick.markerLeft,
            transform: markerTransform,
        },
        {
            names: ['Bandori Directional Flick Marker Right'],
            image: directionalFlick.markerRight,
            transform: markerTransform,
        },
    ]
}

const getLayouts = (sprites: { names: string[]; image: Image; transform: SkinDataTransform }[]) => {
    const spaces = [{ x: 0, y: 0, width: 2048, height: 2048 }]

    return sprites
        .sort(
            (a, b) =>
                (b.image.width + 2) * (b.image.height + 2) -
                (a.image.width + 2) * (a.image.height + 2)
        )
        .map((sprite) => {
            const width = sprite.image.width + 2
            const height = sprite.image.height + 2

            const spaceIndex = spaces.findIndex(
                (space) => space.width >= width && space.height >= height
            )
            if (spaceIndex == -1) throw 'Insufficient size'

            const space = spaces[spaceIndex]
            spaces.splice(spaceIndex, 1)

            if (space.height > height) {
                spaces.unshift({
                    x: space.x,
                    y: space.y + height,
                    width: space.width,
                    height: space.height - height,
                })
            }

            if (space.width > width) {
                spaces.unshift({
                    x: space.x + width,
                    y: space.y,
                    width: space.width - width,
                    height: height,
                })
            }

            return {
                ...sprite,
                x: space.x + 1,
                y: space.y + 1,
            }
        })
}

const getInfo = (
    noteTexts: string[],
    directionalFlickTexts: string[],
    laneTexts: string[],
    packageName: string,
    packageVersion: string
) => ({
    version: 3,
    title: Object.fromEntries(
        servers.map((_, i) => [
            localizations[i],
            `${noteTexts[i]} / ${directionalFlickTexts[i]} / ${laneTexts[i]}`,
        ])
    ),
    subtitle: {
        en: 'BanG Dream! Girls Band Party!',
        ja: 'バンドリ！ ガールズバンドパーティ！',
        ko: '뱅드림! 걸즈 밴드 파티!',
        zhs: 'BanG Dream! 少女乐团派对!',
        zht: 'BanG Dream! 少女樂團派對',
    },
    author: {
        en: 'Burrito',
    },
    description: {
        en: [
            'Generated by:',
            packageName,
            '',
            'Version:',
            packageVersion,
            '',
            'GitHub Repository:',
            'https://github.com/NonSpicyBurrito/sonolus-bandori-skin-generator',
        ].join('\n'),
    },
})

const getData = (
    layouts: {
        x: number
        y: number
        names: string[]
        image: Image
        transform: SkinDataTransform
    }[]
) => {
    const data: SkinData = {
        width: 2048,
        height: 2048,
        interpolation: true,
        sprites: layouts
            .map((layout) =>
                layout.names.map((name) => ({
                    name,
                    x: layout.x,
                    y: layout.y,
                    w: layout.image.width,
                    h: layout.image.height,
                    transform: layout.transform,
                }))
            )
            .flat(),
    }

    return compressSync(data)
}

const getTexture = async (
    layouts: {
        x: number
        y: number
        names: string[]
        image: Image
        transform: SkinDataTransform
    }[]
) =>
    Image.create(2048, 2048, 4)
        .toSharp()
        .composite(
            [
                layouts.map((layout) => toComposition(layout.image, layout.x, layout.y)),
                await Promise.all(
                    layouts.map(({ image, x, y }) =>
                        crop(image, 0, 0, 1, image.height).then((pad) =>
                            toComposition(pad, x - 1, y)
                        )
                    )
                ),
                await Promise.all(
                    layouts.map(({ image, x, y }) =>
                        crop(image, 0, 0, image.width, 1).then((pad) =>
                            toComposition(pad, x, y - 1)
                        )
                    )
                ),
                await Promise.all(
                    layouts.map(({ image, x, y }) =>
                        crop(image, image.width - 1, 0, 1, image.height).then((pad) =>
                            toComposition(pad, x + image.width, y)
                        )
                    )
                ),
                await Promise.all(
                    layouts.map(({ image, x, y }) =>
                        crop(image, 0, image.height - 1, image.width, 1).then((pad) =>
                            toComposition(pad, x, y + image.height)
                        )
                    )
                ),
                await Promise.all(
                    layouts.map(({ image, x, y }) =>
                        crop(image, 0, 0, 1, 1).then((pad) => toComposition(pad, x - 1, y - 1))
                    )
                ),
                await Promise.all(
                    layouts.map(({ image, x, y }) =>
                        crop(image, image.width - 1, 0, 1, 1).then((pad) =>
                            toComposition(pad, x + image.width, y - 1)
                        )
                    )
                ),
                await Promise.all(
                    layouts.map(({ image, x, y }) =>
                        crop(image, 0, image.height - 1, 1, 1).then((pad) =>
                            toComposition(pad, x - 1, y + image.height)
                        )
                    )
                ),
                await Promise.all(
                    layouts.map(({ image, x, y }) =>
                        crop(image, image.width - 1, image.height - 1, 1, 1).then((pad) =>
                            toComposition(pad, x + image.width, y + image.height)
                        )
                    )
                ),
            ].flat()
        )
        .png({ compressionLevel: 9 })

const getThumbnail = async (
    note: NoteResources,
    directionalFlick: DirectionalFlickResources,
    lane: LaneResources
) => {
    const width = (480 * 1.35) / 0.875
    const height = (width * lane.lineImage.height) / lane.lineImage.width

    const line = await crop(
        await resize(lane.lineImage, Math.round(width), Math.round(height), 'lanczos3'),
        Math.round((width - 480) / 2),
        0,
        480,
        Math.round(height)
    )

    const toThumbnailComposition = async (
        image: Image,
        x: number,
        y: number,
        w: number,
        h: number
    ) => toComposition(await resize(image, w * 80, h * 80, 'lanczos3'), x * 80, y * 80)

    return Image.create(480, 480, 4)
        .toSharp()
        .composite(
            await Promise.all([
                toThumbnailComposition(lane.stageImage, 0, 1.5, 6, 4),
                toComposition(line, 0, 440 - Math.round(height / 2)),
                toThumbnailComposition(note.noteRed, 0, 0, 2, 1),
                toThumbnailComposition(note.noteCyan, 2, 0, 2, 1),
                toThumbnailComposition(note.noteGreen, 4, 0, 2, 1),
                toThumbnailComposition(directionalFlick.noteLeft, 0, 1, 2, 1),
                toThumbnailComposition(directionalFlick.noteRight, 4, 1, 2, 1),
            ])
        )
        .png({ compressionLevel: 9 })
}

const toComposition = (image: Image, x: number, y: number) => ({
    input: image.data,
    raw: {
        width: image.width,
        height: image.height,
        channels: image.channels,
    },
    left: x,
    top: y,
})
