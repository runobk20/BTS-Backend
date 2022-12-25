const mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        await mongoose.connect(process.env.DB_CNN)
        console.log('DB Running...')
        
    } catch (error) {
        console.log(error);
        throw new Error('Could not initialize Database');
    }
}

module.exports = {
    dbConnection
}