const Dispatcher = require('../dispatcher/Dispatcher');
const Constants = require('../constants/Constants');

module.exports = {
  /**
   * @param  {object} data
   */
  create: function (data) {
    Dispatcher.dispatch({
      actionType: Constants.HISTORY_CREATE,
      data
    });
  }
};
