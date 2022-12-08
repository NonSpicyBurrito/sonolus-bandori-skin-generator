import {
    compressSync,
    customSkinSprite,
    SkinData,
    SkinDataTransform,
    SkinSprite,
} from 'sonolus-core'
import { DirectionalFlickResources } from './resources/directional-flick.mjs'
import { LaneResources } from './resources/lane.mjs'
import { MiscResources } from './resources/misc.mjs'
import { NoteResources } from './resources/note.mjs'
import { Image } from './utils/Image.mjs'
import { crop, resize, rotate } from './utils/processing.mjs'
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
    const directionalFlickTransform = scale(1.2, 1.3)

    return [
        {
            ids: [SkinSprite.NoteHeadNeutral, SkinSprite.NoteTailNeutral],
            image: note.noteNeutral,
            transform: noteTransform,
        },
        {
            ids: [SkinSprite.NoteHeadRed, SkinSprite.NoteTailRed],
            image: note.noteRed,
            transform: noteTransform,
        },
        {
            ids: [SkinSprite.NoteHeadGreen, SkinSprite.NoteTailGreen],
            image: note.noteGreen,
            transform: noteTransform,
        },
        {
            ids: [SkinSprite.NoteHeadBlue, SkinSprite.NoteTailBlue],
            image: note.noteBlue,
            transform: noteTransform,
        },
        {
            ids: [SkinSprite.NoteHeadYellow, SkinSprite.NoteTailYellow],
            image: note.noteYellow,
            transform: noteTransform,
        },
        {
            ids: [SkinSprite.NoteHeadPurple, SkinSprite.NoteTailPurple],
            image: note.notePurple,
            transform: noteTransform,
        },
        {
            ids: [SkinSprite.NoteHeadCyan, SkinSprite.NoteTailCyan],
            image: note.noteCyan,
            transform: noteTransform,
        },

        {
            ids: [SkinSprite.NoteTickNeutral],
            image: note.tickNeutral,
            transform: noteTransform,
        },
        {
            ids: [SkinSprite.NoteTickRed],
            image: note.tickRed,
            transform: noteTransform,
        },
        {
            ids: [SkinSprite.NoteTickGreen],
            image: note.tickGreen,
            transform: noteTransform,
        },
        {
            ids: [SkinSprite.NoteTickBlue],
            image: note.tickBlue,
            transform: noteTransform,
        },
        {
            ids: [SkinSprite.NoteTickYellow],
            image: note.tickYellow,
            transform: noteTransform,
        },
        {
            ids: [SkinSprite.NoteTickPurple],
            image: note.tickPurple,
            transform: noteTransform,
        },
        {
            ids: [SkinSprite.NoteTickCyan],
            image: note.tickCyan,
            transform: noteTransform,
        },

        {
            ids: [SkinSprite.NoteConnectionNeutral],
            image: note.longNeutral,
            transform: longTransform,
        },
        {
            ids: [SkinSprite.NoteConnectionRed],
            image: note.longRed,
            transform: longTransform,
        },
        {
            ids: [SkinSprite.NoteConnectionGreen],
            image: note.longGreen,
            transform: longTransform,
        },
        {
            ids: [SkinSprite.NoteConnectionBlue],
            image: note.longBlue,
            transform: longTransform,
        },
        {
            ids: [SkinSprite.NoteConnectionYellow],
            image: note.longYellow,
            transform: longTransform,
        },
        {
            ids: [SkinSprite.NoteConnectionPurple],
            image: note.longPurple,
            transform: longTransform,
        },
        {
            ids: [SkinSprite.NoteConnectionCyan],
            image: note.longCyan,
            transform: longTransform,
        },

        {
            ids: [SkinSprite.NoteConnectionNeutralSeamless],
            image: note.slideNeutral,
            transform: longTransform,
        },
        {
            ids: [SkinSprite.NoteConnectionRedSeamless],
            image: note.slideRed,
            transform: longTransform,
        },
        {
            ids: [SkinSprite.NoteConnectionGreenSeamless],
            image: note.slideGreen,
            transform: longTransform,
        },
        {
            ids: [SkinSprite.NoteConnectionBlueSeamless],
            image: note.slideBlue,
            transform: longTransform,
        },
        {
            ids: [SkinSprite.NoteConnectionYellowSeamless],
            image: note.slideYellow,
            transform: longTransform,
        },
        {
            ids: [SkinSprite.NoteConnectionPurpleSeamless],
            image: note.slidePurple,
            transform: longTransform,
        },
        {
            ids: [SkinSprite.NoteConnectionCyanSeamless],
            image: note.slideCyan,
            transform: longTransform,
        },

        {
            ids: [
                SkinSprite.SimultaneousConnectionNeutral,
                SkinSprite.SimultaneousConnectionNeutralSeamless,
            ],
            image: note.simLineNeutral,
            transform: simLineTransform,
        },
        {
            ids: [
                SkinSprite.SimultaneousConnectionRed,
                SkinSprite.SimultaneousConnectionRedSeamless,
            ],
            image: note.simLineRed,
            transform: simLineTransform,
        },
        {
            ids: [
                SkinSprite.SimultaneousConnectionGreen,
                SkinSprite.SimultaneousConnectionGreenSeamless,
            ],
            image: note.simLineGreen,
            transform: simLineTransform,
        },
        {
            ids: [
                SkinSprite.SimultaneousConnectionBlue,
                SkinSprite.SimultaneousConnectionBlueSeamless,
            ],
            image: note.simLineBlue,
            transform: simLineTransform,
        },
        {
            ids: [
                SkinSprite.SimultaneousConnectionYellow,
                SkinSprite.SimultaneousConnectionYellowSeamless,
            ],
            image: note.simLineYellow,
            transform: simLineTransform,
        },
        {
            ids: [
                SkinSprite.SimultaneousConnectionPurple,
                SkinSprite.SimultaneousConnectionPurpleSeamless,
            ],
            image: note.simLinePurple,
            transform: simLineTransform,
        },
        {
            ids: [
                SkinSprite.SimultaneousConnectionCyan,
                SkinSprite.SimultaneousConnectionCyanSeamless,
            ],
            image: note.simLineCyan,
            transform: simLineTransform,
        },

        {
            ids: [SkinSprite.DirectionalMarkerNeutral],
            image: note.markerNeutral,
            transform: markerTransform,
        },
        {
            ids: [SkinSprite.DirectionalMarkerRed],
            image: note.markerRed,
            transform: markerTransform,
        },
        {
            ids: [SkinSprite.DirectionalMarkerGreen],
            image: note.markerGreen,
            transform: markerTransform,
        },
        {
            ids: [SkinSprite.DirectionalMarkerBlue],
            image: note.markerBlue,
            transform: markerTransform,
        },
        {
            ids: [SkinSprite.DirectionalMarkerYellow],
            image: note.markerYellow,
            transform: markerTransform,
        },
        {
            ids: [SkinSprite.DirectionalMarkerPurple],
            image: note.markerPurple,
            transform: markerTransform,
        },
        {
            ids: [SkinSprite.DirectionalMarkerCyan],
            image: note.markerCyan,
            transform: markerTransform,
        },

        {
            ids: [SkinSprite.StageMiddle],
            image: lane.middle,
            transform: unitTransform,
        },

        {
            ids: [SkinSprite.StageLeftBorder, SkinSprite.StageLeftBorderSeamless],
            image: lane.borderLeft,
            transform: unitTransform,
        },
        {
            ids: [SkinSprite.StageRightBorder, SkinSprite.StageRightBorderSeamless],
            image: lane.borderRight,
            transform: unitTransform,
        },
        {
            ids: [SkinSprite.StageTopBorder, SkinSprite.StageTopBorderSeamless],
            image: lane.borderTop,
            transform: unitTransform,
        },
        {
            ids: [SkinSprite.StageBottomBorder, SkinSprite.StageBottomBorderSeamless],
            image: lane.borderBottom,
            transform: unitTransform,
        },

        {
            ids: [SkinSprite.StageTopLeftCorner],
            image: lane.cornerTopLeft,
            transform: unitTransform,
        },
        {
            ids: [SkinSprite.StageTopRightCorner],
            image: lane.cornerTopRight,
            transform: unitTransform,
        },
        {
            ids: [SkinSprite.StageBottomLeftCorner],
            image: lane.cornerBottomLeft,
            transform: unitTransform,
        },
        {
            ids: [SkinSprite.StageBottomRightCorner],
            image: lane.cornerBottomRight,
            transform: unitTransform,
        },

        {
            ids: [SkinSprite.Lane, SkinSprite.LaneSeamless],
            image: lane.lane,
            transform: unitTransform,
        },
        {
            ids: [SkinSprite.LaneAlternative, SkinSprite.LaneAlternativeSeamless],
            image: lane.laneAlternative,
            transform: unitTransform,
        },

        {
            ids: [SkinSprite.JudgmentLine],
            image: lane.line,
            transform: unitTransform,
        },
        {
            ids: [SkinSprite.NoteSlot],
            image: lane.slot,
            transform: unitTransform,
        },

        {
            ids: [SkinSprite.StageCover],
            image: misc.cover,
            transform: unitTransform,
        },

        {
            ids: [customSkinSprite(1, 1)],
            image: lane.stageImage,
            transform: unitTransform,
        },
        {
            ids: [customSkinSprite(1, 2)],
            image: lane.lineImage,
            transform: scale(1, lane.lineImage.height / lane.lineImage.width / (90 / 1800)),
        },

        {
            ids: [customSkinSprite(1, 11)],
            image: directionalFlick.noteLeft,
            transform: directionalFlickTransform,
        },
        {
            ids: [customSkinSprite(1, 12)],
            image: directionalFlick.noteRight,
            transform: directionalFlickTransform,
        },

        {
            ids: [customSkinSprite(1, 21)],
            image: directionalFlick.markerLeft,
            transform: markerTransform,
        },
        {
            ids: [customSkinSprite(1, 22)],
            image: directionalFlick.markerRight,
            transform: markerTransform,
        },
    ]
}

const getLayouts = (sprites: { ids: number[]; image: Image; transform: SkinDataTransform }[]) => {
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
    version: 2,
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
        ids: number[]
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
                layout.ids.map((id) => ({
                    id,
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
        ids: number[]
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
                toThumbnailComposition(await rotate(directionalFlick.noteLeft, -90), 0, 1, 2, 1),
                toThumbnailComposition(await rotate(directionalFlick.noteRight, 90), 4, 1, 2, 1),
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
