const express = require('express');
const bookRouter = express.Router();

const bookController = require('../controllers/bookController');

/* GET users listing. */
bookRouter.get('/', bookController.getBooks);

bookRouter.get('/:bookId', bookController.getBookById);

bookRouter.get('/:bookId/chapters', bookController.getChaptersByBookId);

bookRouter.get('/:bookId/chapters/:chapterId/annotations', bookController.getNotesByChapterId);

module.exports = bookRouter;
