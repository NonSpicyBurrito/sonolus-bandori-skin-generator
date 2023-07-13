import fetch from 'node-fetch'
import { Image } from './utils/Image.mjs'

export const fetchImage = async (path: string) => {
    const response = await fetch(`https://bestdori.com${path}`)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    try {
        return await Image.fromBuffer(buffer)
    } catch (error) {
        console.error('[ERROR]', error)
        console.log('Using fallback for', path)

        return await Image.fromFile(`fallback${path}`)
    }
}

export const fetchJson = async (path: string) => {
    const response = await fetch(`https://bestdori.com${path}`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (await response.json()) as any
}
