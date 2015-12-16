#!/usr/local/bin/node

var P = require('bluebird');
var request = P.promisifyAll(require('request'));
var cheerio = P.promisifyAll(require('cheerio'));
var fs = P.promisifyAll(require('fs'));

var expandHomeDir = require('expand-home-dir');

function listQuestions() {
  return request.getAsync('https://leetcode.com/problemset/algorithms');
}

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

function processName(name) {
  return name.split(' ').map(function(el) {
    return el.capitalizeFirstLetter();
  }).join('');
}

function parseQuestions(res) {
  var $ = cheerio.load(res.body);
  var questions = {};
  $('#problemList tr').each(function() {

    var children = $(this).children();
    var number = $(children[1]).text().trim();
    var name = $(children[2]).text().trim();
    var difficulty = $(children[4]).text().trim();

    questions[processName(name)] = {
      number: number,
      difficulty: difficulty
    };

  });
  return questions;
}

function readLeetCodedir() {
  return fs.readdirAsync(expandHomeDir('~/Desktop/LeetCode/'))
    .then(removeHiddenFiles);
}

function removeHiddenFiles(files) {
  if (files) {
    return files.filter(function(el) {
      return el && el.charAt(0) !== '.';
    });
  }
}

function removeSolvedQuestions(data) {
  leetCodeQuestions = data[0];
  solvedQuestions = data[1];
  for (var i = 0; i < solvedQuestions.length; i++) {
    var q = solvedQuestions[i];
    if (leetCodeQuestions[q]) {
      delete leetCodeQuestions[q];
    }
  }
  return leetCodeQuestions;
}

P.all([
    listQuestions().then(parseQuestions),
    readLeetCodedir().then(removeHiddenFiles)
  ])
  .then(removeSolvedQuestions)
  .then(console.log);
