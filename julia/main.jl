using JSON

data = JSON.parsefile("../pytorch_model.json")

means = data["means"]
stds = data["stds"]
hidden_weight = data["hidden.weight"]
hidden_bias = data["hidden.bias"]
output_weight = data["output.weight"]
output_bias = data["output.bias"]

relu(x) = max(0, x)

sigmoid(x) = 1 / (1 + exp(-x))

function scale_input(input)
    return (input .- means) ./ stds
end

function calculate_layer(layer_size, parent_layer, weight, bias)
    new_layer = []
    for hl = 1:layer_size
        node = 0
        for parent = 1:length(parent_layer)
            node += parent_layer[parent] * weight[hl][parent]
        end
        node += bias[hl]
        push!(new_layer, node)
    end
    return new_layer
end

function evaluate(input)
    scaled_input = scale_input(input)
    hidden_layer = calculate_layer(
        length(hidden_bias),
        scaled_input,
        hidden_weight,
        hidden_bias,
    )
    hidden_layer = relu.(hidden_layer)
    output_layer = calculate_layer(
        length(output_bias),
        hidden_layer,
        output_weight,
        output_bias,
    )
    output_layer = sigmoid.(output_layer)
    return output_layer
end

ang = 30
m = 1e24
v = 2
gamma = 0.6
wp = wt = 1e-4
println(evaluate([ang, v, m, gamma, wt, wp]))

@timev evaluate([ang, v, m, gamma, wt, wp])
