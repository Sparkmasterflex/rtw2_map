(function() {
  var __slice = Array.prototype.slice;

  define(['jquery', 'underscore', 'backbone', 'html2canvas', 'models/map', 'models/user', 'views/users/sidebar', 'hbars!templates/maps/map'], function($, _, Backbone, html2canvas, Map, User, Sidebar, newMap) {
    var NewMap;
    NewMap = Backbone.View.extend({
      el: "#content section",
      events: {
        "click area.region": "highlight_region",
        "click a.screen-shot": "take_screen_shot",
        "click a.save-progress": "save_and_generate_link"
      },
      initialize: function(options) {
        _.bindAll(this, 'render');
        return this.user = new User({
          name: "Keith Raymond",
          turn: 1,
          empire: 'carthage',
          humanized_empire: 'Carthage',
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
      update_empire_data: function(region, add) {
        var current_data, current_emp, i;
        current_emp = this.selected.title.toLowerCase();
        current_data = this.empire_information[current_emp];
        i = _.indexOf(current_data.regions, region);
        if (i >= 0) {
          return current_data.regions.splice(i, 1);
        } else {
          return current_data.regions.push(region);
        }
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
        this.update_empire_data($area.attr('id'), !data.fillColor);
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
      },
      take_screen_shot: function(e) {
        var _this = this;
        html2canvas(this.$('#map > div'), {
          onrendered: function(canvas) {
            var ctx, dataURL, extra_canvas, filename;
            $(e.target).replaceWith("<a href='#download_image' class='download-image'>Download Image</a>");
            filename = "" + (_this.user.get('name')) + "_" + (_this.user.get('empire')) + ".png";
            extra_canvas = document.createElement("canvas");
            extra_canvas.setAttribute('width', 828);
            extra_canvas.setAttribute('height', 681);
            ctx = extra_canvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 828, 681);
            dataURL = extra_canvas.toDataURL();
            return $('a.download-image').attr({
              href: dataURL,
              download: filename.replace(/\s/, '_')
            });
          }
        });
        return false;
      },
      save_and_generate_link: function(e) {
        var d, filename, timestamp, user_json;
        d = new Date();
        timestamp = "" + (d.getFullYear()) + (d.getMonth()) + (d.getDate()) + (d.getTime());
        filename = "" + (this.user.get('name').replace(/\s/, '_')) + "_" + (this.user.get('empire')) + "_" + timestamp + ".json";
        user_json = {
          user: this.user.toJSON(),
          factions: this.empire_information
        };
        $.ajax({
          url: '/share_map.php',
          type: 'POST',
          dataType: 'json',
          data: {
            content: JSON.stringify(user_json),
            filename: filename
          },
          success: function(response) {
            var url;
            return url = "http://totalwar.ifkeithraymond.com/%23maps/" + (filename.replace(/\.json$/, ''));
          },
          error: function() {
            var err, other, response;
            response = arguments[0], err = arguments[1], other = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
            return $(e.target).hide().after("<p>Something went wrong :(</p>");
          }
        });
        return false;
      }
    });
    return NewMap;
  });

}).call(this);
