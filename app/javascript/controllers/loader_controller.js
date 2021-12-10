import { Controller } from "@hotwired/stimulus";
import Chart from 'chart.js/auto';

export default class extends Controller {
  static values = { url: String }
  static targets = ["owner","revenues"]
  predictionData = {};

  async connect() {
    await this.fetchApiData();
    this.insertValuesInHTML();
    this.buildCharts();
  }

  async priceChange() {
    await this.fetchApiData(true);
    this.editCharts();
    this.editValuesHTML();
  }

  insertValuesInHTML() {
    // Insert values in HTML
    let { owner_estimated, price } = this.predictionData;
    const revenues = owner_estimated * price
    this.ownerTarget.insertAdjacentHTML('afterend', `<h2 id='sales' class='text-center'>${Math.round(owner_estimated)}</h2>`);
    this.revenuesTarget.insertAdjacentHTML('afterend', `<h2 id='revenu' class='text-center'>${Math.round(revenues)}</h2>`);
  }

  editValuesHTML() {
    // Edit values in HTML
    let { owner_estimated, price } = this.predictionData;
    const revenues = owner_estimated * price

    const sales = document.getElementById('sales');
    sales.innerHTML = "";
    sales.innerHTML = `<h2 id='sales' class='text-center'>${Math.round(owner_estimated)}</h2>`

    const revenu = document.getElementById('revenu');
    revenu.innerHTML = "";
    revenu.innerHTML = `<h2 id='revenu' class='text-center'>${Math.round(revenues)}</h2>`
  }

  editCharts() {
    // Edit charts in HTML
    const charts = document.getElementById('charts');

    charts.innerHTML = "";
    charts.innerHTML = `<canvas class="mb-5" id="myChart2" width="120" height="60"></canvas>
       <canvas class="mt-5 mb-5" id="myChart" width="120" height="60"></canvas>`

    this.buildCharts();
  }

  async fetchApiData(changePrice = false) {
    let [url0 , url1] = JSON.parse(this.urlValue);

    if (changePrice) {
      const newPrice = document.getElementById('demo').innerHTML;
      url1 = url1.substring(0, url1.length - 2) + '=' + newPrice;
    }

    const blob0 = await fetch(url0);
    const data0 = await blob0.json();
    const topic_proba = JSON.stringify(data0);

    const blob1 = await fetch(url1 + '&topic_proba=' + topic_proba);
    const data1 = await blob1.json();

    this.predictionData = data1;
  }

  computeGraphPoints() {
    // Calculate values for graphs
    let { owner_estimated, slope, intercept, price } = this.predictionData;
    const weeks = Array.from(Array(52).keys());

    const predictions_array = weeks.map((e) => {
      return owner_estimated * (1 - 2 * (1 / (1 + Math.exp((intercept / 1000) + slope * e))));
    });

    const predictions_revenues_array = weeks.map((e) => {
      return price * (owner_estimated * (1 - 2 * (1 / (1 + Math.exp((intercept / 1000) + slope * e)))));
    });

    const unpackedArray = predictions_array.map((elem, index) => {
      if (predictions_array[index - 1] != undefined) {
        return Math.round(elem - predictions_array[index - 1])
      } else {
        return Math.round(elem)
      }
    })

    return { predictions_revenues_array, unpackedArray, weeks  }
  }

  buildCharts() {
    const { predictions_revenues_array, unpackedArray, weeks } = this.computeGraphPoints();
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: weeks,
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
    new Chart(ctx2, {
      type: 'line',
      data: {
        labels: weeks,
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
