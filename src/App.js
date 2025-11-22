import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

function App() {
  const [products, setProducts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate 100 mock products
    const generatedProducts = [];
    for (let i = 0; i < 100; i++) {
      generatedProducts.push({
        name: `Product ${i + 1}`,
        inventory: Math.floor(Math.random() * 50) + 1,
        avgSales: Math.floor(Math.random() * 100) + 10,
        leadTime: Math.floor(Math.random() * 10) + 1,
      });
    }
    setProducts(generatedProducts);
  }, []);

  const handlePredict = async () => {
    setLoading(true);
    // Create model
    const model = tf.sequential();
    model.add(
      tf.layers.dense({ inputShape: [3], units: 8, activation: "relu" })
    );
    model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

    // Compile model
    model.compile({
      optimizer: "adam",
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });

    // Training data
    const trainingData = tf.tensor2d([
      [20, 50, 3],
      [5, 30, 5],
      [15, 40, 4],
      [8, 60, 2],
    ]);
    const outputData = tf.tensor2d([[0], [1], [0], [1]]);

    // Train model
    await model.fit(trainingData, outputData, {
      epochs: 200,
      shuffle: true,
    });

    // Predict for each product
    const preds = [];
    for (const product of products) {
      const input = tf.tensor2d([
        [product.inventory, product.avgSales, product.leadTime],
      ]);
      const result = model.predict(input);
      const value = (await result.data())[0];
      preds.push(value > 0.5 ? "Reorder" : "No Reorder");
    }
    setPredictions(preds);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Inventory Reorder Predictor Dashboard</h2>
      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Predicting..." : "Predict for All Products"}
      </button>
      <table style={{ marginTop: 20, borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Product Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Inventory</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Avg Sales</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Lead Time</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Prediction</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.name}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.inventory}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.avgSales}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.leadTime}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {predictions[index] || "Not predicted"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
