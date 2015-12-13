#!/usr/local/bin/node

var P = require('bluebird');
var request = require('bluebird').promisifyAll(require('request'));

var cookieJar = request.jar();

function fillFormData(res){
  var formData = {};
  formData.login = process.env.LEETCODENAME;
  formData.password = process.env.LEETCODEPASS;
  //TODO: fix the horrible code below
  formData.csrfmiddlewaretoken = cookieJar._jar.store.idx['leetcode.com']['/'].csrftoken.toString().split(';')[0].split('=')[1];
  return new P(function(resolve,reject){
    resolve(formData);
  });
}
function authenticate(formData){
  return request.postAsync({url:'https://leetcode.com/accounts/login',jar: cookieJar, form:formData});
}


request.getAsync({url:'https://leetcode.com',jar:cookieJar})
  .then(fillFormData)
  .then(authenticate)
  .then(console.log); //log response
