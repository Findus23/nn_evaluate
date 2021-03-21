use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::BufReader;
use std::time::Instant;

fn scale_input(model: &Model, input: Vec<f64>) -> Vec<f64> {
    let mut z: Vec<f64> = Vec::new();
    for i in 0..input.len() {
        z.push((input[i] - model.means[i]) / (model.stds[i]))
    }
    return z;
}

fn calculate_layer(
    layer_size: &usize,
    parent_layer: Vec<f64>,
    weight: &Vec<Vec<f64>>,
    bias: &Vec<f64>,
) -> Vec<f64> {
    let mut new_layer: Vec<f64> = Vec::new();
    for hl in 0..*layer_size {
        let mut node: f64 = 0.;
        for parent in 0..parent_layer.len() {
            node += parent_layer[parent] * weight[hl][parent]
        }
        node += bias[hl];
        new_layer.push(node);
    }
    return new_layer;
}

fn relu(x: f64) -> f64 {
    if x >= 0. {
        return x;
    }
    return 0.;
}

fn sigmoid(x: f64) -> f64 {
    return 1. / (1. + (-x).exp());
}

fn evaluate(model: Model, input: Vec<f64>) -> Vec<f64> {
    let scaled_input = scale_input(&model, Vec::from(input));
    let hidden_layer_unfinished = calculate_layer(
        &model.hidden_bias.len(), scaled_input,
        &model.hidden_weight, &model.hidden_bias,
    );
    let mut hidden_layer: Vec<f64> = Vec::new();

    for value in hidden_layer_unfinished {
        hidden_layer.push(relu(value))
    }
    let output_layer_unfinished = calculate_layer(
        &model.output_bias.len(), hidden_layer,
        &model.output_weight, &model.output_bias,
    );
    let mut output_layer: Vec<f64> = Vec::new();

    for value in output_layer_unfinished {
        output_layer.push(sigmoid(value))
    }
    return output_layer;
}

fn main() {
    let model = load_json();
    let ang = 30.;
    let v = 2.;
    let m = 1e24;
    let gamma = 0.6;
    let wp = 1e-4;
    let wt = wp;
    let input = [ang, v, m, gamma, wt, wp];
    let start = Instant::now();
    let result=evaluate(model, Vec::from(input));
    let duration = start.elapsed();
    println!("{:?}", result);
    println!("{:?}", duration);
}
#[derive(Serialize, Deserialize)]
struct Model {
    means: Vec<f64>,
    stds: Vec<f64>,
    #[serde(alias = "hidden.weight")]
    hidden_weight: Vec<Vec<f64>>,
    #[serde(alias = "hidden.bias")]
    hidden_bias: Vec<f64>,
    #[serde(alias = "output.weight")]
    output_weight: Vec<Vec<f64>>,
    #[serde(alias = "output.bias")]
    output_bias: Vec<f64>,
}

fn load_json() -> Model {
    let file = File::open("../../pytorch_model.json").expect("can't open file");
    let reader = BufReader::new(file);

    let v: Model = serde_json::from_reader(reader).expect("can't parse json");
    return v;
}


