import { defaultProfileImage } from '../../common/utils/constantStrings.json';
import { ObjectID } from 'mongodb';

const message =
  '免费学习传统文化';

module.exports = function(app) {
  var router = app.loopback.Router();
  router.get('/', addDefaultImage, index);
  
  
  //lwq添加获得mongoid的方法：
  
  router.get('/mid', showMid);
  router.get('/lwqupdate', lwqupdate);
  
  
  
  

  app.use(router);

  function addDefaultImage(req, res, next) {
    if (!req.user || req.user.picture) {
      return next();
    }
    req.user.picture = defaultProfileImage;
    return req.user.save(function(err) {
      if (err) { return next(err); }
      return next();
    });
  }

  function index(req, res) {
    if (req.user) {
      return res.redirect('/challenges/current-challenge');
    }
    return res.render('home', { title: message });
  }
  
  
  function showMid(req,res){
    // var ObjectID = require('mongodb').ObjectID;
      // test = require('assert');
    // Create a new ObjectID
    var objectId = new ObjectID();
    // Create a new ObjectID Based on the first ObjectID
    // var objectId2 = new ObjectID(objectId.id);
    let mid = objectId;
    
    res.send(mid);
  }
  
  function lwqupdate(req,res) {
    var exec = require('child_process').exec;
    var last = exec('/root/leartcm_update.sh'); 
    last.stdout.on('data', function (data) { 
    console.log('标准输出：' + data); 
    }); 
    last.on('exit', function (code) { 
    console.log('子进程已关闭，代码：' + code); 
    }); 
    res.send('ok');
  }
  
};
