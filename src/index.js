import './scss/main.scss';
import cardTemplates from './templates/cards.hbs';
import * as _ from 'lodash';

const TEMPLATE_URL = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${'what-search'}&page=${'page-number'}&per_page=12&key=19128148-e20e1c798475ebdebc23df32e`;
const gallery = document.querySelector('.gallery');
const input = document.querySelector('.search-form input');
let currentPage = 1;
let currentInput;

function renderCards(data) {
  console.log(data.hits);
  gallery.insertAdjacentHTML('beforeend', cardTemplates(data.hits));
}

input.addEventListener(
  'input',
  _.debounce(e => {
    currentInput = e.target.value;
    fetchImages(currentInput, currentPage);
  }, 500),
);

const fetchImages = async (currentInput, currentPage) => {
  const response = await fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${currentInput}&page=${currentPage}&per_page=12&key=19128148-e20e1c798475ebdebc23df32e`,
  )
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log(data);
      renderCards(data);
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
      fetchImages(currentInput, (currentPage += 1));
      observer.observe(gallery.lastElementChild);
    });
  },
  {
    root: gallery,
    threshold: 0.5,
  },
);

observer.observe(gallery.lastElementChild);
