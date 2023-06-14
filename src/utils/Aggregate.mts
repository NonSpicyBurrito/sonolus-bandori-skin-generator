export class Aggregate {
    public count = 0
    public mean = 0
    public m2 = 0

    public update(value: number): void {
        this.count += 1
        const delta = value - this.mean
        this.mean += delta / this.count
        const delta2 = value - this.mean
        this.m2 += delta * delta2
    }
}
