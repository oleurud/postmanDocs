import expressDeliver from 'express-deliver';
import { errorResponse, ProcessSource, SourceMarkdown } from '~/src/lib/services';
import { Source } from '~/src/lib/models';

const SourceController = expressDeliver.wrapper({
    getAll: (req, res, next) => {
        return Source.getAllSourcesNames(req.user, true).then( (sources) => {
            return sources;
        });
    },

    getOne: (req, res, next) => {
        return Source.getOne(req.params.sourceSlug, req.user, true).then( (source) => {
            if (source) {
                return source;
            } else {
                return errorResponse(404);
            }
        });
    },

    getOneFormated: (req, res, next) => {
        if(req.params.format == 'markdown') {
            return SourceMarkdown(req.params.sourceSlug, req.user).then( (source) => {
                if (source) {
                    return source;
                } else {
                    return errorResponse(404);
                }
            });
        } else {
            return errorResponse(404);
        }
    },

    save: (req, res, next) => {
        if (req.user.role == 'Client') {
            return errorResponse(12001);
        }

        if (!req.files || !req.files.sourceFile) {
            return errorResponse(12002);
        }

        if (!req.body.name) {
            return errorResponse(12003);
        }

        if (!req.body.url) {
            return errorResponse(12004);
        }

        return ProcessSource(req.body.name, req.files.sourceFile, req.body.url, req.user);
    }
});

export default SourceController;
