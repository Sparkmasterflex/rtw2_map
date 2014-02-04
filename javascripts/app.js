(function() {

  define(['jquery', 'underscore', 'backbone', 'maphilight', 'router'], function($, _, backbone, maphilight, Router) {
    var initialize;
    initialize = function() {
      if (window.location.host === 'rtw_map.dev') this.development = true;
      return this.router = new Router();
    };
    return {
      initialize: initialize
    };
  });

}).call(this);
