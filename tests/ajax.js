"use strict";

const ajax = require('../lib/ajax');
const expect = require('chai').expect;
const http = require('http');
const url = require('url');
const promise = require('../lib/promise');
const task = require('../lib/task');
const YAML = require('yamljs');
const XML = require('../lib/xml');
const type = require('../lib/type');
const iterable = require('../lib/iterable');
const randomPort = promise.fromNode(cb =>
   require('random-port')(port => cb(null, port)));

const server = http.createServer((req, res) => {
  const uri = url.parse(req.url, true);
  const contentType = req.headers['content-type'];
  const path = uri.pathname;
  const query = uri.query;
  const method = req.method;

  if (path === '/add') {
    let result = {value: Number(query.x) + Number(query.y)};
    let responseHeader = {};

    switch (query.type) {
      default:
      case 'json':
        result = JSON.stringify(result);
        responseHeader['Content-Type'] = 'application/json';
        break;
      case 'yaml':
        result = YAML.stringify(result);
        responseHeader['Content-Type'] = 'text/yaml';
        break;
      case 'xml':
        result = XML.stringify(result);
        responseHeader['Content-Type'] = 'application/xml';
        break;
    }

    res.writeHead(200, responseHeader);
    res.end(result);
  } else if (path === '/mul') {
    if (method !== 'POST') {
      res.writeHead(405, {'Content-Type': 'text/plain'});
      res.end('ooops! method not allowed');
    } else {
      let payload = '';

      req.on('readable', () => {
        const part = req.read();

        if (type.isString(part)) {
          payload += part;
        } else if (type.isBuffer(part)) {
          payload += part.toString('utf8');
        }
      });

      req.on('end', () => {
        switch (contentType) {
          case 'application/json':
            payload = JSON.parse(payload);
            break;

          case 'text/yaml':
            payload = YAML.parse(payload);
            break;

          case 'application/xml':
            payload = XML.parse(payload).root;
            break;

          default:
            res.writeHead(415, {'Content-Type': 'text/plain'});
            res.end(`ooops! can not parse payload of type ${contentType}!`);
        }


        if (!type.isString(payload) && !type.isOptional(payload)) {
          let result = {value: payload.x * payload.y};
          let responseHeader = {};

          switch (contentType) {
            default:
            case 'application/json':
              result = JSON.stringify(result);
              responseHeader['Content-Type'] = 'application/json';
              break;
            case 'text/yaml':
              result = YAML.stringify(result);
              responseHeader['Content-Type'] = 'text/yaml';
              break;
            case 'application/xml':
              result = XML.stringify(result);
              responseHeader['Content-Type'] = 'application/xml';
              break;
          }

          res.writeHead(200, responseHeader);
          res.end(result);
        }
      });
    }
  } else if (path === '/div') {
    if (method !== 'POST' || contentType !== 'application/x-www-form-urlencoded') {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('oops!');
    } else {
      let payload = '';

      req.on('readable', () => {
        const part = req.read();

        if (type.isString(part)) {
          payload += part;
        } else if (type.isBuffer(part)) {
          payload += part.toString('utf8');
        }
      });

      req.on('end', () => {
        const form = payload.split('&').reduce((p, v) => Object.assign(
          p, {[v.split('=', 2)[0]]: v.split('=', 2)[1]}), {});

        res.writeHead(200, {'Content-Type': 'text/yaml'});
        res.end(YAML.stringify({
          value: Number(form.x) / Number(form.y)
        }));
      });
    }
  } else if (path === '/save') {
    console.log('HELLOOOOOOOOOOOOOOOOO FROM SAVE!', contentType);

    if (method !== 'POST' || contentType.indexOf('multipart/form-data') !== 0) {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('oops!');
    } else {
      let payload = '';
      let boundary = iterable.from(contentType.split(';'))
        .skip(1)
        .select(v => v.split('=', 2))
        .where(v => v[0].trim() === 'boundary')
        .select(v => v[1])
        .first();

      req.on('readable', () => {
        const part = req.read();

        if (type.isString(part)) {
          payload += part;
        } else if (type.isBuffer(part)) {
          payload += part.toString('utf8');
        }
      });

      req.on('end', () => {
        expect(payload).to.be.equal(`--${boundary}\r\nContent-Disposition:` +
          ` form-data; name="myFile"; filename="test.txt"\r\n` +
          `Content-Type: text/plain\r\n\r\nhello\r\n--${boundary}--\r\n`);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('ok');
      });
    }
  } else if (path === '/hello') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, World!');
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('ooops! not found!');
  }
});

describe('XCaneAjax', () => {
  let serverPort;

  before(done => {
    randomPort().then(port => {
      serverPort = port;
      server.listen(serverPort, done);
    });
  });

  after(done => {
    server.close();
    done();
  });

  it('should call /hello', done => {
    task.spawn(function* () {
      let res =
        yield ajax.request(`http://localhost:${serverPort}/hello`);

      expect(res).to.be.equal('Hello, World!');
    }).then(() => done()).catch(done);
  });

  it('should call /add with data:json', done => {
    task.spawn(function* () {
      let res =
        yield ajax.request({
          url: `http://localhost:${serverPort}/add`,
          data: {
            x: 5,
            y: 10,
            type: 'json'
          }
        });

      expect(res).to.be.deep.equal({value: 15});
    }).then(() => done()).catch(done);
  });

  it('should call /add with data:yaml', done => {
    task.spawn(function* () {
      let res =
        yield ajax.request({
          url: `http://localhost:${serverPort}/add`,
          data: {
            x: 6,
            y: 10,
            type: 'yaml'
          }
        });

      expect(res).to.be.deep.equal({value: 16});
    }).then(() => done()).catch(done);
  });

  it('should call /add with data:xml', done => {
    task.spawn(function* () {
      let res =
        yield ajax.request({
          url: `http://localhost:${serverPort}/add`,
          data: {
            x: 6,
            y: 10,
            type: 'xml'
          }
        });

      expect(res).to.be.deep.equal({value: 16});
    }).then(() => done()).catch(done);
  });

  it('should receive 405 on /mul with method GET', done => {
    task.spawn(function* () {
      try {
        yield ajax.request(`http://localhost:${serverPort}/mul`);
      } catch (err) {
        expect(err).to.be.an.instanceof(ajax.HttpError);
        expect(err.statusCode).to.be.equal(405);
        expect(err.body).to.be.equal('ooops! method not allowed');
      }
    }).then(() => done()).catch(done);
  });

  it('should receive 415 on /mul with incompatible mime type', done => {
    task.spawn(function* () {
      try {
        yield ajax.request({
          url: `http://localhost:${serverPort}/mul`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/pdf'
          }
        });
      } catch (err) {
        expect(err).to.be.an.instanceof(ajax.HttpError);
        expect(err.statusCode).to.be.equal(415);
        expect(err.body).to.be.equal(
          'ooops! can not parse payload of type application/pdf!');
        expect(err.body).to.be.equal(
          'ooops! can not parse payload of type application/pdf!');
        expect(err.message).to.be.equal(
          'AJAX failed with status code 415 - ooops! can not parse payload of type application/pdf!');
      }
    }).then(() => done()).catch(done);
  });

  it('should receive 200 on /mul with data:json', done => {
    task.spawn(function* () {
      let res = yield ajax.request({
        url: `http://localhost:${serverPort}/mul`,
        method: 'POST',
        data: {
          x: 4,
          y: 5
        },
        resolveWithFullResponse: true
      });

      expect(res.headers['content-type']).to.be.equal('application/json');
      expect(res.body.value).to.be.equal(20);
    }).then(() => done()).catch(done);
  });

  it('should receive 200 on /mul with data:yaml', done => {
    task.spawn(function* () {
      let res = yield ajax.request({
        url: `http://localhost:${serverPort}/mul`,
        method: 'POST',
        data: {
          x: 7,
          y: 5
        },
        yaml: true,
        resolveWithFullResponse: true
      });

      expect(res.headers['content-type']).to.be.equal('text/yaml');
      expect(res.body.value).to.be.equal(35);
    }).then(() => done()).catch(done);
  });

  it('should receive 200 on /mul with data:xml', done => {
    task.spawn(function* () {
      let res = yield ajax.request({
        url: `http://localhost:${serverPort}/mul`,
        method: 'POST',
        data: {
          root: {
            x: 7,
            y: 5
          }
        },
        xml: true,
        resolveWithFullResponse: true
      });

      expect(res.headers['content-type']).to.be.equal('application/xml');
      expect(res.body.value).to.be.equal(35);
    }).then(() => done()).catch(done);
  });

  it('should call div with form data', done => {
    task.spawn(function* () {
      let res = yield ajax.request({
        url: `http://localhost:${serverPort}/div`,
        method: 'POST',
        data: {
          x: 21,
          y: 3
        },
        form: true
      });

      expect(res.value).to.be.equal(7);
    }).then(() => done()).catch(done);
  });

  it('should call save with multipart form upload', done => {
    task.spawn(function* () {
      let res = yield ajax.request({
        url: `http://localhost:${serverPort}/save`,
        method: 'POST',
        data: {
          myFile: {
            value: new Buffer('hello', 'utf8'),
            options: {
              filename: 'test.txt',
              contentType: 'text/plain'
            }
          }
        },
        multipart: true
      });

      expect(res).to.be.equal('ok');
    }).then(() => done()).catch(done);
  });
});
