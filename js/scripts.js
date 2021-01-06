var $_ = function (selector, node = document) {
    return node.querySelector(selector);
};

var $$_ = function (selector, node = document) {
    return node.querySelectorAll(selector);
};

var createElement = function (element, elementClass, text) {
    var newElement = document.createElement(element);

    if (elementClass) {
        newElement.setAttribute('class', elementClass);
    }

    if (text) {
        newElement.textContent = text;
    }

    return newElement;
};

var newVersionOfArray = movies.map(function (item) {
    return {
        categories: item.Categories,
        title: item.Title.toString(),
        imdbId: item.imdb_id,
        imdbRating: item.imdb_rating,
        language: item.language,
        year: item.movie_year,
        runtime: item.runtime,
        summary: item.summary,
        youtubeId: item.ytid
    }
})


var elForm = document.querySelector('.movies__form');
var elInputName = document.querySelector('.movies__name-input');
var elInputYear = document.querySelector('.movies__year-input');
var elMoviesGenre = document.querySelector('.movies__genre');
var elMoviesSort = document.querySelector('.movies__sort');
var elMoviesList = document.querySelector('.movies__list');
var moviesTemplate = document.querySelector('.movies-template').content;
var moviesFragment = document.createDocumentFragment();
var total = document.querySelector('.total');

elForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var filteredArray = newVersionOfArray.filter(function (film) {
        return film.title.includes(elInputName.value);
    });

    // var moviesSpell = new RegExp(`${elInputName.value}`, 'gi');


    elMoviesList.innerHTML = '';
    filteredArray.forEach(function (film) {
        console.log(film.year);
        var templateClone = moviesTemplate.cloneNode(true);

        $_('.movies__img', templateClone).src = `http://i3.ytimg.com/vi/${film.youtubeId}/hqdefault.jpg`;
        $_('.movies__item-title', templateClone).textContent = film.title;
        $_('.movies__item-year', templateClone).textContent = film.year;
        $_('.movies__item-rating', templateClone).textContent = film.imdbRating;

        moviesFragment.appendChild(templateClone);
    });

    total.textContent = filteredArray.length

    // var filteredYear = newVersionOfArray.filter(function (film) {
    //     return film.year === Number(elInputName.value);
    // });

    // elMoviesList.innerHTML = '';
    // filteredYear.forEach(function (film) {
    //     console.log(film.year);
    //     var templateClone = moviesTemplate.cloneNode(true);

    //     $_('.movies__img', templateClone).src = `http://i3.ytimg.com/vi/${film.youtubeId}/hqdefault.jpg`;
    //     $_('.movies__item-title', templateClone).textContent = film.title;
    //     $_('.movies__item-year', templateClone).textContent = film.year;
    //     $_('.movies__item-rating', templateClone).textContent = film.imdbRating;

    //     moviesFragment.appendChild(templateClone);
    // });

    elMoviesList.appendChild(moviesFragment);

}); 