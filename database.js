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
                            .then((res, err) => {
                                if (err) return reject(err)
                                resolve()
                            })
                    })
            } else {
                // Conection to Databse
                mongooseConnect()
                    .then((res, err) => {
                        if (err) return reject(err)
                        resolve()
                    })
            }
            
        })
    },
    close: () => {
        mongoose.disconnect()
    },
    connection: mongoose.connection
}

module.exports = database