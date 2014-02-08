(function() {

  define(['jquery', 'underscore', 'backbone', 'html2canvas', 'models/map', 'models/user', 'views/users/sidebar', 'hbars!templates/maps/map'], function($, _, Backbone, html2canvas, Map, User, Sidebar, newMap) {
    var NewMap;
    NewMap = Backbone.View.extend({
      el: "#content section",
      events: {
        "click area.region": "highlight_region"
      },
      initialize: function(options) {
        _.bindAll(this, 'render');
        return this.user = options.user;
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
        return $.get("/javascripts/factions.json", function(data) {
          _this.empire_information = MapApp.development ? data : JSON.parse(data);
          _this.selected = _this.empire_information[_this.user.get('empire')];
          return $.each(_this.empire_information, function(key, attrs) {
            var additional, region, _i, _len, _ref;
            additional = {
              empire: key,
              color: attrs.color,
              border: attrs.border,
              playable: attrs.playable,
              current: attrs === _this.selected
            };
            _ref = attrs.regions;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              region = _ref[_i];
              _this.color_settlements(region, additional);
            }
            return _this.previous = _this.selected;
          });
        });
      }
    });
    return NewMap;
  });

}).call(this);
