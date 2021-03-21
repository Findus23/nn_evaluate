import data from "../pytorch_model.json"

export const means: number[] = data.means
export const stds: number[] = data.stds
export const hiddenWeight: number[][] = data["hidden.weight"]
export const hiddenBias: number[] = data["hidden.bias"]
export const outputWeight: number[][] = data["output.weight"]
export const outputBias: number[] = data["output.bias"]
export const hiddenLayerSize = hiddenBias.length
export const inputLayerSize = means.length
export const outputLayerSize = outputBias.length


const ang = 30
const v = 2
const m = 1e24
const gamma = 0.6
const wp = 1e-4
const wt = wp

export const input = [ang, v, m, gamma, wt, wp]
