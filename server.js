// Require the Express Module
var express = require('express');
var mongoose = require('mongoose');

// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));

// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose');

var QuoteSchema = new mongoose.Schema({
 name: String,
 quote: String
})
mongoose.model('Mongoose', QuoteSchema); 
var Quote = mongoose.model('Quote');

// Use native promises
mongoose.Promise = global.Promise;


// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
  res.render('index')
})

app.get('/quotes', function(req, res) {
  Quote.find({}, function(err, quotes){
    res.render('quotes', {quotes})
  })
})

app.post('/mongooses', function(req, res) {
  console.log("POST DATA", req.body);

  var mongoose = new Quote({
    name: req.body.name, age: req.body.age
  });
  mongoose.save(function(err) {
    if(err) {
      console.log('something went wrong');
    } else { 
      console.log('successfully added a mongoose!');
      res.redirect('/');
    }
  })
})

app.get('/mongooses/edit/:id', function(req, res) {  
  Quote.findOne({_id: req.params.id}, function(err, mongoose){
    res.render('edit', {mongoose})
  })
})

app.post('/mongooses/destroy/:id', function(req, res) {
  console.log("POST DATA", req.body);
  // ...delete 1 record by a certain key/vaue.
  Quote.remove({_id: req.params.id}, function(err){
   // This code will run when the DB has attempted to remove all matching records to {_id: 'insert record unique id here'}
   if(err) {
      console.log('something went wrong');
    } else { 
      console.log('successfully removed a mongoose!');
      res.redirect('/');
    }
  })
})

app.post('/mongooses/:id', function(req, res) {
  console.log("POST DATA", req.body);
  Quote.findOne({_id: req.params.id}, function(err, mongoose){
    console.log("mongoose", mongoose);
    mongoose.name = req.body.name || mongoose.name;
    mongoose.age = req.body.age || mongoose.age;
    mongoose.save(function(err) {
      if(err) {
        console.log('something went wrong');
      } else { 
        console.log('successfully edited a mongoose!');
        res.redirect('/');
      }
    })
  })
})











// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})