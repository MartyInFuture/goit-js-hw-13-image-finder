import './scss/main.scss';
import cardTemplates from './templates/cards.hbs';
import * as _ from 'lodash';

const gallery = document.querySelector('.gallery');
const input = document.querySelector('.search-form input');
let currentPage = 1;
let inputPerPage = 6;
let currentInput;

input.addEventListener(
  'input',
  _.debounce(e => {
    if (!e.target.value) return false;
    gallery.innerHTML = '';
    currentPage = 1;
    currentInput = e.target.value;
    fetchImages(currentInput, currentPage, inputPerPage);
  }, 500),
);

const fetchImages = async (currentInput, currentPage, inputPerPage) => {
  const response = await fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${currentInput}&page=${currentPage}&per_page=${inputPerPage}&key=19128148-e20e1c798475ebdebc23df32e`,
  )
    .then(res => {
      return res.json();
    })
    .then(data => {
      if (!data) return false;
      gallery.insertAdjacentHTML('beforeend', cardTemplates(data.hits));
      observer.observe(gallery.lastElementChild);
    })
    .catch(error => {
      console.log(error);
    });
};

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(item => {
      if (!item.isIntersecting) return false;
      observer.unobserve(item.target);
      console.log(gallery.children);
      // gallery.children[(currentPage - 1) * 12].scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'start',
      // });
      currentPage += 1;
      setTimeout(() => {
        fetchImages(currentInput, currentPage, inputPerPage);
      }, 500);
    });
  },
  {
    threshold: 1,
  },
);
