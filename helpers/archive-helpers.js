var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var http = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {
  fs.readFile(__dirname + '/../test/testdata/sites.txt', function(err, data) {
    console.log(data.toString());
    var urlArray;
    if(data.toString())
      urlArray = data.toString().split('\n');
    else
      urlArray = [];
    cb(urlArray);
  });
};

exports.isUrlInList = function(url, cb) {
  exports.readListOfUrls(function(urlArray) {
    console.log(urlArray);
    var contains = urlArray.indexOf(url) === -1? false: true;
    cb(contains);
  });
};

exports.addUrlToList = function(url, cb) {
  fs.appendFile(__dirname + '/../test/testdata/sites.txt', url + '\n', 
    function (err) {
      if(err){
        console.log('Failed to write to sites.txt');
        throw err;
      }
      console.log('Write success');
      cb();
    });
};

exports.isUrlArchived = function(url, cb) {
  fs.readdir(__dirname + '/../test/testdata/sites', function(err, files) {
    if (err) {
      console.log('Directory not found');
      throw err;
    } else {
      var contains = files.indexOf(url) === -1? false: true;
      cb(contains);
    }
  });
};

exports.downloadUrls = function(urlArray) {
  _.each(urlArray, function(url) {
    var filepath = __dirname + '/../test/testdata/sites/' + url;
    console.log('http://' + url)
    http.get({
      url:  'http://' + url,
      progress: function (current, total) {
        console.log('downloaded %d bytes from %d', current, total);
      }
    }, filepath, 
    function (err, res) {
      if (err) {
        console.error(err);
        return;
      }
      //console.log(res.code, res.headers, res.file);
    }); 
  });
  fs.writeFile(__dirname + '/../test/testdata/sites.txt', '', 
    function (err) {
      if(err){
        console.log('Failed to write to sites.txt');
        throw err;
      }
      console.log('Write success');
    });
};
