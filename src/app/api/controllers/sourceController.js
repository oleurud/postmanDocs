import expressDeliver from 'express-deliver';
import { ProcessSource, SourceMarkdown } from '~/src/lib/services';
import { Source } from '~/src/lib/models';

const SourceController = expressDeliver.wrapper({
    getAll: (req, res, next) => {
        return Source.getAllSourcesNames(req.user).then( (sources) => {
            return sources;
        });
    },

    getOne: (req, res, next) => {
        return Source.getOne(req.params.sourceName, req.user).then( (source) => {
            if (source) {
                return source;
            } else {
                return {error: 'Not found'}
            }
        });
    },

    getOneFormated: (req, res, next) => {
        if(req.params.format == 'markdown') {
            return SourceMarkdown(req.params.sourceName, req.user).then( (source) => {
                if (source) {
                    return source;
                } else {
                    return {error: 'Not found'}
                }
            });
        } else {
            return {error: 'Not found'}
        }
    },

    save: (req, res, next) => {
        if (req.user.role == 'Client') {
            return {
                error: 'You dont have permissions to create sources'
            }
        }

        if (!req.files || !req.files.sourceFile) {
            return {
                error: 'You must add a postman collection'
            }
        }

        if (!req.body.name) {
            return {
                error: 'You must set a collection name'
            }
        }

        if (!req.body.url) {
            return {
                error: 'You must set a url'
            }
        }

        return ProcessSource(req.body.name, req.files.sourceFile, req.body.url, req.user);
    }
});

export default SourceController;
