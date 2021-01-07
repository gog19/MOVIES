var $_ = (selector, node = document) => node.querySelector(selector);


var $$_ = (selector, node = document) => node.querySelectorAll(selector);


var createElement = (element, elementClass, text) => {
    var newElement = document.createElement(element);

    if (elementClass) {
        newElement.setAttribute('class', elementClass);
    }

    if (text) {
        newElement.textContent = text;
    }

    return newElement;
};

// {// var newVersionOfArray = movies.map(function (item) {
//     return {
//         categories: item.Categories.split('|'),
//         title: item.Title.toString(),
//         imdbId: item.imdb_id,
//         imdbRating: item.imdb_rating,
//         language: item.language,
//         year: item.movie_year,
//         runtime: item.runtime,
//         summary: item.summary,
//         youtubeId: item.ytid
//     }
// })

// var getSmallImg = function (youtubeId) {
//     return `http://i3.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
// }

// var getBigImg = function (youtubeId) {
//     return `http://i3.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
// }}


var elForm = document.querySelector('.movies__form');
var elInputName = document.querySelector('.movies__name-input');
var elInputRating = document.querySelector('.movies__rating-input');
var elMoviesGenre = document.querySelector('.movies__genre');
var elMoviesSort = document.querySelector('.movies__sort');
var elMoviesList = document.querySelector('.movies__list');
var moviesTemplate = document.querySelector('.movies-template').content;
var moviesFragment = document.createDocumentFragment();
var total = document.querySelector('.total');

var emptyGenresArray = [];
for (var movie of movies) {
    for (var category of movie.categories) {
        if (!emptyGenresArray.includes(category)) {
            emptyGenresArray.push(category);
        }
    }
}

emptyGenresArray.forEach((genre) => {
    newOption = document.createElement('option');
    newOption.className = 'movies__option'
    newOption.textContent = genre;

    elMoviesGenre.appendChild(newOption);
});

// Submit hodisasi orqali listga qidirilgan kinolar chiqaramiz
elForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var moviesSpell = new RegExp(elInputName.value, 'gi');
    var filteredArray = movies.filter( (film) => {
        return film.title.match(moviesSpell) && film.imdbRating >= Number(elInputRating.value) &&
            film.categories.some( (genre) => {
                return genre === elMoviesGenre.value
            });
    })

    if (elMoviesSort.value === 'min') {
        filteredArray.sort( (first, second) => {
            if (first.imdbRating < second.imdbRating) return -1;
            if (first.imdbRating > second.imdbRating) return 1;
            return 0;
        })
    }
    if (elMoviesSort.value === 'max') {
        filteredArray.sort( (first, second) => {
            if (first.imdbRating < second.imdbRating) return -1;
            if (first.imdbRating > second.imdbRating) return 1;
            return 0;
        }).reverse();
    }

    elMoviesList.innerHTML = '';
    filteredArray.forEach( (film) => {
        var templateClone = moviesTemplate.cloneNode(true);

        $_('.movies__img', templateClone).src = film.smallThumbnail;
        $_('.movies__item-title', templateClone).textContent = film.title;
        $_('.movies__item-year', templateClone).textContent = film.year;
        $_('.movies__item-rating', templateClone).textContent = film.imdbRating;
        $_('.trailer', templateClone).href = `https://www.youtube.com/watch?v=${film.youtubeId}`;
        $_('.bookmark', templateClone).dataset.id = film.imdbId

        moviesFragment.appendChild(templateClone);

    });

    total.textContent = filteredArray.length

    elMoviesList.appendChild(moviesFragment);

});

// Topilgan kinolarni bookmarkga saqlash
var bookmarkFragment = document.createDocumentFragment();
var bookmarkTemplate = document.querySelector('.bookmark-template').content;
var bookmarkList = document.querySelector('.bookmark-list');
var arrayForBookmark = [];
var counter = 0;
var bookmarkCounter = document.querySelector('.bookmark__counter');

elMoviesList.addEventListener('click', function (evt) {

    if (evt.target.matches('.bookmark')) {

        var buttonId = evt.target.dataset.id;
        var newBookmarkArray = movies.find((movie) => movie.imdbId === buttonId);

        if (!arrayForBookmark.includes(newBookmarkArray)) {
            arrayForBookmark.push(newBookmarkArray)
            counter++;
            bookmarkCounter.textContent = counter;
        }

        bookmarkList.innerHTML = '';
        arrayForBookmark.forEach( (every) => {
            var bookmarkTempClone = bookmarkTemplate.cloneNode(true);

            $_('.bookmark__item-title', bookmarkTempClone).textContent = every.title;
            $_('.remove', bookmarkTempClone).dataset.id = every.imdbId;

            bookmarkFragment.appendChild(bookmarkTempClone);
        });

        bookmarkList.appendChild(bookmarkFragment);
    }
});


// Bookmark qilingan filmlarni o`chirib tashlash
bookmarkList.addEventListener('click', function (evt) {
    if (evt.target.matches('.remove')) {

        var findIndexArray = arrayForBookmark.findIndex(function (element) {
            // return Number(element) == evt.target.dataset.id;
            return element.imdbId === evt.target.dataset.id;
        });

        arrayForBookmark.splice(findIndexArray, 1);
        counter--;
        bookmarkCounter.textContent = counter;

        bookmarkList.innerHTML = '';
        arrayForBookmark.forEach(function (every) {
            var bookmarkTempClone = bookmarkTemplate.cloneNode(true);

            $_('.bookmark__item-title', bookmarkTempClone).textContent = every.title;
            $_('.remove', bookmarkTempClone).dataset.id = every.imdbId;

            bookmarkFragment.appendChild(bookmarkTempClone);
        })

        bookmarkList.appendChild(bookmarkFragment);
    }
});