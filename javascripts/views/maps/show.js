(function() {
  define(['jquery', 'underscore', 'backbone', 'html2canvas', 'models/map', 'models/user', 'views/users/sidebar', 'hbars!templates/maps/map'], function($, _, Backbone, html2canvas, Map, User, Sidebar, showMap) {
    var ShowMap;
    return ShowMap = Backbone.View.extend({
      el: "#content section",
      initialize: function(options) {
        _.bindAll(this, 'render');
        this.user = options.user;
        this.user.set('allow_edit', false);
        return this.empire_information = options.empire_information;
      },
      render: function() {
        var _this = this;
        this.$el.html(showMap(this));
        $.when(this.prepare_map()).then(function() {
          return _this.render_sidebar();
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
      },
      render_sidebar: function() {
        this.sidebar = new Sidebar({
          model: this.user,
          empire_data: this.empire_information,
          empire: this.user.get('empire'),
          parent: this
        });
        return this.$('#map_container').append(this.sidebar.render().el);
      },
      color_settlements: function(region, additional) {
        var $area, data;
        $area = this.$("area#" + region);
        data = $area.data('maphilight') || {};
        data.fillColor = additional.color;
        if (additional.border != null) {
          data.strokeColor = additional.border;
        }
        data.alwaysOn = true;
        return $area.data('maphilight', data).trigger('alwaysOn.maphilight');
      }
    });
  });

}).call(this);
