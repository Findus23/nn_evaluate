import {
    hiddenBias,
    hiddenLayerSize,
    hiddenWeight,
    means,
    outputBias,
    outputLayerSize,
    outputWeight,
    stds
} from "./data";
import {relu, sigmoid} from "./utils";

function calculate_layer(layerSize: number,
                         parentLayer: number[],
                         weight: number[][],
                         bias: number[]): number[] {
    const new_layer: number[] = []
    for (let hl = 0; hl < layerSize; hl++) {
        let node = 0
        for (let parent = 0; parent < parentLayer.length; parent++) {
            node += parentLayer[parent] * weight[hl][parent]
        }
        node += bias[hl]
        new_layer.push(node)
    }
    return new_layer
}

function evaluate(input: number[]): number[] {
    const scaled_input = scale_input(input)
    let hidden_layer = calculate_layer(hiddenLayerSize, scaled_input, hiddenWeight, hiddenBias)
    hidden_layer = hidden_layer.map(i => relu(i))
    let output_layer = calculate_layer(outputLayerSize, hidden_layer, outputWeight, outputBias)
    output_layer = output_layer.map(i => sigmoid(i))
    return output_layer
}

function scale_input(input: number[]): number[] {
    return input.map((val, idx) =>
      ((val - means[idx]) / stds[idx])
    )
}

export function calculate_grid(mass: number, gamma: number, wp: number, wt: number, resolution: number, mode: number): number[] {
    const start = performance.now()
    const datalist: number[] = []
    for (let j = 0; j < resolution; j++) {
        for (let i = 0; i < resolution; i++) {
            const entry = [
                i / resolution * 60,
                j / resolution * 5.5,
                mass,
                gamma,
                wt,
                wp
            ];
            datalist.push(evaluate(entry)[mode])
        }
    }
    const end = performance.now()
    console.info((end - start) + " ms")
    return datalist
}
