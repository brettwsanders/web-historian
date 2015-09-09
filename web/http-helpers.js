var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

var _ = require('underscore');
exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  if(asset === '/') asset = '/index.html';

  var parsedPath = path.parse(asset);
  var isPublicAsset = exports.checkIfPublicAsset(parsedPath);

  if (isPublicAsset){
    fs.readFile(__dirname + '/public' + asset, function(err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading public asset');
      } else {
        res.writeHead(200);
        res.end(data);
        if(callback)
          callback(data);
      }
    })
  } else {
    //return site
    fs.readFile(__dirname + '/../test/testdata/sites' + asset, function(err, data) {
      if (err) {
        res.writeHead(404);
        return res.end("Error file doesn't exist");
      } else {
        res.writeHead(200);
        res.end(data);
        if(callback)
          callback(data);
      }
    })
  }
};

exports.checkIfPublicAsset = function(parsedPath) {
  var extensionsWhenTrue = ['.html', '.css', '.js', '.jpeg', '.jpg', '.png', '.gif'];
  return _.contains(extensionsWhenTrue, parsedPath.ext);
};

  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

// As you progress, keep thinking about what helper functions you can put here!

exports.handlePostRequest = function(req, res) {
  var data = '';
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    var url = data.toString().substring(4);
    
    console.log('url ' + url);
    archive.isUrlArchived(url, function(archiveExists){
      console.log('archive exists :',archiveExists);
      if(archiveExists){
        res.writeHead(302, {
          'Location': '127.0.0.1:8080/' + url
          //add other headers here...
        });
        res.end();
      } else {
        archive.isUrlInList(url, function(is) {
          console.log('is:', is);
          if (!is){
            archive.addUrlToList(url, function() {
              console.log(url + 'added to list')
              res.writeHead(302, {
                'Location': '127.0.0.1:8080/loading.html'
                //add other headers here...
              });
              res.end();
            });
          }
        });
      }
    });  
  });
};