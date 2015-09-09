var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var utils = require('./http-helpers');
var fs = require('fs');
var urlParser = require('url');

exports.handleRequest = function (req, res) {

  var parsedUrl = urlParser.parse(req.url);
  var pathname = parsedUrl.pathname;

  if (req.method === 'GET') {
    utils.serveAssets(res, pathname);
  } else if (req.method === 'POST') {
    console.log(pathname)
    utils.handlePostRequest(req, res)
  }
  //res.end(archive.paths.list);
};
