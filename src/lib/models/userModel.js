import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    device: {
        type: String,
        required: true
    },
    randomToken: {
        type: String,
        required: true
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Client', 'Admin'],
        default: 'Client'
    },
    tokens: {
        type: [tokenSchema]
    }
},
{
    timestamps: true
});

userSchema.pre('save', function(next) {
    const user = this;
    const SALT_FACTOR = 5;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods = {
    comparePassword: function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
            if (err) {
                return cb(err);
            }

            cb(null, isMatch);
        });
    },

    getPublicInfo: function() {
        return {
            email: this.email,
            username: this.username,
            role: this.role
        }
    },
    getTokenByDevice: function(device) {
        for(let i = 0; i < this.tokens.length; i++) {
            if(this.tokens[i].device == device) {
                return this.tokens[i];
            }
        }

        return false;
    },
    saveToken: function(token, device, randomToken) {
        let existingByDevice = false;
        for(let i = 0; i < this.tokens.length; i++) {
            if(this.tokens[i].device == device) {
                this.tokens[i].token = token;
                this.tokens[i].randomToken = randomToken;
                existingByDevice = true;
                break;
            }
        }

        if(!existingByDevice) {
            this.tokens.push({
                token: token,
                device: device,
                randomToken: randomToken
            });
        }

        this.save();
    }
};

export default mongoose.model('user', userSchema);