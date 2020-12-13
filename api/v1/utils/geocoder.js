const NodeGeocoder = require('node-geocoder')

require('dotenv').config()
const env = process.env

const options = {
  provider: env.GEOCODER_PROVIDER,
 
  // Optional depending on the providers
  apiKey: env.GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
}

const geocoder = NodeGeocoder(options)

module.exports = geocoder