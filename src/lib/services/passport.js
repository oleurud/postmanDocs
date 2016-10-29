import passport from 'passport';
import { User } from '~/src/lib/models';
import config from '../config';
import PassportJwt from 'passport-jwt';
import LocalStrategy from 'passport-local';

const JwtStrategy = PassportJwt.Strategy;
const ExtractJwt = PassportJwt.ExtractJwt;

/*
 LocalStrategy
 */
const localStrategyOptions = {
    usernameField: 'email'
};

const localLogin = new LocalStrategy(localStrategyOptions, function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
        if(err || !user) {
            return done({ error: 'Your login details could not be verified. Please try again.' });
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err || !isMatch) {
                return done({ error: "Your login details could not be verified. Please try again." });
            }

            return done(null, user);
        });
    });
});

passport.use(localLogin);


/*
 JwtStrategy
 */
const jwtStrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtStrategyOptions, function(payload, done) {
    User.findOne({ _id: payload._id }, function(err, user) {
        if (err) {
            return done(err, false);
        }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

passport.use(jwtLogin);
