const assert = require('chai').assert
const createRequest = require('../index.js').createRequest

describe('createRequest', () => {
  const jobID = '1'
  const COMP = '0xc00e94Cb662C3520282E6f5717214004A7f26888'

  context('successful calls', () => {
    const requests = [
      { name: 'id not supplied', testData: { data: { token: COMP, quote: 'USD' } } },
      { name: 'token comp/quote usd', testData: { id: jobID, data: { token: COMP, quote: 'USD' } } },
      { name: 'token comp/quote eth', testData: { id: jobID, data: { token: COMP, quote: 'ETH' } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 200)
          assert.equal(data.jobRunID, jobID)
          assert.isNotEmpty(data.data)
          assert.isAbove(Number(data.result), 0)
          assert.isAbove(Number(data.data.result), 0)
          done()
        })
      })
    })
  })

  context('error calls', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
      { name: 'token not supplied', testData: { id: jobID, data: { quote: 'ETH' } } },
      { name: 'quote not supplied', testData: { id: jobID, data: { token: COMP } } },
      { name: 'unknown base', testData: { id: jobID, data: { token: 'not_real', quote: 'USD' } } },
      { name: 'unknown quote', testData: { id: jobID, data: { token: COMP, quote: 'not_real' } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 500)
          assert.equal(data.jobRunID, jobID)
          assert.equal(data.status, 'errored')
          assert.isNotEmpty(data.error)
          done()
        })
      })
    })
  })
})
