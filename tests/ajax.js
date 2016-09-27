"use strict";

const ajax = require('../lib/ajax');
const expect = require('chai').expect;
const http = require('http');
const url = require('url');
const promise = require('../lib/promise');
const task = require('../lib/task');
const YAML = require('yamljs');
const XML = require('xml-js');
const randomPort = promise.fromNode(cb =>
   require('random-port')(port => cb(null, port)));

const server = http.createServer((req, res) => {
  const uri = url.parse(req.url, true);
  const contentType = req.headers['Content-Type'];
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
        console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBB', result);
        console.log('AAAAAAAAAAAAAAAAAAA', XML.js2xml(result, {compact: true}), '"');
        result = XML.json2xml(result);
        responseHeader['Content-Type'] = 'application/xml';
        break;
    }

    res.writeHead(200, responseHeader);
    res.end(result);
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

      //expect(res).to.be.deep.equal({value: 16});
    }).then(() => done()).catch(done);
  });
});
