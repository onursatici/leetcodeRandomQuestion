#!/usr/local/bin/node

var request = require('request');
var cookieJar = request.jar();

request.get({url:'https://leetcode.com',jar: cookieJar},function(err,data){
      if(!err){
        var formData = {};
        formData.login = process.env.LEETCODENAME;
        formData.password = process.env.LEETCODEPASS;
        //TODO: fix the horrible code below
        formData.csrfmiddlewaretoken = cookieJar._jar.store.idx['leetcode.com']['/'].csrftoken.toString().split(';')[0].split('=')[1];

        request.post({url:'https://leetcode.com/accounts/login/', jar: cookieJar, form:formData},function(err,data){
            //TODO cannot login, solve why
              if(!err){
                request.get({url:'https://leetcode.com/problemset/algorithms',jar:cookieJar},function(err,data){
                      if(!err){
                      }
                    });
              }
            });
      }
    });
