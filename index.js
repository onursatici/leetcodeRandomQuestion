#!/usr/local/bin/node

var P = require('bluebird');
var request = P.promisifyAll(require('request'));
var cheerio = P.promisifyAll(require('cheerio'));

function listQuestions() {
  return request.getAsync('https://leetcode.com/problemset/algorithms');
}
function parseQuestions(res){
  var $ = cheerio.load(res.body);
  var questions = {};
  $('#problemList tr').each(function(){

    var children = $(this).children();
    var number = $(children[1]).text().trim();
    var name = $(children[2]).text().trim();
    var difficulty = $(children[4]).text().trim();

    questions[name.replace(/ /g,'').toLowerCase()] = {
      number: number,
      difficulty: difficulty
    };

  });
  return new P(function(resolve,reject){
    resolve(questions);
  });
}
//TODO add check to folder names to see which questions are already done
//TODO promisify child process and create the folder structure for the selected question

listQuestions()
  .then(parseQuestions)
  .then(console.log);

