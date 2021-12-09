import { Controller } from "stimulus"

export default class extends Controller {

  static targets = ["form", "results", "searchInput", "choices", "hide", "hidesecond", "show", "showsecond", "owner_tags","your_tags","submit"]

  connect() {
    console.log('connected search tags controller');
    console.log(this.searchInputTarget)
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
    //console.log(event.currentTarget.innerHTML);
    //console.log(event.currentTarget.dataset);
    this.choicesTarget.insertAdjacentHTML('afterend', `<input type="hidden" value="${event.currentTarget.dataset.id}" name="tags[]">`);
    this.owner_tagsTarget.insertAdjacentHTML('beforeend', `<span class="mr-4 p-3 mb-3 badge badge-secondary">${event.currentTarget.innerHTML}</span>`);
    this.owner_tagsTarget.classList.remove("d-none");
    //this.your_tagsTarget.classList.remove("hide-text");
    this.resultsTarget.innerHTML = '';
    this.searchInputTarget.value = '';
  }

  next(event) {
    event.preventDefault();
    this.hideTarget.classList.add("d-none");
    this.hidesecondTarget.classList.add("d-none");
    this.showTarget.classList.remove("d-none");
    this.showsecondTarget.classList.remove("d-none");
  }

  previous(event) {
    event.preventDefault();
    this.hideTarget.classList.remove("d-none");
    this.hidesecondTarget.classList.remove("d-none");
    this.showTarget.classList.add("d-none");
    this.showsecondTarget.classList.add("d-none");
  }

  submitForm(event) {
    event.preventDefault()
    this.submitTarget.submit()
  }
}
