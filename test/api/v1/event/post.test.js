// const { expect } = require('chai')
// const request = require('supertest')

// const database = require('../../../../database')
// const server = require('../../../../server')

// describe('POST /events', () => {
//     before((done) => {
//         database.connect()
//             .then(() => done())
//             .catch(err =>  done(err))
//     })


//     after((done) => {
//         database.close()
//             .then(() => done())
//             .catch(err => done(err))
//     })

//     it('Success, creating a new Event', (done) => {
//         request(server)
//             .post('/api/v1/events')
//             .send({
//                 "name": "Test Event 1",
//                 "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec velit velit, bibendum vitae ullamcorper malesuada, vestibulum nec lectus. Pellentesque feugiat rutrum ex, porttitor malesuada justo. Ut ut ligula semper, posuere nulla non, maximus eros. Proin posuere vulputate malesuada. Suspendisse porta lobortis est, in imperdiet ex molestie quis.",
//                 "website": "https://testwebsite.com/",
//                 "email": "info@testwebsite.com",
//                 "address": "testaddress 18 4356 testcity",
//                 "category": "other",
//                 "free": true
//             })
//             .then(res => {
//                 const body = res.body
//                 expect(body).to.have.property('_id')
//                 expect(body).to.have.property('name')
//                 expect(body).to.have.property('description')
//                 expect(body).to.have.property('website')
//                 expect(body).to.have.property('email')
//                 expect(body).to.have.property('address')
//                 expect(body).to.have.property('category')
//                 expect(body).to.have.property('free')

//                 done()
//             })
//     })
// })