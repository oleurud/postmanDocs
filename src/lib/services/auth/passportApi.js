import passport from 'passport';
import { User } from '~/src/lib/models';
import config from '../../config';
import PassportJwt from 'passport-jwt';
import LocalStrategy from 'passport-local';
import { errorResponse } from '~/src/lib/services';

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
            return done(errorResponse(10002));
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err || !isMatch) {
                return done(errorResponse(10002));
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
            done(errorResponse(10000), false);
        } else {
            let token = req.headers.authorization;
            let dbToken = user.getTokenByDevice(payload.device);

            if(dbToken && dbToken.token == token) {
                done(null, user);
            } else {
                done(errorResponse(10001), false);
            }
        }
    });
});

passport.use(jwtLogin);


/*
 * CMS strategy
 */
