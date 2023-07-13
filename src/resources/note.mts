import { fetchImage, fetchJson } from '../fetch.mjs'
import { colorize, greyScale, recolor } from '../utils/processing.mjs'
import { Server } from '../utils/servers.mjs'
import { extractUnitySprite } from '../utils/unity-sprite.mjs'
import { clean } from './index.mjs'

export type NoteResources = Awaited<ReturnType<typeof getNoteResources>>

export const getNoteResources = async (id: string, server: Server, texts: string[]) => {
    const name = clean(id)
    console.log('Getting note', name, 'resources...')

    console.log('Fetching assets...')
    const [spritesImage, longImage, slideImage, simLineImage, sprites] = await Promise.all([
        fetchImage(`/assets/${server}/ingameskin/noteskin/${id}_rip/RhythmGameSprites.png`),
        fetchImage(`/assets/${server}/ingameskin/noteskin/${id}_rip/longNoteLine.png`),
        fetchImage(`/assets/${server}/ingameskin/noteskin/${id}_rip/longNoteLine2.png`),
        fetchImage(`/assets/${server}/ingameskin/noteskin/${id}_rip/simultaneous_line.png`),
        fetchJson(`/assets/${server}/ingameskin/noteskin/${id}_rip/.sprites`),
    ])

    console.log('Extracting sprites...')

    const noteNeutral = await extractUnitySprite(spritesImage, sprites, 'note_normal_16_3')
    const noteRed = await extractUnitySprite(spritesImage, sprites, 'note_flick_3')
    const noteGreen = await extractUnitySprite(spritesImage, sprites, 'note_long_3')
    const noteYellow = await extractUnitySprite(spritesImage, sprites, 'note_skill_3')
    const noteCyan = await extractUnitySprite(spritesImage, sprites, 'note_normal_3')
    const noteBlue = recolor(noteCyan, 240)
    const notePurple = recolor(noteCyan, 300)

    const tickGreen = await extractUnitySprite(spritesImage, sprites, 'note_slide_among')
    const tickNeutral = greyScale(tickGreen)
    const tickRed = recolor(tickGreen, 0)
    const tickBlue = recolor(tickGreen, 240)
    const tickYellow = recolor(tickGreen, 60)
    const tickPurple = recolor(tickGreen, 300)
    const tickCyan = recolor(tickGreen, 180)

    const markerRed = await extractUnitySprite(spritesImage, sprites, 'note_flick_top')
    const markerNeutral = greyScale(markerRed)
    const markerGreen = recolor(markerRed, 120)
    const markerBlue = recolor(markerRed, 240)
    const markerYellow = recolor(markerRed, 60)
    const markerPurple = recolor(markerRed, 300)
    const markerCyan = recolor(markerRed, 180)

    const simLineNeutral = simLineImage
    const simLineRed = colorize(simLineNeutral, 0, 50)
    const simLineGreen = colorize(simLineNeutral, 120, 50)
    const simLineBlue = colorize(simLineNeutral, 240, 50)
    const simLineYellow = colorize(simLineNeutral, 60, 50)
    const simLinePurple = colorize(simLineNeutral, 300, 50)
    const simLineCyan = colorize(simLineNeutral, 180, 50)

    const longGreen = longImage
    const longNeutral = greyScale(longGreen)
    const longRed = recolor(longGreen, 0)
    const longBlue = recolor(longGreen, 240)
    const longYellow = recolor(longGreen, 60)
    const longPurple = recolor(longGreen, 300)
    const longCyan = recolor(longGreen, 180)

    const slideGreen = slideImage
    const slideNeutral = greyScale(slideGreen)
    const slideRed = recolor(slideGreen, 0)
    const slideBlue = recolor(slideGreen, 240)
    const slideYellow = recolor(slideGreen, 60)
    const slidePurple = recolor(slideGreen, 300)
    const slideCyan = recolor(slideGreen, 180)

    return {
        name,
        texts,

        noteNeutral,
        noteRed,
        noteGreen,
        noteBlue,
        noteYellow,
        notePurple,
        noteCyan,

        tickNeutral,
        tickRed,
        tickGreen,
        tickBlue,
        tickYellow,
        tickPurple,
        tickCyan,

        markerNeutral,
        markerRed,
        markerGreen,
        markerBlue,
        markerYellow,
        markerPurple,
        markerCyan,

        longNeutral,
        longRed,
        longGreen,
        longBlue,
        longYellow,
        longPurple,
        longCyan,

        slideNeutral,
        slideRed,
        slideGreen,
        slideBlue,
        slideYellow,
        slidePurple,
        slideCyan,

        simLineNeutral,
        simLineRed,
        simLineGreen,
        simLineBlue,
        simLineYellow,
        simLinePurple,
        simLineCyan,
    }
}
