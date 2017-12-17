import moment from 'moment';

import consts from './consts';

function future (week) {
  const date = moment(week, consts.DATE_FORMAT)
    , now = moment()
    ;

  return (date > now);
}

function nearFuture (week) {
  const date = moment(week, consts.DATE_FORMAT)
    , now = moment()
    , tooFar = moment().add(1, 'week')
    ;

  return (date > now) && (date < tooFar);
}

function farFuture (week) {
  const date = moment(week, consts.DATE_FORMAT)
    , tooFar = moment().add(1, 'week')
    ;

  return (date > tooFar);
}

export default {
  farFuture,
  future,
  nearFuture,
};
