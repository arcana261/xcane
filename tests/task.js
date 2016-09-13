"use strict";

const task = require('../lib/task');
const expect = require('chai').expect;

function add(x, y) {
  return Promise.resolve(x + y);
}

function mul(x, y) {
  return Promise.resolve(x * y);
}

function faulty(str) {
  return Promise.reject(str);
}

describe('XCaneTask', () => {
  describe('#fromPromise', () => {
    it('should execute simple task', done => {
      let t = task.fromPromise(function* (x, y) {
        return yield mul(yield add(x, y), 10);
      });

      t(5, 7).then(value => {
        expect(value).to.equal(120);
        done();
      }).catch(done);
    });

    it('should throw failure', done => {
      let t = task.fromPromise(function* (str) {
        try {
          return yield faulty(str);
        } catch (err) {
          expect(err).to.equal('to blame');
        }
      });

      t('to blame')
        .then(() => done())
        .catch(done);
    });

    it('should fail if exception not caught', done => {
      let t = task.fromPromise(function* (str) {
        return yield faulty(str);
      });

      t('to blame')
        .then(() => done('it should not had succeeded'))
        .catch(err => {
          expect(err).to.equal('to blame');
          done();
        }).catch(done);
    });

    it('should work if totally synchron', done => {
      let t = task.fromPromise(function* () {
        return 'a result';
      });

      t().then(res => {
        expect(res).to.equal('a result')
        done();
      }).catch(done);
    });

    it('should catch synchron exceptions', done => {
      let t = task.fromPromise(function* () {
        throw new Error('an error');
      });

      t().then(() => done('it should not had succeded'))
        .catch(err => {
          expect(err.message).to.equal('an error');
          done();
        }).catch(done);
    });

    it('should catch nested exceptions', done => {
      let t = task.fromPromise(function* () {
        try {
          yield faulty('to blame');
        } catch (err) {
          throw err;
        }
      });

      t()
        .then(() => done('it should not had succeeded'))
        .catch(err => {
          expect(err).to.equal('to blame');
          done();
        }).catch(done);
    });

    it('should be able to return value after catching exception', done => {
      let t = task.fromPromise(function* () {
        try {
          yield faulty('to blame');
        } catch (err) {
          expect(err).to.equal('to blame');
          return 'catch';
        }
      });

      t()
        .then(res => {
          expect(res).to.equal('catch');
          done();
        }).catch(done);
    });

    it('should be able to execute after catching exception', done => {
      let t = task.fromPromise(function* () {
        try {
          yield faulty('to blame');
        } catch (err) {
          expect(err).to.equal('to blame');
          return yield mul(yield add(5, 7), 10);
        }
      });

      t()
        .then(res => {
          expect(res).to.equal(120);
          done();
        }).catch(done);
    });
  });
});
