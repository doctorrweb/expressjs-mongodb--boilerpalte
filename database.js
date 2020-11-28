const mongoose = require('mongoose')
const { Mockgoose } = require('mockgoose')
require('dotenv').config()


const mongooseConnect = () => {
    return mongoose.connect(
        process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    )
}

const database = {
    connect: () => {
        return new Promise((resolve, reject) => {

            if (process.env.NODE_ENV === 'test') {
                const mockgoose = new Mockgoose(mongoose)
                mockgoose.prepareStorage()
                    .then(() => {
                        mongooseConnect()
                            .then(() => resolve())
                            .catch(error => reject(error))
                    })
                    .catch(error => {reject(error)})
            } else {
                // Conection to Databse
                mongooseConnect()
                    .then(() => resolve())
                    .catch(error => reject(error))
            }
        })
    },
    close: () => mongoose.disconnect(),
    connection: mongoose.connection
}

module.exports = database