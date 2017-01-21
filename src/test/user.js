/* globals app, UserModel */

import {expect} from 'chai';

let request;

let UserId;
describe('User', function() {
  before(function* () {
    yield app.started;
    request = require('supertest')(app.server);
  });

  describe('POST /users', function() {
    describe('Given valid parameters', function() {
      it('should create new user', function* () {
        let params = {
          username: 'imZEHH',
          email: 'zeh@supermail.com'
        };

        let result = yield request
          .post('/users')
          .send(params)
          .expect(201)
          .expect(res => {
            UserId = res.body.data._id;
            expect(res.body.data).to.has.property('_id');
          });

        let user = yield UserModel.findById(result.body.data._id);
        expect(user).to.has.property('username', params.username);
        expect(user).to.has.property('email', params.email);
      });
    });
  });

  describe('GET /users/id', function() {
    describe('Given unique _id', function() {
      it('should fetch specific user base on _id', function* () {
        yield request
          .get('/users/' + UserId)
          .send()
          .expect(200)
          .expect(res => {
            expect(res.body.username).to.deep.equal('imZEHH');
            expect(res.body.email).to.deep.equal('zeh@supermail.com');
          });
      });
    });
  });

  describe('GET /users', function() {
    describe('Fetch all Users from the storage', function() {
      it('should fetch all users', function* () {
        yield request
          .get('/users')
          .send()
          .expect(200);
      });
    });
  });

  describe('DELETE /users/id', function() {
    describe('Given unique _id', function() {
      it('should delete specific user base on _id', function* () {
        yield request
          .delete('/users/' + UserId)
          .send()
          .expect(200)
          .expect(res => {
            expect(res.body.message).to.deep.equal('User successfully deleted');
          });
      });
    });
  });

  describe('GET /users/id', function() {
    describe('Verify if the user still exist', function() {
      it('should check the object is equal to {}', function* () {
        yield request
          .get('/users/' + UserId)
          .send()
          .expect(200)
          .expect(res => {
            expect(res.body).to.deep.equal({});
          });
      });
    });
  });
});
