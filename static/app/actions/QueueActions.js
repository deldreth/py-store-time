const Dispatcher = require('../dispatcher/Dispatcher');
const Constants = require('../constants/Constants');

module.exports = {
  /**
   * @param  {object} data
   */
  create: function () {
    Dispatcher.dispatch({
      actionType: Constants.QUEUE_CREATE
    });
  },

  update: function (data) {
    Dispatcher.dispatch({
      actionType: Constants.QUEUE_UPDATE,
      data
    })
  }

};
