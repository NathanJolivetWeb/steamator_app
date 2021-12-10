import { Controller } from "@hotwired/stimulus";
import Chart from 'chart.js/auto';

export default class extends Controller {
  static values = { url: String }
  static targets = ["owner","revenues"]

  predictionData = {};

  async connect() {

    // Do not remove
    // fetch(urls)
    //   .then(blob => blob.json())
    //   .then(data => {
    //     console.log(data);
    //     console.log(data.owner);
    //     this.ownerTarget.insertAdjacentHTML('afterend', `<p>${data.owner}</p>`);
    //     this.predictionData = data
    //   });


    const urls = JSON.parse(this.urlValue);

    const blob0 = await fetch(urls[0]);
    const data0 = await blob0.json();
    const topic_proba = JSON.stringify(data0);

    const url1 = urls[1] + '&topic_proba=' + topic_proba
    console.log(url1);

    const blob1 = await fetch(urls[1] + '&topic_proba=' + topic_proba);
    const data1 = await blob1.json();

    this.predictionData = data0

    let { owner_estimated, slope, intercept, price } = data1;
    if (slope == 0) {
      slope = 0.001;
    }

    const revenues = owner_estimated * price
    this.ownerTarget.insertAdjacentHTML('afterend', `<h2 class='text-center'>${Math.round(owner_estimated)}</h2>`);
    this.revenuesTarget.insertAdjacentHTML('afterend', `<h2 class='text-center'>${Math.round(revenues)}</h2>`);

    const array = Array.from(Array(52).keys());

    const predictions_array = array.map((e) => {
      return owner_estimated * (1 - 2 * (1 / (1 + Math.exp((intercept / 1000)+ slope * e))));
    });

    const predictions_revenues_array = array.map((e) => {
      return price * (owner_estimated * (1 - 2 * (1 / (1 + Math.exp((intercept / 1000)+ slope * e)))));
    });

    const unpackedArray = predictions_array.map((elem, index) => {
      if (predictions_array[index - 1] != undefined) {
        return Math.round(elem - predictions_array[index - 1])
      } else {
        return Math.round(elem)
      }
    })

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: array,
        datasets: [{
          label: 'Annual revennue',
          data: predictions_revenues_array,
          fill: false,
          borderColor: '#57758F',
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

    const ctx2 = document.getElementById('myChart2').getContext('2d');
    const myChart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: array,
            datasets: [{
                label: 'Sales per weeks prediction',
                data: unpackedArray,
                fill: false,
                borderColor: '#57758F',
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
