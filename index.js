// IMPORTS //
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const assignmentRoutes = require('./routes/assignment');
const issueRoutes = require('./routes/issue');
const inspectionRoutes = require('./routes/inspection');
const operatorRoutes = require('./routes/operator');
const vehicleRoutes = require('./routes/vehicle');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');

const User = require('./models/User');

// EXPRESS SETUP
const app = express();
mongoose.set('useFindAndModify', false);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/fleetsystem1';
// 'mongodb://admin:admin@emmaxdb-shard-00-00-emrlw.mongodb.net:27017,emmaxdb-shard-00-01-emrlw.mongodb.net:27017,emmaxdb-shard-00-02-emrlw.mongodb.net:27017/fms?ssl=true&replicaSet=EmmaxDB-shard-0&authSource=admin&retryWrites=true&w=majority';

// Default config for express-session

// MONGOOSE CONNECTION
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(
  session({
    secret: 'thisisajustarandomkey wordforexpression',
    resave: false,
    saveUninitialized: false
  })
);

// VIEW ENGINE SETUP //
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// APPENDING THE PUBLIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// BODY-PARSER SETUP
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(methodOverride('_method'));

// Using the routes
app.use('/', indexRoutes);
app.use('/issue', issueRoutes);
app.use('/inspection', inspectionRoutes);
app.use('/operator', operatorRoutes);
app.use('/vehicle', vehicleRoutes);
app.use('/auth', authRoutes);
app.use('/assignment', assignmentRoutes);

// SERVER
app.listen(process.env.PORT || 3040, err => {
  console.log('Server started');
});
