
const dotenv = require('dotenv')
dotenv.config()

const MONGO_USER_NAME = process.env.MONGO_USER_NAME || 'digi-prex';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'digi-prex';

const MONGO_URL = `mongodb+srv://${MONGO_USER_NAME}:${MONGO_PASSWORD}@cluster0.ngkrbjp.mongodb.net/?retryWrites=true&w=majority`

module.exports = {
    mongo :{
        url : MONGO_URL
    }
}