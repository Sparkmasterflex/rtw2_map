(function() {

  define(['jquery', 'underscore', 'backbone', 'models/map', 'hbars!templates/maps/recent_map'], function($, _, Backbone, Map, recentMap) {
    var RecentMap;
    RecentMap = Backbone.View.extend({
      tagName: 'tr',
      initialize: function() {
        return _.bindAll(this, 'render');
      },
      render: function() {
        this.$el.html(recentMap(this.model));
        return this;
      }
    });
    return RecentMap;
  });

}).call(this);
