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
          _this.empire_information = MapApp.development ? data : JSON.parse(data);
          _this.selected = _this.empire_information[_this.user.get('empire')];
          return $.each(_this.empire_information, function(key, attrs) {
            var additional, region, _i, _len, _ref, _results;
            additional = {
              empire: key,
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
          parent: this,
          allow_edit: true
        });
        return this.$('#map_container').prepend(this.sidebar.render().el);
      },
      color_settlements: function(region, additional) {
        var $area, data;
        $area = this.$("area#" + region);
        data = $area.data('maphilight') || {};
        data.fillColor = additional.color;
        if (additional.border != null) data.strokeColor = additional.border;
        data.alwaysOn = true;
        $area.data('empire', additional.empire).data('maphilight', data).trigger('alwaysOn.maphilight');
        return $area.attr('title', "" + additional.empire + ": " + ($area.attr('title')));
      },
      update_empire_data: function(region, prev_emp) {
        var empires,
          _this = this;
        empires = [this.selected.title.toLowerCase()];
        if (prev_emp != null) empires.push(prev_emp);
        return _.each(empires, function(emp) {
          var current_data, i;
          current_data = _this.empire_information[emp];
          i = _.indexOf(current_data.regions, region);
          if (i >= 0) {
            current_data.regions.splice(i, 1);
            return _this.$("area#" + region).removeAttr('data-empire');
          } else {
            current_data.regions.push(region);
            return _this.$("area#" + region).data('empire', emp);
          }
        });
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
        this.update_empire_data($area.attr('id'), $area.data('empire'));
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
