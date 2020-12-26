const util = require('util')
const mongoose = require('mongoose')
const redis = require('redis')

require('dotenv').config()
const env = process.env

const client = redis.createClient(env.CACHE_URL)
client.hget = util.promisify(client.hget)

const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true
    this.hashKey = JSON.stringify(options.key || 'default')
    return this
}

mongoose.Query.prototype.exec = async function () {

    if (!this.useCache) return await exec.apply(this, arguments)

    const key = JSON.stringify({
        ...this.getFilter(),
        collection: this.mongooseCollection.name
    })

    
    // Check if we have a value for the key in redis
    const cachedValue = await client.hget(this.hashKey, key)

    // If we do, return that
    if (cachedValue) {
        const doc = JSON.parse(cachedValue)

        return Array.isArray(doc) 
            ? doc.map(d => this.model(d)) 
            : new this.model(doc)
    }

    const result = await exec.apply(this, arguments)

    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10)
    return result
}

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey))
  }
}