import sharp, { Channels } from 'sharp'

export class Image {
    public readonly data: Buffer
    public readonly width: number
    public readonly height: number
    public readonly channels: Channels

    public static async fromBuffer(buffer: Buffer) {
        const { width, height, channels } = await sharp(buffer).metadata()
        if (!width || !height || !channels) throw 'Unexpected metadata'

        const data = await sharp(buffer).raw().toBuffer()

        return new Image(data, width, height, channels)
    }

    public static async fromFile(path: string) {
        const { width, height, channels } = await sharp(path).metadata()
        if (!width || !height || !channels) throw 'Unexpected metadata'

        const data = await sharp(path).raw().toBuffer()

        return new Image(data, width, height, channels)
    }

    public static create(width: number, height: number, channels: Channels) {
        return new Image(Buffer.alloc(width * height * channels), width, height, channels)
    }

    public constructor(data: Buffer, width: number, height: number, channels: Channels) {
        this.data = data
        this.width = width
        this.height = height
        this.channels = channels
    }

    public get(x: number, y: number, c: number): number {
        return this.data[y * this.width * this.channels + x * this.channels + c]
    }

    public set(x: number, y: number, c: number, value: number): void {
        this.data[y * this.width * this.channels + x * this.channels + c] = value
    }

    public interpolateX(x: number, y: number, c: number): number {
        if (Number.isInteger(x)) return this.get(x, y, c)

        const lx = Math.floor(x)
        const rx = Math.ceil(x)
        return this.get(lx, y, c) * (rx - x) + this.get(rx, y, c) * (x - lx)
    }

    public interpolateY(x: number, y: number, c: number): number {
        if (Number.isInteger(y)) return this.get(x, y, c)

        const ty = Math.floor(y)
        const by = Math.ceil(y)
        return this.get(x, ty, c) * (by - y) + this.get(x, by, c) * (y - ty)
    }

    public get raw() {
        return {
            width: this.width,
            height: this.height,
            channels: this.channels,
        }
    }

    public toSharp() {
        return sharp(this.data, { raw: this.raw })
    }

    public toFile(path: string) {
        return this.toSharp().toFile(path)
    }
}
