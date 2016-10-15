import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const headerSchema = new Schema({
    key: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

const requestSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    header: {
        type: [headerSchema],
    },
    body: {
        type: Schema.Types.Mixed,
    },
    description: {
        type: String
    }
});

const responseSchema = new Schema({
    name: {
        type: String,
    },
    body: {
        type: Schema.Types.Mixed,
    }
});

export default new Schema({
    name: {
        type: String,
        required: true
    },
    request: {
        type: requestSchema,
        required: true
    },
    response: {
        type: [responseSchema]
    }
});