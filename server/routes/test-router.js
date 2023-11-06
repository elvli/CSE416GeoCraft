const express = require('express')
const TestController = require('../controllers/test-controller')
const router = express.Router()

router.post('/tests', TestController.createTestString)
router.get('/tests', TestController.getTests)

module.exports = router