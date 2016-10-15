import expressDeliver from 'express-deliver';
import { User } from '~/src/lib/models';
import jwt from 'jsonwebtoken';
import config from '~/src/lib/config';

function generateToken(user) {
    return jwt.sign(user, config.secret, {
        expiresIn: 24*60*60
    });
}

function setUserInfo(request) {
    return {
        email: request.email,
        username: request.username,
        role: request.role
    };
}

const AuthController = expressDeliver.wrapper({
    login: (req, res, next) => {
        let userInfo = setUserInfo(req.user);
        return {
            token: 'JWT ' + generateToken(userInfo),
            user: userInfo
        };
    },

    register: (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;

        if (!email) {
            return { message: 'You must enter an email address.'};
        }

        if (!password) {
            return { error: 'You must enter a password.' };
        }

        if (!username) {
            return { error: 'You must enter a username.' };
        }

        //check if email exists
        return User.findOne(
            { email: email }
        ).then( (existingUser) => {
            if (existingUser) {
                return { error: 'That email address is already in use.' };
            }

            //check if username exists
            return User.findOne(
                { username: username }
            ).then( (existingUser) => {
                if (existingUser) {
                    return { error: 'That username is already in use.' };
                }

                //valid user
                let user = new User({
                    email: email,
                    password: password,
                    username: username
                });

                return user.save()
                    .then(() => {
                        let userInfo = setUserInfo(user);

                        return {
                            token: 'JWT ' + generateToken(userInfo),
                            user: userInfo
                        };
                    });
            });
        });
    }

});

export default AuthController;