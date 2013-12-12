(function() {

  define(['jquery', 'underscore', 'backbone', 'models/map', 'models/user', 'views/users/sidebar', 'hbars!templates/maps/map'], function($, _, Backbone, Map, User, Sidebar, newMap) {
    var NewMap;
    NewMap = Backbone.View.extend({
      el: "#content section",
      events: {
        "click area.region": "highlight_region"
      },
      initialize: function(options) {
        _.bindAll(this, 'render');
        return this.user = new User({
          name: "Keith Raymond",
          turn: 1,
          empire: 'carthage',
          regions: 4
        });
      },
      render: function() {
        var _this = this;
        this.$el.html(newMap(this));
        $.when(this.prepare_map()).then(function() {
          return _this.render_sidebar();
        });
        return this;
      },
      prepare_map: function() {
        var _this = this;
        this.$('#map_image').maphilight();
        return $.get("/javascripts/factions.json", function(data) {
          _this.empire_information = data;
          _this.selected = _this.empire_information[_this.user.get('empire')];
          return $.each(_this.empire_information, function(key, attrs) {
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
        if (additional.border != null) data.strokeColor = additional.border;
        data.alwaysOn = true;
        return $area.data('maphilight', data).trigger('alwaysOn.maphilight');
      },
      /*=============================
                  EVENTS
      =============================
      */
      highlight_region: function(e) {
        var $area, data;
        $area = $(e.target);
        data = $area.data('maphilight') || {};
        if (!((data.fillColor != null) && data.fillColor !== this.selected.color)) {
          this.sidebar.add_remove_region($area.attr('id'));
        }
        if (data.fillColor) {
          delete data.fillColor;
          delete data.strokeColor;
          data.alwaysOn = false;
        } else {
          data.fillColor = this.selected.color;
          data.strokeColor = this.selected.border;
          data.alwaysOn = true;
        }
        return $area.data('maphilight', data).trigger('alwaysOn.maphilight');
      }
    });
    return NewMap;
  });

}).call(this);
