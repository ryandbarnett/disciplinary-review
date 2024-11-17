// requestHelpers.js
const request = require('supertest');

const makeRequest = (app, method, endpoint, options = {}) => {
  const { token, payload } = options;
  const requestBuilder = request(app)[method](endpoint);

  if (token) requestBuilder.set('Authorization', `Bearer ${token}`);
  if (payload) requestBuilder.send(payload);

  return requestBuilder;
};

module.exports = {
  makeRequest,
};