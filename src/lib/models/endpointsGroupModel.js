import mongoose from 'mongoose';
import endpointSchema from './endpointModel';

const Schema = mongoose.Schema;

export default new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    endpoints: [endpointSchema]
});