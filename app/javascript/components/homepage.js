import anime from 'animejs/lib/anime.es.js';

const textWrapperHomePage = () => {
  const textWrapper = document.querySelector('.sous-titre');
  if (textWrapper) {
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    anime.timeline({ loop: true })
      .add({
        targets: '.sous-titre .letter',
        opacity: [0, 1],
        easing: "easeInOutQuad",
        duration: 500,
        delay: (el, i) => 150 * (i + 1)
      }).add({
        targets: '.sous-titre',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 100
      });
  };
};

export { textWrapperHomePage };
