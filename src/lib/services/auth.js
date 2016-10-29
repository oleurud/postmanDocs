import jwt from 'jsonwebtoken';
import config from '~/src/lib/config';
import bcrypt from 'bcrypt-nodejs';

let generateAccessToken = (user, device, randomToken) => {
    return 'JWT ' + jwt.sign(
            {
                _id: user._id,
                username: user.username,
                role: user.role,
                device: device,
                randomToken: randomToken
            },
            config.secret,
            {
                expiresIn: 24*60*60
            }
        );
};

let generateRandomToken = () => {
    const SALT_FACTOR = 5;
    const randomString = Math.random() * 1000000 + '' + new Date().getTime() + '' + Math.random() * 100000;

    return new Promise((resolve, reject) => {
        bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
            if (err) resolve(randomString);

            resolve(
                new Promise((resolve, reject) => {
                    bcrypt.hash(randomString, salt, null, function (err, hash) {
                        if (err) resolve(randomString);

                        resolve(hash);
                    });
                })
            )
        });
    });
}


export {
    generateAccessToken,
    generateRandomToken
}