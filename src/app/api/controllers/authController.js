import expressDeliver from 'express-deliver';
import { User } from '~/src/lib/models';
import { errorResponse, generateAccessToken } from '~/src/lib/services';

const AuthController = expressDeliver.wrapper({
    login: (req, res, next) => {
        return User.findOne(
            { email: req.body.email }
        ).then( (user) => {
            const device = req.body.device;
            if (!device) {
                return errorResponse(10104);
            }

            const token = generateAccessToken(user, device);
            user.saveToken(token, device);

            return {
                token: token,
                user: user.getPublicInfo()
            };
        });
    },

    register: (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
        const device = req.body.device;

        if (!email) {
            return errorResponse(10101);
        }

        if (!password) {
            return errorResponse(10102);
        }

        if (!username) {
            return errorResponse(10103);
        }

        if (!device) {
            return errorResponse(10105);
        }

        //check if email exists
        return User.findOne(
            { email: email }
        ).then( (existingUser) => {
            if (existingUser) {
                return errorResponse(10111);
            }

            //check if username exists
            return User.findOne(
                { username: username }
            ).then( (existingUser) => {
                if (existingUser) {
                    return errorResponse(10112);
                }

                //valid user
                let user = new User({
                    email: email,
                    password: password,
                    username: username,
                    tokens: []
                });

                const token = generateAccessToken(user, device);
                user.tokens.push({
                    token: token,
                    device: device
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
    }
    
});

export default AuthController;