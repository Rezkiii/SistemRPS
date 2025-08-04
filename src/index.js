const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


// Routes
const indexRouter = require('./routes/index');
const exportRouter = require('./routes/export');
app.use('/', indexRouter);
app.use('/', exportRouter);


app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});