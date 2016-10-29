import jwt from 'jsonwebtoken';
import config from '~/src/lib/config';

let generateAccessToken = (user) => {
    return 'JWT ' + jwt.sign(
            {
                _id: user._id,
                username: user.username,
                role: user.role
            },
            config.secret,
            {
                expiresIn: 24*60*60
            }
        );
};

export {
    generateAccessToken
}