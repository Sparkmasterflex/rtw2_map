(function() {
  define(['jquery', 'underscore', 'backbone', 'maphilight', 'router'], function($, _, backbone, maphilight, Router) {
    var initialize;
    initialize = function() {
      return this.router = new Router();
    };
    return {
      initialize: initialize
    };
  });

}).call(this);
