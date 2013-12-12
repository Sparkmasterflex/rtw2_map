(function() {

  define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var User;
    User = Backbone.Model.extend({
      defaults: {
        turn: 1,
        empire: 'rome',
        regions: 4
      },
      capitalize_empire: function() {
        return "" + (this.get('empire').charAt(0).toUpperCase()) + (this.get('empire').slice(1));
      }
    });
    return User;
  });

}).call(this);
