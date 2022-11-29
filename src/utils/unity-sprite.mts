import { Image } from './Image.mjs'
import { crop } from './processing.mjs'

export type UnitySprite = {
    Base: {
        m_Name: string
        m_Rect: {
            x: number
            y: number
            width: number
            height: number
        }
    }
}

export async function extractUnitySprite(image: Image, sprites: UnitySprite[], name: string) {
    const sprite = sprites.find((sprite) => sprite.Base.m_Name === name)
    if (!sprite) throw `Sprite ${name} not found`

    return crop(
        image,
        sprite.Base.m_Rect.x,
        image.height - sprite.Base.m_Rect.y - sprite.Base.m_Rect.height,
        sprite.Base.m_Rect.width,
        sprite.Base.m_Rect.height
    )
}
