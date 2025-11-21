// server.js 
require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const enrollmentRoutes = require('./routes/enrollment');
const projectRoutes = require('./routes/project');

const app = express();

// DB
connectDB();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser
app.use(express.urlencoded({ extended: true }));

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Method override for PUT/DELETE
app.use(methodOverride('_method'));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'devsecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);

// Routes
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/projects', projectRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
