// backend/routes/clan.js

const express = require('express');
const router = express.Router();
const clanController = require('../controllers/clanController');

// GET /api/clans?county=CountyName
router.get('/', clanController.getClansByCounty);

module.exports = router;
