const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register =  async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome');
            res.redirect('/');
        })
    } catch {
        req.flash('error', 'Registration failed');
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back');
    res.redirect('/home');
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash('error', 'Logout failed');
            res.redirect('/'); // redirect to an appropriate page in case of an error
        } else {
            req.flash('success', 'You are logged out');
            res.redirect('/');
        }
    });
}