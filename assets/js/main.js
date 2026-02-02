const container = document.querySelector('.section-container');

let scrollAmount = 0;
let currentScroll = 0;
let isScrolling = false;

window.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();

    scrollAmount += e.deltaY + e.deltaX; // accumulate scroll
    scrollAmount = Math.max(
      0,
      Math.min(scrollAmount, container.scrollWidth - container.clientWidth)
    ); // clamp between 0 and max scroll

    if (!isScrolling) smoothScroll();
  },
  { passive: false }
);

function smoothScroll() {
  isScrolling = true;
  currentScroll += (scrollAmount - currentScroll) * 0.1; 
  container.scrollLeft = currentScroll;
  if (Math.abs(scrollAmount - currentScroll) > 0.5) {
    requestAnimationFrame(smoothScroll);
  } else {
    isScrolling = false;
  }
}


let transAmount = 0;
let currentTrans = 0;
let isTrans = false;

function smoothTranslate() {
  isTrans = true;

  currentTrans += (transAmount - currentTrans) * 0.2;

  container.style.transform = `translateX(${-currentTrans - (menu.offsetWidth * 0.3)}px)`;

  if (Math.abs(transAmount - currentTrans) > 0.5) {
    requestAnimationFrame(smoothTranslate);
  } else {
    isTrans = false;
  }
}


function scrollToSection(id) {
  const container = document.querySelector('.section-container');
  const element = document.getElementById(id);
  if (!container || !element) return;

  const menuWidth = document.getElementById('menu').offsetWidth;

  let target;
  if (id === "intro-img") {
    target = element.offsetLeft - menuWidth;
  } else {
    target = element.offsetLeft - menuWidth - 20;
  }

  const start = container.scrollLeft;
  const distance = Math.abs(target - start);

  const minDuration = 200; 
  const maxDuration = 1200; 
  const pixelsPerMs = 1; 
  let duration = distance / pixelsPerMs;

  duration = Math.max(minDuration, Math.min(maxDuration, duration));

  let startTime = null;

  function easeInOutQuad(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animateScroll(time) {
    if (!startTime) startTime = time;
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutQuad(progress);

    container.scrollLeft = start + (target - start) * eased;

    if (elapsed < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      scrollAmount = container.scrollLeft;
      currentScroll = container.scrollLeft;
    }
  }

  requestAnimationFrame(animateScroll);
}

// Detect if we are on mobile
const isMobile = window.matchMedia("(max-width: 600px)").matches &&
  navigator.maxTouchPoints > 0 &&
  window.matchMedia('(pointer: coarse)').matches;;

if (isMobile) {
  document.getElementById('title').innerHTML = 'UChicago Chapter';
  const menu = document.getElementById('menu');
  const container = document.querySelector('.section-container');

  let startX = 0;
  let scrollStart = 0;
  const maxScroll = menu.offsetWidth;

  let menuActive = false;
  let menuOpen = true;

  menu.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    scrollStart = scrollAmount;
    menuActive = true;
  });

  menu.addEventListener('touchmove', (e) => {
    if (!menuActive) return;

    const currentX = e.touches[0].clientX;
    const deltaX = startX - currentX;

    scrollAmount = Math.max(0, Math.min(scrollStart + deltaX, maxScroll));


    menu.style.transform = `translateX(${-scrollAmount}px)`;
    container.style.transform = `translateX(${-scrollAmount * 0.3}px)`;

    e.preventDefault();
  }, { passive: false });

  menu.addEventListener('touchend', () => {
    menuActive = false;

    if (scrollAmount > maxScroll / 3) {
      scrollAmount = maxScroll;
      menuOpen = true;
    } else {
      scrollAmount = 0;
      menuOpen = false;
    }

    menu.style.transition = 'transform 0.3s ease';
    container.style.transition = 'transform 0.3s ease';

    menu.style.transform = `translateX(${-scrollAmount}px)`;
    container.style.transform = menuOpen
      ? `translateX(${-scrollAmount * 0.3}px)`
      : `translateX(0px)`;

    setTimeout(() => {
      menu.style.transition = '';
      container.style.transition = '';
    }, 300);
  });

  
  container.addEventListener('touchstart', (e) => {
    if (!menuOpen) return;
    startX = e.touches[0].clientX;
  });

  container.addEventListener('touchmove', (e) => {
    if (!menuOpen) return;

    const currentX = e.touches[0].clientX;
    const deltaX = startX - currentX;
    startX = currentX;

    transAmount += deltaX * 0.6;
    const minTrans = -menu.offsetWidth * 0.3;
    const maxTrans = calc(container.scrollWidth - 100);
    transAmount = Math.min(maxTrans, Math.max(minTrans, transAmount));

    if (!isTrans) smoothTranslate();

    e.preventDefault();
  }, { passive: false });


}
