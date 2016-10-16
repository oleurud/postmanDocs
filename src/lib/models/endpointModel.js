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

const requestByLanguageSchema = new Schema({
    curl: {
        type: String,
        required: true
    },
    node: {
        type: String,
        required: true
    },
    javascript: {
        type: String,
        required: true
    },
    php: {
        type: String,
        required: true
    },
    java: {
        type: String,
        required: true
    },
    objc: {
        type: String,
        required: true
    },
    swift: {
        type: String,
        required: true
    },
    python: {
        type: String,
        required: true
    },
    ruby: {
        type: String,
        required: true
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
    headers: {
        type: [headerSchema]
    },
    body: {
        type: Schema.Types.Mixed
    },
    description: {
        type: String
    },
    byLanguage: {
        type: requestByLanguageSchema
    }
});

const responseSchema = new Schema({
    name: {
        type: String
    },
    body: {
        type: Schema.Types.Mixed
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