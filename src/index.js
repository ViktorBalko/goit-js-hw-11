import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { createCard } from './js/createCard'
import { fetchImages, page, perPage, resetPage } from './js/fetchImages';
import { onTop, onScroll } from './js/buttonUp';

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector(".search-input");
const gallery = document.querySelector(".gallery");
const loadButton = document.querySelector(".load-more");

const optionsSL = {
    overlayOpacity: 0.5,
    captionsData: "alt",
    captionDelay: 150,
}; 

let searchValue = '';
let simpleLightbox;

searchForm.addEventListener('submit', onSubmit);
loadButton.addEventListener('click', onNextPage);

onScroll();
onTop();

async function onSubmit(event) {
    event.preventDefault();
    searchValue = searchInput.value.trim();
    if (searchValue === '') {
        clearAll();
        buttonHidden();
        Notiflix.Notify.info('You cannot search by empty field, try again.');
        return;
    } else {
        try {
            resetPage();
            const result = await fetchImages(searchValue);
            if (result.hits < 1) {
                searchForm.reset();
                clearAll();
                buttonHidden();
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            } else {
                searchForm.reset();
                gallery.innerHTML = createCard(result.hits);
                simpleLightbox = new SimpleLightbox(".gallery a", optionsSL).refresh();
                buttonUnHidden();
                Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
            };
        } catch (error) {
            ifError();
        };
    };
};
async function onNextPage() {
    simpleLightbox.destroy();
    try {
        const result = await fetchImages(searchValue);
        const totalPages = page * perPage;
            if (result.totalHits <= totalPages) {
                buttonHidden();
                Notiflix.Report.info('Wow', "We're sorry, but you've reached the end of search results.", 'Okay');
            }
        gallery.insertAdjacentHTML('beforeend', createCard(result.hits));
        smoothScroll();
        simpleLightbox = new SimpleLightbox(".gallery a", optionsSL).refresh();
    } catch (error) {
        ifError();
    };
};

function ifError() {
    clearAll();
    buttonHidden();
    Notiflix.Report.info('Oh', 'Something get wrong, please try again', 'Okay');
};

function clearAll() {
    gallery.innerHTML = '';
};

function buttonHidden() {
    loadButton.classList.add("visually-hidden");
};

function buttonUnHidden() {
    loadButton.classList.remove("visually-hidden");
};

function smoothScroll() {
    const { height: cardHeight } =
    document.querySelector(".photo-card").firstElementChild.getBoundingClientRect();
    window.scrollBy({
    top: cardHeight * 3.9,
    behavior: "smooth",
});
};