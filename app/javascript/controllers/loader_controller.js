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
      if (newPrice.length === 1) {
        url1 = url1.substring(0, url1.length - 1) + newPrice;
      } else {
        url1 = url1.substring(0, url1.length - 2) + newPrice;
      }
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
    console.log(this.predictionData)
    if ( slope < 0.01) {
      slope = 0.01;
    }
    let predictions_array;
    let weeklySales;
    let weeks = Array.from(Array(52).keys());
    let annualRevenue;

    // intercept max = 100
    if (intercept > 100) {
      intercept = (100 + 2)**1.6
      predictions_array = weeks.map((e) => {
        return owner_estimated * (1 - 2 * (1 / (1 + Math.exp(intercept / 1635) + slope * e)));
      });
      weeklySales = predictions_array.map((elem, index) => {
        if (predictions_array[index - 1] != undefined) {
          return Math.round(elem - predictions_array[index - 1])
        } else {
          return Math.round(elem)
        }
      })
      annualRevenue = weeks.map((e) => {
        return price * (owner_estimated * (1 - 2 * (1 / (1 + Math.exp((intercept / 1000) + slope * e)))));
      });
    } else if (intercept === 0) {
      // Gaussian for 0 intercept
      const gaussianWeeks = weeks.map((e) => (e - 25) / 25);

      weeklySales = gaussianWeeks.map((e) => {
        return owner_estimated / 8.80967867293091 * (Math.exp(-4 * (e ** 2)) / Math.sqrt(2 * Math.PI));
      });
      annualRevenue = []
      for (const [index, value] of weeklySales.entries()) {
        if (index === 0) {
          annualRevenue.push(value);
        } else {
          let sum = weeklySales.slice(0, index)
                                .reduce((p, c) => p + c)
          annualRevenue.push(sum);
        }
      }

    } else {
      intercept = (intercept + 2)**1.6
      predictions_array = weeks.map((e) => {
        return owner_estimated * (1 - 2 * (1 / (1 + Math.exp(intercept / 1635) + slope * e)));
      });
      weeklySales = predictions_array.map((elem, index) => {
        if (predictions_array[index - 1] != undefined) {
          return Math.round(elem - predictions_array[index - 1])
        } else {
          return Math.round(elem)
        }
      })
      annualRevenue = weeks.map((e) => {
        return price * (owner_estimated * (1 - 2 * (1 / (1 + Math.exp((intercept / 1000) + slope * e)))));
      });
    }
    return { annualRevenue, weeklySales, weeks  }
  }

  buildCharts() {
    const { annualRevenue, weeklySales, weeks } = this.computeGraphPoints();
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: weeks,
        datasets: [{
          label: 'Annual revennue',
          data: annualRevenue,
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
          data: weeklySales,
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
