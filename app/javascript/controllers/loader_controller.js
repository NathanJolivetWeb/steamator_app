import { Controller } from "@hotwired/stimulus";
import Chart from 'chart.js/auto';

export default class extends Controller {
  static values = {url: String}
  static targets = ["owner"]

  predictionData = {};

  async connect() {
    // console.log('connected loader controller');
    // console.log(this.urlValue);

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

    // this.predictionData = data

    const price = parseInt(document.querySelector('.price').innerHTML)
    console.log(price)

    const test = [0, 1196.0159354994682, 1786.6204034798154, 2368.503842698848, 2939.0239488445104, 3495.7513494190907, 4036.5065320359863, 4559.387547062699, 5062.788063000096, 5545.405887120118, 6006.242534282825, 6444.5948039764235, 6860.039593021406, 7252.413325405963, 7621.787428647448, 7968.441243214187, 8292.833637995165, 8595.574442388293, 8877.396615288053, 9139.129871469178, 9381.67629130529, 9605.988261127557, 9813.048935643454, 10003.855284145864, 10179.403679490157, 10340.677911759678, 10488.639454632084, 10624.21977842715, 10748.314486117975, 10861.779043738397, 10965.425881413934, 11060.022652877657, 11146.291457456733, 11224.908847237188, 11296.506461967449, 11361.67215415522, 11420.951485975938, 11474.849497532869, 11523.83266238214, 11568.330960909803, 11608.74001508542, 11645.423239361446, 11678.713972136045, 11708.917560377418, 11736.313376865763, 11761.156755194297, 11783.680832331653, 11804.098292324163, 11822.603007737232, 11839.371577817165, 11854.564764201981, 11868.32882641319, 11880.796760398633, 11892.089444137411]

    const array = Array.from(Array(52).keys());

    const predictions_array = array.map((e) => {
      return 12000 * (1 - 2 * (1 / (1 + Math.exp(0 + 0.1 * e))));
    });

    const predictions_revenues_array = array.map((e) => {
      return price * (12000 * (1 - 2 * (1 / (1 + Math.exp(0 + 0.1 * e)))));
    });


    // predictions_array.unshift(0);
    // console.log(data);
    // console.log(array);

    console.log(predictions_array);

    const unpackedArray = predictions_array.map((elem, index) => {
      if (predictions_array[index - 1] != undefined) {
        return Math.round(elem - predictions_array[index - 1])
      } else {
        return Math.round(elem)
      }
    })

    console.log('array', predictions_array);
    console.log('unpacked', unpackedArray);
    console.log('last value', predictions_array[51]);
    console.log('unpacked sum', unpackedArray.reduce((p, c) => p + c));

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: array,
        datasets: [{
          label: 'Revenues per weeks prediction',
          data: predictions_revenues_array,
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

    const ctx2 = document.getElementById('myChart2').getContext('2d');
    const myChart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: array,
            datasets: [{
                label: 'Sales per weeks prediction',
                data: unpackedArray,
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
