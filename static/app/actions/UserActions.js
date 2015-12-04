const Dispatcher = require('../dispatcher/Dispatcher');
const Constants = require('../constants/Constants');

var UserActions = {
  /**
   * @param  {object} data
   */
  login: function (data) {
    Dispatcher.dispatch({
      actionType: Constants.USER_LOGIN,
      data: data
    });
  },

  logout: function () {
    Dispatcher.dispatch({
      actionType: Constants.USER_LOGOUT,
    });
  },

  /**
   * @param  {object} data
   */
  signup: function (data) {
    Dispatcher.dispatch({
      actionType: Constants.USER_SIGNUP,
      data: data
    });
  },

  /**
   * @param  {string} id The ID of the Supplier item
   * @param  {object} data
   */
  update: function (id, data) {
    Dispatcher.dispatch({
      actionType: Constants.USER_UPDATE,
      id: id,
      data: data
    });
  },
};

module.exports = UserActions;
