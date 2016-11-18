import { User, Source } from '~/src/lib/models';

const UserController = {
    list: (req, res) => {
        User.getAllUsersByRole(req.user).then( (users) => {
            res.render('users/index', {
                active: 'users',
                userLogged: req.user.getPublicInfo(),
                users: users,
                errors: req.flash('roleError')
            });
        });
    },

    setRole: (req, res) => {
        if(req.user.role != 'SuperAdmin') {
            res.redirect('/cms');
        }

        const username = req.params.userName;
        const role = req.params.role;

        let validation = true;
        if (!username) {
            req.flash('roleError', 'You must enter a username');
            validate = false;
        }

        if (!role) {
            req.flash('roleError', 'You must enter role');
            validate = false;
        } else if(role == 'SuperAdmin' || (role != 'Client' && role != 'Admin')) {
            req.flash('roleError', 'Role not allowed');
            validate = false;
        }

        if(!validation) {
            res.redirect('/cms/users');
        }

        User.setRole(req.user, username, role).then( (result) => {
            if(!result) {
                req.flash('roleError', 'Unauthorized');
            }
            res.redirect('/cms/users');
        });
    },

    add: (req, res, next) => {
        res.render('users/add', {
            active: 'users',
            userLogged: req.user.getPublicInfo(),
            errors: req.flash('addingUserError')
        });
    },

    createUser: (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;

        let validation = true;
        if (!email) {
            req.flash('addingUserError', 'You must enter an email');
            validate = false;
        }

        if (!password) {
            req.flash('addingUserError', 'You must enter a password');
            validate = false;
        }

        if (!username) {
            req.flash('addingUserError', 'You must enter a username');
            validate = false;
        }

        if(!validation) {
            res.redirect('/cms/users/add');
        }

        //check if email exists
        return User.findOne(
            { email: email }
        ).then( (existingUser) => {
            if (existingUser) {
                req.flash('addingUserError', 'That email address is already in use');
                res.redirect('/cms/users/add');
            }

            //check if username exists
            return User.findOne(
                { username: username }
            ).then( (existingUser) => {
                if (existingUser) {
                    req.flash('addingUserError', 'That username is already in use');
                    res.redirect('/cms/users/add');
                }

                //valid user
                let user = new User({
                    email: email,
                    password: password,
                    username: username,
                    tokens: []
                });

                user.save().then(() => {
                    res.redirect('/cms/users');
                });
            });
        });
    },

    sources: (req, res, next) => {
        const userName = req.params.userName;
        User.findOneByUsername(userName).then( (user) => {
            let sourcesIds = req.user.getCommonSourcesWithUser(user);
            Source.getAllByIdsArray(sourcesIds).then( (sources) => {
                req.user.getSourcesThatUserNotHave(user).then( (sourcesIdsWithoutPermissions) => {
                    Source.getAllByIdsArray(sourcesIdsWithoutPermissions).then( (sourcesWithoutPermissions) => {
                        res.render('users/sources', {
                            active: 'users',
                            userLogged: req.user.getPublicInfo(),
                            user: user,
                            sources: sources,
                            sourcesNotSelected: sourcesWithoutPermissions
                        });
                    });
                });
            });
        });
    },

    permissions: (req, res, next) => {
        const userName = req.params.userName;
        const sourceId = req.params.sourceId;
        const action = req.params.action;

        if (!userName) {
            res.redirect('/cms/users')
        }
        if (!sourceId || !action || (action != 'add' && action != 'remove')) {
            res.redirect('/cms/users/' + userName + '/sources')
        }

        User.findOneByUsername(userName).then( (user) => {
            if (action == 'add') {
                user.addSourcePermission(sourceId);
            } else if(action == 'remove') {
                user.removeSourcePermission(sourceId);
            }

            res.redirect('/cms/users/' + userName + '/sources')
        });
    }
};

export default UserController;
