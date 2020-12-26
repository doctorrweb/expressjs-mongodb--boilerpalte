const { expect } = require('chai')
const errorResponse = require('../../../../api/v1/utils/errorResponse')

describe('Error Handler', () => {
    

    context('Generate an error Response', () => {

        it('should return a server error', () => {
            const err = new errorResponse('This is a server error', 500)
            expect(err).to.have.property('message')
            expect(err).to.have.property('statusCode')
            expect(err.message).to.be.equal('This is a server error')
            expect(err.statusCode).to.be.equal(500)
        })

    })
})