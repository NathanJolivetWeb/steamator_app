import { Controller } from "@hotwired/stimulus"

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
    this.ownerTarget.insertAdjacentHTML('afterend', `<p>${data.owner}</p>`);

    this.predictionData = data

    const array = Array.from(Array(53).keys());


    const predictions_array = array.map((e) => {
      return data.owner * (1 - 2 * (1 / (1 + Math.exp(data.intercept + 0.1 * e))));
    });

    console.log(data);
    console.log(array);
    console.log(predictions_array);



    // for (const num of [1,2,3,4]) {
    //   console.log(num)
    // }

  }


}
