// файл маршрутов
const router = require('express').Router();
const { getMovies, deleteMovieById, createMovie } = require('../controllers/movies');

const {
  validateMovieId, validateCreateMovie,
} = require('../validation/validation');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', validateMovieId, deleteMovieById);

module.exports = router;
