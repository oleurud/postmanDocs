import { errorResponse, ProcessSource, SourceMarkdown } from '~/src/lib/services';
import { Source, User } from '~/src/lib/models';

const SourceController = {
    getAll: (req, res, next) => {
        return Source.getAllSourcesNames(req.user).then( (sources) => {
            res.render('sources/index', {
                active: 'sources',
                userLogged: req.user.getPublicInfo(),
                sources: sources
            });
        });
    },

    add: (req, res, next) => {
        res.render('sources/add', {
            active: 'sources',
            userLogged: req.user.getPublicInfo(),
            errors: req.flash('addingSourceError')
        });
    },

    save: (req, res, next) => {
        let validate = true;
        if (req.user.role == 'Client') {
            req.flash('addingSourceError', 'You dont have permissions to create sources');
            validate = false;
        }

        if (!req.files || !req.files.sourceFile) {
            req.flash('addingSourceError', 'You must add a postman collection');
            validate = false;
        }

        if (!req.body.name) {
            req.flash('addingSourceError', 'You must set a collection name');
            validate = false;
        }

        if (!req.body.url) {
            req.flash('addingSourceError', 'You must set a url');
            validate = false;
        }

        if(!validate) {
            res.redirect('/cms/sources/add');
        }

        ProcessSource(req.body.name, req.files.sourceFile, req.body.url, req.user).then( (result) => {
            if(result.error) {
                req.flash('addingSourceError', result.error);
                res.redirect('/cms/sources/add');
            }

            res.redirect('/cms/sources');
        });
    },

    users: (req, res, next) => {
        const sourceName = req.params.sourceName;
        Source.getOne(sourceName, req.user).then( (source) => {
            if(!source) {
                res.redirect('/cms/sources')
            }

            User.getAllUsersBySourceId(source._id).then( (users) => {
                res.render('sources/users', {
                    active: 'sources',
                    userLogged: req.user.getPublicInfo(),
                    users: users,
                    source: source
                });
            });
        })
    },

    config: (req, res, next) => {
        const sourceName = req.params.sourceName;
        Source.getOne(sourceName, req.user).then( (source) => {
            if(!source) {
                res.redirect('/cms/sources')
            }

            res.render('sources/config', {
                active: 'sources',
                userLogged: req.user.getPublicInfo(),
                source: source
            });
        })
    },

    configSave: (req, res, next) => {
        const sourceName = req.params.sourceName;
        Source.getOne(sourceName, req.user).then( (source) => {
            if (!source) {
                res.redirect('/cms/sources')
            }

            source.name = req.body.name;
            source.isPublic = req.body.isPublic;
            source.save();

            res.redirect('/cms/sources');
        })
    }
};

export default SourceController;
