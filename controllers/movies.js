const mongoose = require('mongoose');

const { ValidationError } = mongoose.Error;

const Movie = require('../models/movie');
const ErrorForbidden = require('../errors/errorForbidden');
const ErrorValidation = require('../errors/errorValidation');
const ErrorNotFound = require('../errors/errorNotFound');

const { SUCCESS_CODE } = require('../codes/codes');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(SUCCESS_CODE).send(movie))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new ErrorValidation('Переданы некорректные данные'));
      } else next(err);
    })
    .catch(next);
};

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new ErrorNotFound('Фильм не найден'));
      }
      if (movie.owner.toString() === req.user._id) {
        movie
          .deleteOne(movie)
          .then((movies) => res.send(movies))
          .catch(next);
      } else {
        next(new ErrorForbidden('Вы не сохраняли данный фильм'));
      }
    })
    .catch(next);
};
