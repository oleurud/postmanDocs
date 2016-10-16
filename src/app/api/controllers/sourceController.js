import expressDeliver from 'express-deliver';
import { ProcessSource, SourceMarkdown } from '~/src/lib/services';
import { Source } from '~/src/lib/models';

const SourceController = expressDeliver.wrapper({
    getAll: (req, res, next) => {
        return Source.find({}, {"_id": false, "name": true});
    },

    getOne: (req, res, next) => {
        return Source.findOne({name: req.params.sourceName});
    },

    getOneFormated: (req, res, next) => {
        if(req.params.format == 'markdown') {
            return SourceMarkdown(req.params.sourceName);
        }
    },

    save: (req, res, next) => {
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

        return ProcessSource(req.body.name, req.files.sourceFile, req.body.url);
    }
});

export default SourceController;
