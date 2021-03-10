const express = require('express');
const bookRoute = express.Router();

const bookController = require('../controllers/bookController');

/* GET users listing. */
bookRoute.get('/', bookController.getBooks());

module.exports = bookRoute;
