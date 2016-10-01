var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('form', { title: 'form' });
});

router.post('/', function(req, res, next) {
  console.log(req.files);
  res.redirect('/form/success');
});

router.get('/success', function(req, res, next) {
  res.render('success', { title: 'Success form' });
});

module.exports = router;
