import mongoose from 'mongoose';
import endpointsGroupSchema from './endpointsGroupModel';

const Schema = mongoose.Schema;

const sourceSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    data: {
        type: [endpointsGroupSchema]
    }
});

sourceSchema.statics = {
    getAllSourcesNames: function(user) {
        let query = {};
        if(user.role != 'SuperAdmin') {
            query = {
                "_id": {
                    $in: user.getSourcesPermissions()
                }
            }
        }
        return this.find(query, {
            "_id": false,
            "name": true
        });
    },
    
    getOne: function(sourceName, user) {
        return this.findOne({name: sourceName}).then( (source) => {
            if(!source || !user.hasSourcePermission(source._id)) {
                return false;
            }

            return source;
        });
    }
}

export default mongoose.model('source', sourceSchema);
