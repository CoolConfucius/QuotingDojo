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

// var UserSchema = new mongoose.Schema({
//  name: String,
//  age: Number
// })
// mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'
// var User = mongoose.model('User') // We are retrieving this Schema from our Models, named 'User'

var MongooseSchema = new mongoose.Schema({
 name: String,
 age: Number
})
mongoose.model('Mongoose', MongooseSchema); 
var Mongoose = mongoose.model('Mongoose');



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
// Routes
// Root Request
// app.get('/', function(req, res) {
//     // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
//     res.render('index');
// })

// The root route -- we want to get all of the users from the database and then render the index view passing it all of the users
// app.get('/', function(req, res) {
  // User.find({}, function(err, users) {
  //   // This is the method that finds all of the users from the database
  //   // Notice how the first parameter is the options for what to find and the second is the
  //   //   callback function that has an error (if any) and all of the users
  //   // Keep in mind that everything you want to do AFTER you get the users from the database must
  //   //   happen inside of this callback for it to be synchronous 
  //   // Make sure you handle the case when there is an error, as well as the case when there is no error
  //   console.log(users);
  //   res.render('index', {users})
  // })
// })

// Add User Request 
// app.post('/users', function(req, res) {
//   console.log("POST DATA", req.body);
//   // This is where we would add the user from req.body to the database.
//   // res.redirect('/');

//   var user = new User({name: req.body.name, age: req.body.age});
//   // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
//   user.save(function(err) {
//     // if there is an error console.log that something went wrong!
//     if(err) {
//       console.log('something went wrong');
//     } else { // else console.log that we did well and then redirect to the root route
//       console.log('successfully added a user!');
//       res.redirect('/');
//     }
//   })
// })






app.get('/', function(req, res) {
  Mongoose.find({}, function(err, mongooses){
    res.render('index', {mongooses})
  })
})

app.get('/mongooses/new', function(req, res) {  
  res.render('new')
})

app.get('/mongooses/:id', function(req, res) {
  console.log("ID!", req.params.id);
  Mongoose.findOne({_id: req.params.id}, function(err, mongoose){
    res.render('detail', {mongoose})
  })
})





app.post('/mongooses', function(req, res) {
  console.log("POST DATA", req.body);

  var mongoose = new Mongoose({
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
  Mongoose.findOne({_id: req.params.id}, function(err, mongoose){
    res.render('edit', {mongoose})
  })
})

app.post('/mongooses/destroy/:id', function(req, res) {
  console.log("POST DATA", req.body);
  // ...delete 1 record by a certain key/vaue.
  Mongoose.remove({_id: req.params.id}, function(err){
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
  Mongoose.findOne({_id: req.params.id}, function(err, mongoose){
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