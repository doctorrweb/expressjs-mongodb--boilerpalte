const { expect } = require('chai')
const geocoder = require('../../../../api/v1/utils/geocoder')

describe('Geocoder with mapquest', () => {
    it('should return the city of winterthur', async () => {
        const [loc] = await geocoder.geocode('Zypressenstrasse 18, 8408 Winterthur')
        expect(loc).to.have.property('latitude')
        expect(loc).to.have.property('longitude')
        expect(loc.stateCode).to.equal('Zurich')
    })
})