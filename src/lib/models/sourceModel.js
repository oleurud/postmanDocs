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

export default mongoose.model('source', sourceSchema);
