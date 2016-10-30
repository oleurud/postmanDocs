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
    secretOrKey: config.secret,
    passReqToCallback: true,
    ignoreExpiration: true
};

const jwtLogin = new JwtStrategy(jwtStrategyOptions, function(req, payload, done) {
    User.findOne({
        _id: payload._id,
        username: payload.username,
        role: payload.role
    }, function(err, user) {
        if (err || !user) {
            done({error: 'Unauthorized'}, false);
        } else {
            let token = req.headers.authorization;
            let dbToken = user.getTokenByDevice(payload.device);

            if(dbToken && dbToken.token == token) {
                done(null, user);
            } else {
                done({ error: 'Token expired' }, false);
            }
        }
    });
});

passport.use(jwtLogin);
