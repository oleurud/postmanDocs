import expressDeliver from 'express-deliver';
import { User } from '~/src/lib/models';
import { generateAccessToken, generateRandomToken } from '~/src/lib/services/auth';

const AuthController = expressDeliver.wrapper({
    login: (req, res, next) => {
        return User.findOne(
            { email: req.body.email }
        ).then( (user) => {
            const device = req.body.device;
            if (!device) {
                return { error: 'You must enter a device.'};
            }

            return generateRandomToken().then((randomToken) => {
                const token = generateAccessToken(user, device, randomToken);
                user.saveToken(token, device, randomToken);

                return {
                    token: token,
                    user: user.getPublicInfo()
                };
            });
        });
    },

    register: (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
        const device = req.body.device;

        if (!email) {
            return { error: 'You must enter an email address.'};
        }

        if (!password) {
            return { error: 'You must enter a password.' };
        }

        if (!username) {
            return { error: 'You must enter a username.' };
        }

        if (!device) {
            return { error: 'You must enter a device.'};
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
                    username: username,
                    tokens: []
                });

                return generateRandomToken().then((randomToken) => {
                    const token = generateAccessToken(user, device, randomToken);
                    user.tokens.push({
                        token: token,
                        device: device,
                        randomToken: randomToken
                    });

                    return user.save()
                        .then(() => {
                            return {
                                token: token,
                                user: user.getPublicInfo()
                            };
                        });
                });
            });
        });
    }

});

export default AuthController;