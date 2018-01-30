const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));


router.get('/', (req, res) => {
	req.app.locals.layout = 'layout';
  res.render('contact', {title: 'Contact Us', header: req.headers.authorization});
});

module.exports = router
