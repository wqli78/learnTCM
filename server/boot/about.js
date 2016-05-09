import dedent from 'dedent';
import moment from 'moment';

import { observeMethod } from '../utils/rx';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function about(app) {
  const router = app.loopback.Router();
  const User = app.models.User;
  const userCount$ = observeMethod(User, 'count');

  function showAbout(req, res, next) {
    const daysRunning = moment().diff(new Date('1/15/2016'), 'days');

    userCount$()
      .map(camperCount => numberWithCommas(camperCount))
      .doOnNext(camperCount => {
        res.render('resources/about', {
          camperCount,
          daysRunning,
          title: dedent`
            关于莲池学堂以及如何联系我们`.split('\n').join(' '),
          globalCompletedCount: numberWithCommas(
            1000 + (Math.floor((Date.now() - 1446268581061) / 1800))
          )
        });
      })
      .subscribe(() => {}, next);
  }

  router.get('/about', showAbout);
  app.use(router);
}
