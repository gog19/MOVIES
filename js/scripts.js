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
    var filteredArray = movies.filter(function (film) {
        return film.title.match(moviesSpell) && film.imdbRating >= Number(elInputRating.value) &&
            film.categories.some(function (genre) {
                return genre === elMoviesGenre.value
            });
    })

    if (elMoviesSort.value === 'min') {
        filteredArray.sort(function (first, second) {
            if (first.imdbRating < second.imdbRating) return -1;
            if (first.imdbRating > second.imdbRating) return 1;
            return 0;
        })
    }
    if (elMoviesSort.value === 'max') {
        filteredArray.sort(function (first, second) {
            if (first.imdbRating < second.imdbRating) return -1;
            if (first.imdbRating > second.imdbRating) return 1;
            return 0;
        }).reverse();
    }

    elMoviesList.innerHTML = '';
    filteredArray.forEach(function (film, index) {
        var templateClone = moviesTemplate.cloneNode(true);

        $_('.movies__img', templateClone).src = film.smallThumbnail;
        $_('.movies__item-title', templateClone).textContent = film.title;
        $_('.movies__item-year', templateClone).textContent = film.year;
        $_('.movies__item-rating', templateClone).textContent = film.imdbRating;
        $_('.trailer', templateClone).href = `https://www.youtube.com/watch?v=${film.youtubeId}`;
        $_('.bookmark', templateClone).dataset.id = index

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

elMoviesList.addEventListener('click', function (evt) {

    if (evt.target.matches('.bookmark')) {
        bookmarkList.innerHTML = '';
        movies.forEach(function (movie) {
            // arrayForBookmark.push(movie.title);
            // console.log(arrayForBookmark);
            var bookmarkTempClone = bookmarkTemplate.cloneNode(true);

            $_('.bookmark__item-title', bookmarkTempClone).textContent = movie.title;

            bookmarkFragment.appendChild(bookmarkTempClone);
        });

        bookmarkList.appendChild(bookmarkFragment);
    }

});


// Bookmark qilingan filmlarni o`chirib tashlash
bookmarkList.addEventListener('click', function (evt) {
    if (evt.target.matches('.remove')) {

        console.log('ishladi');
        arrayForBookmark.splice(evt.target.dataset.id, 1);
        
        bookmarkList.innerHTML = '';
        movies.forEach(function (movie) {
            // arrayForBookmark.push(movie.title);
            // console.log(arrayForBookmark);
            var bookmarkTempClone = bookmarkTemplate.cloneNode(true);

            $_('.bookmark__item-title', bookmarkTempClone).textContent = movie.title;

            bookmarkFragment.appendChild(bookmarkTempClone);
        });
    }
})