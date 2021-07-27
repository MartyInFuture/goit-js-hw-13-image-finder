import './scss/main.scss';
import cardTemplates from './templates/cards.hbs';
import * as _ from 'lodash';
import * as basicLightbox from 'basiclightbox';

import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { success, info, error } from '@pnotify/core';

const gallery = document.querySelector('.gallery');
const input = document.querySelector('.search-form input');
let currentPage = 1;
let inputPerPage = 12;
let currentInput;
let successAlert = 0;

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
      if (data.total === 0) {
        error({ text: `Bad request. No one images found!`, delay: 2000 });
        return false;
      }
      gallery.insertAdjacentHTML('beforeend', cardTemplates(data.hits));

      if (data.total !== successAlert && data.total !== 0) {
        success({ text: `${data.total} images found.`, delay: 2000 });
        successAlert = data.total;
      }
      if (data.hits.length < inputPerPage) {
        info({ text: `No more images found(${data.total}).`, delay: 2000 });
        return false;
      }

      setTimeout(() => {
        gallery.children[(currentPage - 1) * inputPerPage].scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        observer.observe(gallery.lastElementChild);
      }, 500);
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
      currentPage += 1;
      fetchImages(currentInput, currentPage, inputPerPage);
    });
  },
  {
    threshold: 1,
  },
);

gallery.addEventListener('click', e => {
  if (e.target.nodeName !== 'IMG') return false;
  const imageSource = e.target.getAttribute('src');
  const instance = basicLightbox.create(`
    <div class="modal"><img src="${imageSource}" width="800" height="600"></div>
  `);

  instance.show();
});
