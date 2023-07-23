'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const scrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////
//button scroll
scrollTo.addEventListener('click', function () {
  // const s1 = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: s1.left + window.pageXOffset,
  //   top: s1.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

const navlinks = document.querySelectorAll('.nav__link');
const navpar = document.querySelector('.nav__links');
navpar.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

const tabBtn = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  tabBtn.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

const nav = document.querySelector('.nav');
// const items = document.querySelectorAll('.nav__link');
const logo = document.querySelector('.nav__logo');

const handleBlur = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const links = e.target.closest('.nav').querySelectorAll('.nav__link');
    const logo = e.target.closest('.nav').querySelector('img');

    links.forEach(l => {
      if (l !== e.target) {
        l.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
};

nav.addEventListener('mouseover', handleBlur.bind(0.5));

nav.addEventListener('mouseout', handleBlur.bind(1));

// const objCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const objOpt = {
//   root: null,
//   threshold: 0.4,
// };

// const observer = new IntersectionObserver(objCallback, objOpt);
// observer.observe(section1);

const header = document.querySelector('.header');
const navheight = nav.getBoundingClientRect().height;
const sticky = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else {
    nav.classList.remove('sticky');
  }
};

const observer = new IntersectionObserver(sticky, {
  root: null,
  threshold: 0,
  rootMargin: `-${navheight}px`,
});
observer.observe(header);

const sections = document.querySelectorAll('.section');
const reveal = function (entries, observer2) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer2.unobserve(entry.target);
};
const observer2 = new IntersectionObserver(reveal, {
  root: null,
  threshold: 0.15,
});
sections.forEach(function (section) {
  section.classList.add('section--hidden');
  observer2.observe(section);
});

const lazyImages = document.querySelectorAll('img[data-src]');

const lazyLoad = function (entries, observer3) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // console.log(entry.target.);
  entry.target.src = entry.target.dataset.src; //it wwill emit load event once finished loading img
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer3.unobserve(entry.target);
};

const observer3 = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

lazyImages.forEach(img => observer3.observe(img));

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const rightBtn = document.querySelector('.slider__btn--right');
const leftBtn = document.querySelector('.slider__btn--left');
const slideLen = slides.length;
const dots = document.querySelector('.dots');
// console.log(rightBtn);
let curSlide = 0;
// slider.style.transform = 'scale(0.4)';
// slider.style.overflow = 'visible';

const toSlide = function (curSlide) {
  slides.forEach(function (slide, i) {
    slide.style.transform = `translateX(${100 * (i - curSlide)}%)`;
  });
};

const createDots = function () {
  slides.forEach(function (_, i) {
    dots.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide=${i}></button>`
    );
  });
};

const activateDots = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(d => {
    d.classList.remove('dots__dot--active');
  });
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const rightSlide = function () {
  if (curSlide === slideLen - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  toSlide(curSlide);
  activateDots(curSlide);
};

const leftSlide = function () {
  if (curSlide === 0) {
    curSlide = slideLen - 1;
  } else {
    curSlide--;
  }
  toSlide(curSlide);
  activateDots(curSlide);
};

//Init
const init = function () {
  toSlide(0);
  createDots();
  activateDots(0);
};

//Event Listeners
rightBtn.addEventListener('click', rightSlide);

leftBtn.addEventListener('click', leftSlide);

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && leftSlide();
  e.key === 'ArrowRight' && rightSlide();
});

dots.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    toSlide(e.target.dataset.slide);
    activateDots(e.target.dataset.slide);
  }
});
//Selecting child parent and sibling elements
// const heading = document.querySelector('h1');
// const sp = heading.querySelectorAll('span');
// console.log(heading.children);
// console.log(heading.firstElementChild);
// console.log(heading.lastElementChild);
// sp.forEach(function (el) {
//   el.style.backgroundColor = 'red';
// });

// console.log(heading.parentElement.children);

// const sibling = [...heading.parentElement.children];
// console.log(sibling);
// sibling.forEach(function (el) {
//   console.log(el);
//   if (heading !== el) el.style.backgroundColor = 'red';
// });
// navlinks.forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const href = this.getAttribute('href');
//     document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//////////////////////////////
//Page Navigation

// const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   // console.log(e.target);
//   console.log(e.currentTarget);
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   // console.log(e.target);
//   console.log(e.currentTarget);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     // console.log(e.target);
//     console.log(e.currentTarget);
//   },
//   true
// );
// const h1 = document.querySelector('h1');

// const alerth1 = function () {
//   alert('hi');
//   h1.removeEventListener('click', alerth1);
// };

// h1.addEventListener('click', alerth1);

// const msg = document.createElement('div');
// msg.classList.add('cookie-message');
// msg.innerHTML =
//   "we use cookies for optimization <button class='btn' >Got it</button>";
// document.querySelector('header').append(msg);
// // document.querySelector('header').before(el.cloneNode(true));

// // document.querySelector('header').append(el.cloneNode(true));

// const btn = document.querySelector('.btn');
// btn.addEventListener('click', function () {
//   msg.remove();
// });

// msg.style.backgroundColor = '#37383d';
// msg.style.width = '104%';
// msg.style.height =
//   Number.parseFloat(getComputedStyle(msg).height, 10) + 30 + 'px';

// const logo = document.querySelector('.nav__logo');
// console.log(logo.className);
// console.log(logo.src);
// console.log(logo.getAttribute('src'));
// const navlink = document.querySelector('.nav__link--btn');
// console.log(navlink.href);
// console.log(navlink.getAttribute('href'));
// logo.classList.add('a', 'b');
// logo.classList.remove('a');
// logo.classList.toggle('b');
// console.log(logo.classList.contains('a'));
