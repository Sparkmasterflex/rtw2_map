(function() {

  define(['jquery', 'underscore', 'backbone', 'html2canvas', 'models/map', 'models/user', 'views/maps/map_view', 'views/users/sidebar', 'hbars!templates/maps/map'], function($, _, Backbone, html2canvas, Map, User, MapView, Sidebar, newMap) {
    var EditMap;
    EditMap = Backbone.View.extend({
      el: "#content section",
      events: {
        "click area.region": "highlight_region"
      },
      initialize: function(options) {
        _.bindAll(this, 'render');
        this.user = options.user;
        return this.empire_information = options.empire_information;
      },
      render: function() {
        var options,
          _this = this;
        this.$el.html(newMap(this));
        options = {
          parent: this,
          allow_edit: true,
          update_turn: false
        };
        $.when(this.prepare_map()).then(function() {
          return _this.render_sidebar(options);
        });
        return this;
      },
      prepare_map: function() {
        var _this = this;
        this.$('#map_image').maphilight();
        this.selected = this.empire_information[this.user.get('empire')];
        return $.each(this.empire_information, function(key, attrs) {
          var additional, region, _i, _len, _ref, _results;
          additional = {
            color: attrs.color,
            border: attrs.border
          };
          _ref = attrs.regions;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            region = _ref[_i];
            _results.push(_this.color_settlements(region, additional));
          }
          return _results;
        });
      }
    });
    return EditMap;
  });

}).call(this);
