#!/usr/local/bin/node

var P = require('bluebird');
var request = P.promisifyAll(require('request'));
var cheerio = P.promisifyAll(require('cheerio'));
var $;

function listQuestions() {
  return request.getAsync('https://leetcode.com/problemset/algorithms');
}
function parseQuestions(res){
  $ = cheerio.load(res.body);
  console.log($('#problemList').html());
}

listQuestions()
  .then(parseQuestions);

