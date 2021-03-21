# Toy implementation of Neural Network evaluation in multiple languages

Neural network trained with pytorch:
```python
class Network(nn.Module):
    def __init__(self):
        super().__init__()
        self.hidden = nn.Linear(6, 50)
        self.output = nn.Linear(50, 3)

        self.sigmoid = nn.Sigmoid()
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.hidden(x)
        x = self.relu(x)
        x = self.output(x)
        x = self.sigmoid(x)

        return x
```

Proper solution (typescript version): https://nn.lw1.at/
