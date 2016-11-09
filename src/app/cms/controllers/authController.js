const AuthController = {
    login: (req, res) => {
        if(req.user) {
            res.redirect('/cms');
        } else {
            res.render('auth/login', { errors: req.flash('loginMessage') });
        }
    },
    successLogin: (req, res) => {
        res.redirect('/cms');
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/cms/auth/login');
    },
};

export default AuthController;
