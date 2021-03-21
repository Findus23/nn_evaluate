export const relu = (x: number) => Math.max(0, x);

export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));


export function valuesToImage(values: number[]): Uint8ClampedArray {
    const imagedata: number[] = [];
    for (let i = 0; i < values.length; i++) {
        const color = 255 - Math.round(values[i] * 255);
        imagedata.push(color, color, color / 2 + 127, 255)
    }
    return new Uint8ClampedArray(imagedata)
}
