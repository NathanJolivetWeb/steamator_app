import { Controller } from "@hotwired/stimulus";
import Chart from 'chart.js/auto';

export default class extends Controller {
  static values = {url: String}
  static targets = ["owner"]

  predictionData = {};

  async connect() {
    console.log('connected loader controller');
    console.log(this.urlValue);

    // fetch(this.urlValue)
    //   .then(blob => blob.json())
    //   .then(data => {
    //     console.log(data);
    //     console.log(data.owner);
    //     this.ownerTarget.insertAdjacentHTML('afterend', `<p>${data.owner}</p>`);
    //     this.predictionData = data
    //   });

    const blob = await fetch(this.urlValue)
    const data = await blob.json()
    // console.log(data.owner);
    // console.log(data.intercept);
    // console.log(data.slope);
    // console.log(data.owner);
    // this.ownerTarget.insertAdjacentHTML('afterend', `<p>${data.owner}</p>`);

    this.predictionData = data

    const array = Array.from(Array(53).keys());

    const predictions_array = array.map((e) => {
      return data.owner * (1 - 2 * (1 / (1 + Math.exp(0.2 + 0.1 * e))));
    });
    predictions_array.unshift(0);
    console.log(data);
    console.log(array);
    console.log(predictions_array);

    // for (const num of [1,2,3,4]) {
    //   console.log(num)
    // }

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: array,
            datasets: [{
                label: 'Sales Prediction',
                data: predictions_array,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                borderWidth: 2,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
  }
}
