var fs = require('fs');
var express = require('express');
var Busboy = require('busboy');

var router = express.Router();
var lastForm = { 
  file: null, 
  image: null,
  title: null,
  description: null,
  hours: null,
  minutes: null
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('form', { title: 'form' });
});

router.post('/', function(req, res, next) {
  var fstream;
  var busboy = new Busboy({headers: req.headers});

  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    if (val) lastForm[fieldname] = val;
  });

  busboy.on('file', function (fieldname, file, filename) {
    if (!filename) return;
    var publicPath = '/files/' + fieldname + '/' + filename;
    fstream = fs.createWriteStream(__dirname + '/../public' + publicPath);
    file.pipe(fstream);
    fstream.on('close', function(){
        console.log('file ' + filename + ' uploaded');
        lastForm[fieldname] = fieldname === 'image' ? publicPath : filename;
    });

    file.on('end', function() {
      console.log('File [' + fieldname + '] Finished');
    });
  });

  busboy.on('finish', function() {
    console.log('Done parsing form!');
  });

  req.pipe(busboy);

  req.on('end', function() {
    res.redirect('/form/success');
  });
});

router.get('/success', function(req, res, next) {
  res.render('success', lastForm);
});

module.exports = router;
