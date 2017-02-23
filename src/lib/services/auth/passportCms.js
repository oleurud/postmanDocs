import passport from 'passport';
import LocalStrategy from 'passport-local';
import { User } from '~/src/lib/models';

const localStrategyOptions = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
};

const localLogin = new LocalStrategy(localStrategyOptions, function(req, email, password, done) {

    User.findOne({email: email}, function (err, user) {
        if (err || !user) {
            return done(null, false, req.flash('loginMessage', 'Your login details could not be verified. Please try again'));
        }

        user.comparePassword(password, function (err, isMatch) {
            if (err || !isMatch) {
                return done(null, false, req.flash('loginMessage', 'Your login details could not be verified. Please try again'));
            }

            if (!user.role || (user.role != 'Admin' && user.role != 'SuperAdmin')) {
                return done(null, false, req.flash('loginMessage', 'You do not have permissions'));
            }

            req.flash('loginMessage', null);
            return done(null, user);
        });
    });
});

passport.use('localCMS', localLogin);

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }).then(function(user) {
        done(null, user);
    }).catch(function(err) {
        done(err, null);
    });
});