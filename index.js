const URI          = require('url');
const Async        = require('async');
const cheerio      = require('cheerio');
const EventEmitter = require('events');

class Crawler extends EventEmitter {
  constructor(options){
    super();
    Object.assign(this, {
      page: 1,
      concurrency: 5,
    }, options);
    this.queue = Async.queue(
      this.crawl.bind(this), this.concurrency);
    this.queue.drain = () => this.emit('end');
    return this;
  }
  start(url){
    this.push(url || this.url);
    return this;
  }
  push(url){
    this.queue.push(url, res => 
      this.emit('done', res));
    return this;
  }
  request(url, params){
    params = Object.assign({
      headers: {}
    }, URI.parse(url), params);
    const {
      body,
      headers,
      protocol,
    } = params;
    const contentType = headers['content-type'];
    return new Promise((resolve, reject) => {
      const { request } = require(protocol.slice(0,-1));
      const req = request(params, response => {
        const buffer = []; response
        .on('data', buffer.push.bind(buffer))
        .on('end', () => {
          response.data = Buffer.concat(buffer);
          response.blob = () => response.data
          response.text = () => response.data.toString();
          response.json = () => JSON.parse(response.text());
          resolve(response);
        })
        
      });
      if(body) req.write(body);
      req.end();
    });
  }
  parse($){
    const { url } = $;
    const title = $('head > title').text();
    return { title, url };
  }
  crawl(url, done){
    const { request, parse } = this;
    return request(url)
      .then(res => res.text())
      .then(html => cheerio.load(html))
      .then($ => parse($, x => this.emit('commit', x)))
      .then(done);
  }
}

module.exports = Crawler;