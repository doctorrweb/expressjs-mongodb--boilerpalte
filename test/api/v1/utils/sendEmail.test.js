const { expect } = require('chai')
const sendEmail = require('../../../../api/v1/utils/sendEmail')

describe('Email sender', () => {

    it('should send an email', async () => {
        const message = 'This email is coming following the triggering of the test command'
        const email = await sendEmail({
            email: 'noreply@doctorrweb.com',
            subject: 'testing sendEmail helper',
            message
        })

        expect(email).to.exist
    })
})