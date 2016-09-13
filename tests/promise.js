"use strict";

const promise = require('../lib/promise');
const expect = require('chai').expect;

function add_node(x, y, cb) {
  cb(null, x + y);
}

function do_throw(str, cb) {
  throw new Error(str);
}

function do_fail(str, cb) {
  cb(str);
}

const self = {data: 5222};

function check_this(cb) {
  expect(self).to.satisfy(s => s == self);
  cb();
}

describe('XCanePromise', () => {
  describe('#fromNode()', () => {
    it('should correctly return result', done => {
      let p = promise.fromNode(add_node);

      p(5, 12)
        .then(res => {
          expect(res).to.equal(17);
          done();
        }).catch(done);
    });

    it('should fail with throw', done => {
      let p = promise.fromNode(do_throw);

      p('to fail')
        .then(() => done('it should have failed'))
        .catch(err => {
          expect(err.message).to.equal('to fail');
          done();
        });
    });

    it('should fail with reject', done => {
      let p = promise.fromNode(do_fail);

      p('to fail')
        .then(() => done('it should have failed'))
        .catch(err => {
          expect(err).to.equal('to fail');
          done();
        })
        .catch(done);
    });

    it('should bind this correctly', done => {
      let p = promise.fromNode(check_this);

      p.call(self)
        .then(() => done())
        .catch(done);
    });
  });
});
