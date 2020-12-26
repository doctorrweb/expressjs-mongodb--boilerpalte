// The implementation in the routers doesn't work yet. It needs to be fixed
// Fixing on hold ...

const { clearHash } = require('../utils/cache')

module.exports = async (req, res, next) => {
    await next()
    clearHash(req.orinigalUrl)
}