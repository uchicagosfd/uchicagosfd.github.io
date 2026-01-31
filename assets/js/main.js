const container = document.querySelector('.section-container');

let scrollAmount = 0; // target scroll position
let currentScroll = 0; // current smooth position
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

  currentScroll += (scrollAmount - currentScroll) * 0.1; // ease factor (0.1 = smooth)
  container.scrollLeft = currentScroll;

  if (Math.abs(scrollAmount - currentScroll) > 0.5) {
    requestAnimationFrame(smoothScroll);
  } else {
    isScrolling = false;
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
