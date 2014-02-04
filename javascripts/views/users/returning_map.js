(function() {

  define(['jquery', 'underscore', 'backbone', 'hbars!templates/users/returning_view'], function($, _, Backbone, ReturningView) {
    var ReturningMap;
    return ReturningMap = Backbone.View.extend({
      initialize: function() {
        return _.bindAll(this, 'render');
      },
      render: function() {
        this.$el.html(ReturningView(this.model));
        return this;
      }
    });
  });

}).call(this);
