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
    isPublic: {
        type: Boolean,
        default: false
    },
    data: {
        type: [endpointsGroupSchema]
    }
});

sourceSchema.statics = {
    _getAllSourcesQuery: function(user, includePublics) {
        let query = {};
        if(user.role != 'SuperAdmin') {
            if(includePublics) {
                query = {
                    $or: [
                        {
                            "isPublic": true
                        },
                        {
                            "_id": {
                                $in: user.getSourcesPermissions()
                            }
                        }
                    ]
                }
            } else {
                query = {
                    "_id": {
                        $in: user.getSourcesPermissions()
                    }
                }
            }
        }

        return query;
    },

    getAllSourcesNames: function(user, includePublics) {
        return this.find(this._getAllSourcesQuery(user, includePublics), {
            "_id": false,
            "name": true
        });
    },

    getAllSourcesIds: function(user, includePublics) {
        return this.find(this._getAllSourcesQuery(user, includePublics), {
            "_id": true
        });
    },
    
    getOne: function(sourceName, user, includePublics) {
        return this.findOne({name: sourceName}).then( (source) => {
            if(!source || (user.role != 'SuperAdmin' && !user.hasSourcePermission(source._id) && !(includePublics && source.isPublic) )) {
                return false;
            }

            return source;
        });
    },

    getAllByIdsArray: function(ids) {
        return this.find({'_id':{$in:ids}});
    }
}

export default mongoose.model('source', sourceSchema);
