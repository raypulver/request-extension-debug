"use strict";
const RequestExtension = require('request-extension'),
  inspect = require('util').inspect,
  clone = require('clone');

function log(type, data, r, color) {
  var toLog = {};
  toLog[type] = data;
  console.error(inspect(toLog, {
    depth: null,
    colors: color
  }));
};

let debugId = 0;

module.exports = function(config) {
  config = config || {};
  if (typeof config.color === 'undefined') config.color = true;
  return RequestExtension({
    middleware: function(params, next) {
      if (params.debug && !this._debugId) {
        this.on('request', function(req) {
          var data = {
            debugId: this._debugId,
            uri: this.uri.href,
            method: this.method,
            headers: clone(this.headers)
          }
          if (this.body) {
            data.body = this.body.toString('utf8')
          }
          log('request', data, this, config.color);

        }).on('response', function(res) {
          if (this.callback) {
            // callback specified, request will buffer the body for
            // us, so wait until the complete event to do anything
          } else {
            // cannot get body since no callback specified
            log('response', {
              debugId: this._debugId,
              headers: clone(res.headers),
              statusCode: res.statusCode
            }, this, config.color);
          }

        }).on('complete', function(res, body) {
          if (this.callback) {
            log('response', {
              debugId: this._debugId,
              headers: clone(res.headers),
              statusCode: res.statusCode,
              body: res.body
            }, this, config.color);
          }

        }).on('redirect', function() {
          var type = (this.response.statusCode == 401 ? 'auth' : 'redirect')
          log(type, {
            debugId: this._debugId,
            statusCode: this.response.statusCode,
            headers: clone(this.response.headers),
            uri: this.uri.href
          }, this, config.color);
        });
        this._debugId = ++debugId;
      }
      next();
    }
  });
}
