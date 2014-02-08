(function() {

  define(['jquery', 'underscore', 'backbone', 'views/users/sidebar'], function($, _, Backbone, Sidebar) {
    var MapView;
    MapView = {
      minor: {
        fill: 0.25,
        stroke: 0.5
      },
      major: {
        fill: 0.4,
        stroke: 0.7
      },
      current: {
        fill: 0.75,
        stroke: 1
      },
      render_sidebar: function(options) {
        this.sidebar = new Sidebar({
          model: this.user,
          empire_data: this.empire_information,
          empire: this.user.get('empire'),
          parent: options.parent,
          allow_edit: options.allow_edit,
          update_turn: options.update_turn
        });
        return this.$('#map_container').prepend(this.sidebar.render().el);
      },
      color_settlements: function(region, additional) {
        var $area, data;
        $area = this.$("area#" + region);
        data = $area.data('maphilight') || {};
        data.fillColor = additional.color;
        if (additional.border != null) data.strokeColor = additional.border;
        if (additional.current) {
          data.fillOpacity = this.current.fill;
          data.strokeOpacity = this.current.stroke;
        } else if (!additional.playable) {
          data.fillOpacity = this.minor.fill;
          data.strokeOpacity = this.minor.stroke;
        }
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
      highlight_selected_regions: function(prev) {
        var region, _i, _j, _len, _len2, _ref, _ref2, _results;
        _ref = this.selected.regions;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          region = _ref[_i];
          this.brighten_highlight(region);
        }
        if (prev != null) this.previous = prev;
        _ref2 = this.previous.regions;
        _results = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          region = _ref2[_j];
          _results.push(this.dim_highlight(region));
        }
        return _results;
      },
      dim_highlight: function(region) {
        var data;
        data = $("#" + region).data('maphilight') || {};
        data.fillOpacity = this.previous.playable ? this.major.fill : this.minor.fill;
        data.strokeOpacity = this.previous.playable ? this.major.stroke : this.minor.stroke;
        return $("#" + region).data('maphilight', data).trigger('alwaysOn.maphilight');
      },
      brighten_highlight: function(region) {
        var data;
        data = $("#" + region).data('maphilight') || {};
        data.fillOpacity = this.current.fill;
        data.strokeOpacity = this.current.stroke;
        return $("#" + region).data('maphilight', data).trigger('alwaysOn.maphilight');
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
          data.fillOpacity = this.current.fill;
          data.strokeOpacity = this.current.stroke;
          data.fillColor = this.selected.color;
          data.strokeColor = this.selected.border;
          data.alwaysOn = true;
        }
        return $area.data('maphilight', data).trigger('alwaysOn.maphilight');
      }
    };
    return MapView;
  });

}).call(this);
