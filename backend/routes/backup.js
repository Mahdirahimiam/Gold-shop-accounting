// routes/backup.js

const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');

// مسیر آپلود بکاپ
router.post('/upload', backupController.uploadBackup);

// مسیر دانلود بکاپ
router.get('/download/:userId', backupController.downloadBackup); // :userId پارامتر مسیر هست

module.exports = router;