var foundMovies = [];
var titleInputValue = '';

var elForm = $_('.js-search-form');
var elResult = $_('.search-results');
var titleInputValue = '';
var elCardTemplate = $_('#movie-card-template').content;
var elCounterLength = $_('.js-search-results-count');
var cardFragment = document.createDocumentFragment();

if (elForm) {
  var elTitleInput = $_('.js-search-form__title-input');
  var elRatingInput = $_('.js-search-form__rating-input');
  var elGenreSelect = $_('.js-search-form__genre-select');
  var elSortSelect = $_('.js-search-form__sort-select');
}

var moviesFilterFunction = (titleInputValue = '', ratingInputValue = 0, genre = 'All') => {
  return movies.filter(movie => {
    var checkGenre = genre === 'All' || movie.categories.includes(genre);
    return movie.title.match(titleInputValue) && movie.imdbRating >= ratingInputValue && checkGenre;
  });
}

var displayMoviesCard = (data) => {

  elResult.innerHTML = '';
  data.forEach(movie => {
    var cloneTemplate = elCardTemplate.cloneNode(true);

    $_('.movie__poster', cloneTemplate).src = movie.smallThumbnail;
    $_('.movie__poster', cloneTemplate).alt = `Poster of ${movie.title}`;
    $_('.movie__year', cloneTemplate).textContent = movie.year;
    $_('.movie__rating', cloneTemplate).textContent = movie.imdbRating;
    $_('.movie__trailer-link', cloneTemplate).href = movie.trailer;
    $_('.js-movie-bookmark', cloneTemplate).dataset.imdbId = movie.imdbId;

    var movieTitle = $_('.movie__title', cloneTemplate);

    if (titleInputValue.sourse === '(?:)') movieTitle.textContent = movie.title;
    else movieTitle.innerHTML = movie.title.replace(titleInputValue, `<mark class='px-0'>${movie.title.match(titleInputValue)}</mark>`)

    cardFragment.appendChild(cloneTemplate);
  });

  elResult.appendChild(cardFragment);
}


var sortMovies = function (data, sortType) {
  if (sortType === 'rating_desc') {
    data.sort((a, b) => a.imdbRating - b.imdbRating);
  }

  else if (sortType === 'rating_asc') {
    data.sort((a, b) => b.imdbRating - a.imdbRating);
  }

  // if (sortType === 'year_desc') {
  //     data.sort((a, b) => a.year - b.year);
  // }

  // if (sortType === 'year_asc') {
  //     data.sort((a, b) => b.year - a.year);
  // }
}


elForm.addEventListener('submit', evt => {
  evt.preventDefault();

  titleInputValue = new RegExp(elTitleInput.value, 'gi');
  var ratingInputValue = elRatingInput.value;
  var genreOfMovies = elGenreSelect.value
  var sorting = elSortSelect.value;

  foundMovies = moviesFilterFunction(titleInputValue, ratingInputValue, genreOfMovies);

  displayMoviesCard(foundMovies);

  elCounterLength.textContent = foundMovies.length;

  sortMovies(foundMovies, sorting);

});
