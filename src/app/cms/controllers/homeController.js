const HomeController = {
    index: (req, res) => {
        if(!req.user) {
            res.redirect('/cms/auth/login');
        } else {
            res.redirect('/cms/sources');
        }
    }
};

export default HomeController;
