import json
from dataclasses import dataclass
from math import exp
from time import monotonic_ns
from typing import List

Layer = List[float]


def relu(x):
    return max(0, x)


def sigmoid(x):
    return 1 / (1 + exp(-x))


@dataclass
class Model:
    means: List[float]  # 6
    stds: List[float]  # 6
    hidden_weight: List[List[float]]  # 50x6
    hidden_bias: List[float]  # 50
    output_weight: List[List[float]]  # 3x50
    output_bias: List[float]  # 3

    @property
    def hidden_layer_size(self):
        return len(self.hidden_bias)

    @property
    def input_layer_size(self):
        return len(self.means)

    @property
    def output_layer_size(self):
        return len(self.output_bias)

    def calculate_layer(self, layer_size, parent_layer_size, parent_layer, weight, bias) -> Layer:
        new_layer = []
        for hl in range(layer_size):
            node = 0
            for parent in range(parent_layer_size):
                node += parent_layer[parent] * weight[hl][parent]
            node += bias[hl]
            new_layer.append(node)
        return new_layer

    def evaluate(self, input: List[float]):
        scaled_input = self.scale_input(input)
        hidden_layer = self.calculate_layer(
            layer_size=self.hidden_layer_size,
            parent_layer_size=self.input_layer_size,
            parent_layer=scaled_input,
            weight=self.hidden_weight,
            bias=self.hidden_bias
        )
        hidden_layer = [relu(x) for x in hidden_layer]
        output_layer = self.calculate_layer(
            layer_size=self.output_layer_size,
            parent_layer_size=self.hidden_layer_size,
            parent_layer=hidden_layer,
            weight=self.output_weight,
            bias=self.output_bias
        )
        print(output_layer)

        output_layer = [sigmoid(x) for x in output_layer]
        print(output_layer)
        return output_layer

    def scale_input(self, input: List[float]):
        result = []
        for index, parameter in enumerate(input):
            result.append((parameter - self.means[index]) / self.stds[index])
        return result


with open("../pytorch_model.json") as f:
    data = json.load(f)
    model = Model(
        hidden_weight=data["hidden.weight"],
        hidden_bias=data["hidden.bias"],
        output_weight=data["output.weight"],
        output_bias=data["output.bias"],
        means=data["means"],
        stds=data["stds"],
    )
    ang = 30
    v = 2
    m = 1e24
    gamma = 0.6
    wp = wt = 1e-4
    start = monotonic_ns()
    for _ in range(1000):
        model.evaluate([ang, v, m, gamma, wt, wp])
        exit()
    end = monotonic_ns()
    print((end - start) / 1000 / 1000)
    # [0.6921, 0.8989, 0.9919]
