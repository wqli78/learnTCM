import { defaultProfileImage } from '../../common/utils/constantStrings.json';

const message =
  '免费学习传统文化';

module.exports = function(app) {
  var router = app.loopback.Router();
  router.get('/', addDefaultImage, index);

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
};
