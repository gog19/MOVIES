var foundMovies = [];
var titleInputValue = '';
var PER_PAGE = 6;

var elForm = $_('.js-search-form');
var elResult = $_('.search-results');
var titleInputValue = '';
var elCardTemplate = $_('#movie-card-template').content;
var elCounterLength = $_('.js-search-results-count');
var cardFragment = document.createDocumentFragment();

if (elForm) {
  var elTitleInput = $_('.js-search-form__title-input', elForm);
  var elRatingInput = $_('.js-search-form__rating-input', elForm);
  var elGenreSelect = $_('.js-search-form__genre-select', elForm);
  var elSortSelect = $_('.js-search-form__sort-select', elForm);
}

var moviesFilterFunction = (titleInputValue = '', ratingInputValue = 0, genre = 'All') => {
  return movies.filter(movie => {
    var checkGenre = genre === 'All' || movie.categories.includes(genre);
    return movie.title.match(titleInputValue) && movie.imdbRating >= ratingInputValue && checkGenre;
  });
}

var sortMoviesAZ = data => {
  data.sort((a, b) => {
    if (a.title > b.title) return 1;
    else if (a.title < b.title) return -1;
    return 0;
  });
};

var sortMoviesZA = data => {
  data.sort((a, b) => {
    if (a.title < b.title) return 1;
    else if (a.title > b.title) return -1;
    return 0;
  });
};

var sortMoviesRatingDesc = data => data.sort((a, b) => b.imdbRating - a.imdbRating);

var sortMoviesRatingAsc = data => data.sort((a, b) => a.imdbRating - b.imdbRating);

var sortMoviesYearDesc = data => data.sort((a, b) => b.year - a.year);

var sortMoviesYearAsc = data => data.sort((a, b) => a.year - b.year);

var sortingMovies = {
  az: sortMoviesAZ,
  za: sortMoviesZA,
  rating_desc: sortMoviesRatingDesc,
  rating_asc: sortMoviesRatingAsc,
  year_desc: sortMoviesYearDesc,
  year_asc: sortMoviesYearAsc
}

var sortMovies = (data, sortType) => {
  sortingMovies[sortType](data);
};

var displayMoviesCard = (data) => {

  elResult.innerHTML = '';
  data.forEach(movie => {
    var cloneTemplate = elCardTemplate.cloneNode(true);

    $_('.movie__poster', cloneTemplate).src = movie.smallThumbnail;
    $_('.movie__poster', cloneTemplate).alt = `Poster of ${movie.title}`;
    $_('.movie__year', cloneTemplate).textContent = movie.year;
    $_('.movie__rating', cloneTemplate).textContent = movie.imdbRating;
    $_('.movie__trailer-link', cloneTemplate).href = `https://www.youtube.com/watch?v=${movie.youtubeId}`;
    $_('.js-movie-bookmark', cloneTemplate).dataset.imdbId = movie.imdbId;

    var movieTitle = $_('.movie__title', cloneTemplate);

    if (titleInputValue.sourse === '(?:)') movieTitle.textContent = movie.title;
    else movieTitle.innerHTML = movie.title.replace(titleInputValue, `<mark class='px-0'>${movie.title.match(titleInputValue)}</mark>`);

    cardFragment.appendChild(cloneTemplate);
  });

  elResult.appendChild(cardFragment);
}


var elNoResultsAlert = $_('.js-no-results-alert');


elForm.addEventListener('submit', evt => {
  evt.preventDefault();

  titleInputValue = new RegExp(elTitleInput.value, 'gi');
  var ratingInputValue = elRatingInput.value;
  var genreOfMovies = elGenreSelect.value
  var sorting = elSortSelect.value;

  foundMovies = moviesFilterFunction(titleInputValue, ratingInputValue, genreOfMovies);

  elNoResultsAlert.classList.add('d-none');
  elCounterLength.textContent = foundMovies.length;

  if (!foundMovies.length) {
    elResult.innerHTML = '';
    elNoResultsAlert.classList.remove('d-none');
    return
  }

  sortMovies(foundMovies, sorting);

  displayMoviesCard(pagenationCounter(1));

  displayPagination(foundMovies);



});


var pageTemplate = $_('#pagination-item-template').content;
var resultPagenation = $_('.pagination');

var pagenationCounter = pageNum => {
  var begin = (pageNum - 1) * PER_PAGE;
  var end = begin + PER_PAGE;

  return foundMovies.slice(begin, end);
}

var displayPagination = movies => {
  var pageInNumber = Math.ceil(movies.length / PER_PAGE);

  resultPagenation.innerHTML = '';
  var pageFragment = document.createDocumentFragment();

  for (let i = 1; i <= pageInNumber; i++) {
    var pageTemplateClone = pageTemplate.cloneNode(true);

    $_('.js-page-link', pageTemplateClone).textContent = i;
    $_('.js-page-link', pageTemplateClone).dataset.page = i;

    pageFragment.appendChild(pageTemplateClone);
  }

  resultPagenation.appendChild(pageFragment);

  resultPagenation.querySelector('.page-item').classList.add('active');

}


resultPagenation.addEventListener('click', page => {
  if (page.target.matches('.js-page-link')) {
    page.preventDefault();

    var pageOfMovies = Number(page.target.dataset.page);

    displayMoviesCard(pagenationCounter(pageOfMovies));

    resultPagenation.querySelectorAll('.page-item').forEach(page => page.classList.remove('active'));

    page.target.closest('.page-item').classList.add('active');

    window.scrollTo(0, 0);
  }
})