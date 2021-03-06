import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import Source from './sourceModel';
import {slugify} from '../services';


const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    device: {
        type: String,
        required: true
    }
});

const permissionsSchema = new mongoose.Schema({
    sources: {
        type: [String]
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
        enum: [
            'Client', //only read sources
            'Admin', //manage and give permissions to "Client users" of their own sources
            'SuperAdmin' //manage and give permissions of all sources. Manage "Admin users"
        ],
        default: 'Client',
        required: true
    },
    tokens: {
        type: [tokenSchema]
    },
    permissions: {
        type: permissionsSchema
    }
},
{
    timestamps: true
});

userSchema.pre('save', function(next) {
    const user = this;

    if (user.isModified('username')) {
        user.username = slugify(user.username);
    }

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
    saveToken: function(token, device) {
        let existingByDevice = false;
        for(let i = 0; i < this.tokens.length; i++) {
            if(this.tokens[i].device == device) {
                this.tokens[i].token = token;
                existingByDevice = true;
                break;
            }
        }

        if(!existingByDevice) {
            this.tokens.push({
                token: token,
                device: device
            });
        }

        this.save();
    },
    getSourcesPermissions: function() {
        if(this.permissions && this.permissions.sources) {
            return this.permissions.sources;
        }

        return [];
    },
    hasSourcePermission: function(sourceId) {
        if(this.role == 'SuperAdmin') {
            return true;
        } else if(this.permissions && this.permissions.sources && this.permissions.sources.indexOf(sourceId) > -1) {
            return true;
        }

        return false;
    },
    addSourcePermission: function(sourceId) {
        if(!this.permissions) {
            this.permissions = {
                sources: []
            };
        }

        if(this.permissions.sources.indexOf(sourceId) == -1) {
            this.permissions.sources.push(sourceId);
            this.save();
        }
    },
    removeSourcePermission: function(sourceId) {
        if(this.permissions && this.permissions.sources.indexOf(sourceId) > -1) {
            this.permissions.sources.splice(this.permissions.sources.indexOf(sourceId), 1);
            this.save();
        }
    },
    getCommonSourcesWithUser: function(user) {
        if(this.role == 'SuperAdmin') {
            return user.getSourcesPermissions();
        } else {
            if(this.permissions && this.permissions.sources.length > 0) {
                let permissions = user.getSourcesPermissions();
                return this.permissions.sources.filter( (sourceId) => {
                    return permissions.indexOf(sourceId) > -1;
                });
            }
        }
    },
    getSourcesThatUserNotHave: function(user) {
        if(this.role == 'SuperAdmin') {
            return Source.getAllSourcesIds(this).then( (currentUserPermissions) => {
                let permissions = user.getSourcesPermissions();
                return currentUserPermissions.filter((source) => {
                    return permissions.indexOf(source._id) == -1;
                });
            });
        } else {
            return new Promise( (resolve, reject) => {
                let currentUserPermissions = this.getSourcesPermissions();
                let permissions = user.getSourcesPermissions();
                resolve(
                    currentUserPermissions.filter((sourceId) => {
                        return permissions.indexOf(sourceId) == -1;
                    })
                )
            });
        }
    }
};

userSchema.statics = {
    setRole: function(user, username, newRole) {
        if(user.role == 'SuperAdmin') {
            return this.update({
                "username": username
            },{
                $set: {
                    "role": newRole
                }
            });
        }

        return new Promise( (resolve, reject) => {
            resolve(false);
        });
    },

    setSourcePermissions: function(user, username, newPermissions) {
        if (user.role == 'SuperAdmin') {
            return this.update({
                "username": username
            },{
                $set: {
                    "permissions.sources": newPermissions
                }
            });

        } else if (user.role == 'Admin') {
            //an Admin only can add permissions to Client
            return this.findOne({"username": username}).then( (userToChangePermissions) => {
                if(userToChangePermissions && userToChangePermissions.role == 'Client') {
                    //check if Admin has permission over the sources
                    if (user.permissions && user.permissions.sources && user.permissions.sources.length > 0) {
                        newPermissions = newPermissions.filter((sourceId) => {
                            return user.permissions.sources.indexOf(sourceId) > -1
                        });

                        return this.update({
                            "username": username
                        }, {
                            $set: {
                                "permissions.sources": newPermissions
                            }
                        });
                    }
                }
            });
        }

        return new Promise( (resolve, reject) => {
            resolve(false);
        });
    },
    getAllUsersByRole: function(user) {
        if (user.role == 'SuperAdmin') {
            let usersByRole = {
                Client: [],
                Admin: []
            };

            return this.find({"role":{$ne:'SuperAdmin'}}).then( (users) => {
                users.forEach( (u) => {
                    usersByRole[u.role].push(u);
                });

                return usersByRole;
            });
        } else if(user.role == 'Admin') {
            return this.find({"role":'Client'}).then( (users) => {
                return {
                    Client: users
                }
            });
        }
    },
    getAllUsersBySourceId: function(sourceId) {
        let usersByRole = {
            Client: [],
            Admin: []
        };

        return this.find({"permissions.sources": sourceId}).then( (users) => {
            users.forEach( (u) => {
                if(u.role != 'SuperAdmin') {
                    usersByRole[u.role].push(u);
                }
            });

            return usersByRole;
        });
    },
    findOneByUsername: function(username) {
        return this.findOne({'username': username});
    }
};

export default mongoose.model('user', userSchema);