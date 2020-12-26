const advancedFiltering = (model, populate) => async (req, res, next) => {
    let query

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    // Create Query String
    let queryStr = JSON.stringify(reqQuery)

    // Create operators ($gt, $gte, $lt, $lte and $in)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    // Finding Resource
    query = model.find(JSON.parse(queryStr))

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        console.log('fields', fields)
        query = query.select(fields)
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 50
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const totalDoc = await model .countDocuments()

    query = query.skip(startIndex).limit(limit)

    if (populate) {
        query = query.populate(populate)
    }

    // Pagination Result
    const pagination = {}

    if (endIndex < totalDoc) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    // Executing query
    const results = await query.cache({
        key: req.originalUrl
    })

    res.advancedFiltering = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next()
}

module.exports = advancedFiltering