import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["form", "results", "searchInput", "choices"]

  connect() {
    console.log('connected search tags controller');
    console.log(this.searchInputTarget)
    console.log(this.formTarget)
    console.log(this.resultsTarget)
  }

  update() {
    const url = `/tags/?query=${this.searchInputTarget.value}`
    fetch(url, { headers: { 'Accept': 'text/plain' } })
      .then(response => response.text())
      .then((data) => {
        this.resultsTarget.innerHTML = data;
      })
  }

  select(event) {
    console.log(event.currentTarget);
    console.log(event.currentTarget.dataset.id);
    this.choicesTarget.insertAdjacentHTML('afterend', `<input type="text" value="${event.currentTarget.dataset.id}" name="tags[]">`);
    this.resultsTarget.innerHTML = '';

    // <input type="text" name="tags[]" value="89" <= id de ton tag
    // 4. insérer sur la page le fameux input qui a un name="tags[]" avec la value correspond au tag choisit



  }

  // 1. écouter le click sur (data-action="click->........")
  // 2. créer une methode onSelect(event) => event.currentTarget
  // 3. masquer les résultats de la recherche
}
