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

emptyGenresArray.forEach(genre => {
    newOption = document.createElement('option');
    newOption.className = 'movies__option'
    newOption.textContent = genre;

    elMoviesGenre.appendChild(newOption);
});

var elResultList = document.querySelector('.buttons-group');
var elTemplate = document.querySelector('.buttons-template').content;
var elFragment = document.createDocumentFragment();
var numberPerPage = 6;
var count = 1;
var currentPagePag = 1;

// var countPages = function (currentPage, arrayWithFiltered) {
//     var begin = ((currentPage - 1) * numberPerPage);
//     var end = begin + numberPerPage;

//     return arrayWithFiltered.slice(begin, end);
// }

// Submit hodisasi orqali listga qidirilgan kinolarni chiqaramiz
elForm.addEventListener('submit', evt => {
    evt.preventDefault();

    var moviesSpell = new RegExp(elInputName.value, 'gi');
    var filteredArray = movies.filter(film => {
        return film.title.match(moviesSpell) && film.imdbRating >= Number(elInputRating.value) &&
            film.categories.some(genre => genre === elMoviesGenre.value);
    });

    countPages(1, filteredArray);

    var numberOfPages = Math.ceil(filteredArray.length / numberPerPage);

    elResultList.innerHTML = '';
    for (let x = 1; x <= numberOfPages; x++) {
        var cloneTemplate = elTemplate.cloneNode(true);

        cloneTemplate.querySelector('.buttons-link').textContent = x;
        cloneTemplate.querySelector('.buttons-link').dataset.id = count++;

        elFragment.appendChild(cloneTemplate);
    }

    elResultList.appendChild(elFragment);

    var cloneOfArray = filteredArray.slice();

    if (elMoviesSort.value === 'min') {
        cloneOfArray.sort((a, b) => {
            if (a.imdbRating < b.imdbRating) return -1;
            if (a.imdbRating > b.imdbRating) return 1;
            return 0;
        });
    }
    if (elMoviesSort.value === 'max') {
        cloneOfArray.sort((a, b) => {
            if (a.imdbRating < b.imdbRating) return 1;
            if (a.imdbRating > b.imdbRating) return -1;
            return 0;
        });
    }

    if (elMoviesSort.value === 'maxYear') {
        cloneOfArray.sort((a, b) => {
            if (a.year < b.year) return -1;
            if (a.year > b.year) return 1;
            return 0;
        });
    }

    if (elMoviesSort.value === 'minYear') {
        cloneOfArray.sort((a, b) => {
            if (a.year < b.year) return 1;
            if (a.year > b.year) return -1;
            return 0;
        });
    }

    if (elMoviesSort.value === 'begin') {
        cloneOfArray.sort((a, b) => {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return 0;
        });
    }

    if (elMoviesSort.value === 'end') {
        cloneOfArray.sort((a, b) => {
            if (a.title < b.title) return 1;
            if (a.title > b.title) return -1;
            return 0;
        });
    }

    total.textContent = filteredArray.length;

});

elResultList.addEventListener('click', evt => {
    var elsLink = document.querySelectorAll('.page-item');
    elsLink.forEach(item => {
        item.classList.remove('active');
    })
    if (evt.target.matches('.buttons-link')) {

        currentPage = Number(evt.target.dataset.id);
        evt.target.parentElement.classList.add('active');

        var sumOfPages = countPages(evt.target.dataset.id);
        console.log(sumOfPages);


        elMoviesList.innerHTML = '';
        sumOfPages.forEach(page => {
            var templateClone = moviesTemplate.cloneNode(true);

            $_('.movies__img', templateClone).src = page.smallThumbnail;
            $_('.movies__item-title', templateClone).textContent = page.title;
            $_('.movies__item-year', templateClone).textContent = page.year;
            $_('.movies__item-rating', templateClone).textContent = page.imdbRating;
            $_('.trailer', templateClone).href = `https://www.youtube.com/watch?v=${page.youtubeId}`;
            $_('.bookmark', templateClone).dataset.imdbId = page.imdbId;
            $_('.info', templateClone).dataset.imdbId = page.imdbId;

            moviesFragment.appendChild(templateClone);
        });
        elMoviesList.appendChild(moviesFragment);
    }
})

// Topilgan kinolarni bookmarkga saqlash
var elCreateFunction = () => {
    bookmarkList.innerHTML = '';
    arrayForBookmark.forEach(every => {
        var bookmarkTempClone = bookmarkTemplate.cloneNode(true);

        $_('.bookmark__item-title', bookmarkTempClone).textContent = every.title;
        $_('.remove', bookmarkTempClone).dataset.id = every.imdbId;

        bookmarkFragment.appendChild(bookmarkTempClone);
    });
    bookmarkList.appendChild(bookmarkFragment);
}

var bookmarkFragment = document.createDocumentFragment();
var bookmarkTemplate = document.querySelector('.bookmark-template').content;
var bookmarkList = document.querySelector('.bookmark-list');
var arrayForBookmark = JSON.parse(localStorage.getItem('todolist')) || [];
var bookmarkCounter = document.querySelector('.bookmark__counter');

bookmarkCounter.textContent = arrayForBookmark.length;
elCreateFunction();


elMoviesList.addEventListener('click', evt => {
    if (evt.target.matches('.bookmark')) {
        var newBookmarkArray = movies.find(movie => movie.imdbId === evt.target.dataset.imdbId);

        if (!arrayForBookmark.includes(newBookmarkArray)) {
            arrayForBookmark.push(newBookmarkArray)
            bookmarkCounter.textContent = arrayForBookmark.length;
            localStorage.setItem('todolist', JSON.stringify(arrayForBookmark));
        }

        elCreateFunction();
    }
});

var counter = 0
var counterId = () => counter++


// Bookmark qilingan filmlarni o`chirib tashlash
bookmarkList.addEventListener('click', evt => {
    if (evt.target.matches('.remove')) {

        var findIndexArray = arrayForBookmark.findIndex(element => element.imdbId === evt.target.dataset.id);

        arrayForBookmark.splice(findIndexArray, 1);
        bookmarkCounter.textContent = arrayForBookmark.length;

        localStorage.setItem('todolist', JSON.stringify(arrayForBookmark))

        elCreateFunction();

    }
});

