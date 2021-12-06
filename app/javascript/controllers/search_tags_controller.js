import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["form", "results", "searchInput"]

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

  // 1. écouter le click sur (data-action="click->........")
  // 2. créer une methode onSelect(event) => event.currentTarget
  // 3. masquer les résultats de la recherche
  // 4. insérer sur la page le fameux input qui a un name="tags[]" avec la value correspond au tag choisit
}
