const express = require('express');
const router = express.Router();
const { submitComment } = require('../controllers/commentController');

router.post('/', submitComment);  // <- just '/' since /api/comments is already prefixed

module.exports = router;
