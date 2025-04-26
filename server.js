require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true
}));

const adminUser = process.env.ADMIN_USER || 'kynadmin';
const adminPass = process.env.ADMIN_PASS || 'Toahere_987';

// Authentication Middleware
function isAuthenticated(req, res, next) {
    if (req.session.authenticated) {
        return next();
    } else {
        res.redirect('/admin/login');
    }
}

// Routes
app.get('/', (req, res) => {
    res.redirect('/status');
});

app.get('/status', (req, res) => {
    res.render('status');
});

app.get('/admin/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === adminUser && password === adminPass) {
        req.session.authenticated = true;
        res.redirect('/admin/dashboard');
    } else {
        res.render('login', { error: 'Invalid credentials' });
    }
});

app.get('/admin/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard');
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

app.listen(PORT, () => {
    console.log(`Website server running on port ${PORT}`);
});
