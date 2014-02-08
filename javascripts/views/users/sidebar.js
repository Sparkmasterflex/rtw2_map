(function() {

  define(['jquery', 'underscore', 'backbone', 'hbars!templates/users/sidebar'], function($, _, Backbone, sidebar) {
    var Sidebar;
    Sidebar = Backbone.View.extend({
      tagName: 'aside',
      className: 'user-sidebar clearfix',
      events: {
        'change select#select-empire': 'select_current_empire',
        'change input.sidebar-input': 'update_user_turn',
        "click a.screen-shot": "take_screen_shot",
        "click a.save-progress": "save_progress",
        "click a.share": "save_progress"
      },
      region_count: 0,
      initialize: function(options) {
        _.bindAll(this, 'render', 'update_region_count');
        this.empire_data = options.empire_data;
        this.empire = options.empire;
        this.parent = options.parent;
        this.model.set({
          allow_edit: options.allow_edit,
          update_turn: options.update_turn
        });
        this.region_count = parseInt(this.model.get('regions'));
        return this.model.bind('change:regions', this.update_region_count);
      },
      render: function() {
        this.$el.html(sidebar(this.model.toJSON()));
        if (this.model.get('allow_edit') != null) this.setup_empire_select();
        this.append_controlled_regions();
        return this;
      },
      setup_empire_select: function() {
        var _this = this;
        return _.each(this.empire_data, function(value, key) {
          var $option;
          $option = $("<option value='" + key + "'>" + value.title + "</option>");
          if (key === _this.empire) $option.attr('selected', true);
          return _this.$('select#select-empire').append($option);
        });
      },
      append_controlled_regions: function() {
        var _this = this;
        this.$('.regions-list ul').empty();
        return $.each(this.empire_data[this.empire].regions, function(i, region) {
          return _this.add_remove_region(region);
        });
      },
      add_remove_region: function(region) {
        var $li;
        if (this.user_empire_region(region)) {
          $li = this.$(".regions-list li[data-region=" + region + "]");
          if ($li.length > 0) {
            if (!(this.$('.regions-list li').length < this.region_count)) {
              this.region_count -= 1;
            }
            $li.remove();
          } else {
            if (!(this.$('.regions-list li').length < this.region_count)) {
              this.region_count += 1;
            }
            this.$(".regions-list ul").prepend("<li data-region='" + region + "'>" + (this.humanize(region)) + "</li>");
          }
          return this.model.set({
            regions: this.region_count
          });
        }
      },
      user_empire_region: function(region) {
        if (this.model.get('allow_edit')) {
          return this.$('select#select-empire').val() === this.empire;
        } else {
          return _.indexOf(this.empire_data[this.empire].regions, region) >= 0;
        }
      },
      update_region_count: function() {
        return this.$('li.region-count').html("Total Regions: " + this.region_count);
      },
      humanize: function(string) {
        var arr, humanized,
          _this = this;
        humanized = "";
        arr = string.split('_');
        _.each(arr, function(str) {
          return humanized += "" + (str.charAt(0).toUpperCase()) + (str.slice(1)) + " ";
        });
        return humanized;
      },
      initial_save: function() {
        var d, timestamp;
        d = new Date();
        timestamp = "" + (d.getFullYear()) + (d.getMonth()) + (d.getDate()) + (d.getTime());
        this.model.set({
          file: "" + (this.model.get('name').replace(/\s/, '_')) + "_" + (this.model.get('empire')) + "_" + timestamp,
          return_key: "" + (this.make_id()) + "_" + (this.model.get('name').toLowerCase().replace(/\s/, '_')) + "_" + (this.make_id())
        });
        return localStorage.setItem('return_key', this.model.get('return_key'));
      },
      make_id: function() {
        var num, possible, text;
        text = "";
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        text += (function() {
          var _results;
          _results = [];
          for (num = 8; num >= 1; num--) {
            _results.push(possible.charAt(Math.floor(Math.random() * possible.length)));
          }
          return _results;
        })();
        return text.toString().replace(/,/g, '');
      },
      share_progress: function($link) {
        var url;
        url = "" + ($link.attr('href')) + "http://totalwar.ifkeith.com/%23/maps/" + (this.model.get('file'));
        if ($link.hasClass('twitter')) url += "&text=Check out my empire";
        return window.location = url;
      },
      /*========================
                 EVENTS
      ========================
      */
      select_current_empire: function(e) {
        var prev_selected, val;
        val = $(e.target).val();
        prev_selected = this.selected;
        this.selected = this.empire_data[val];
        this.$('.selected h3').html(this.selected.title);
        this.$('.selected img').attr({
          src: "/images/factions/" + val + ".png",
          title: this.selected.title,
          alt: this.selected.title
        });
        this.parent.selected = this.selected;
        return this.parent.highlight_selected_regions(prev_selected);
      },
      update_user_turn: function(e) {
        return this.model.set('turn', $(e.target).val());
      },
      take_screen_shot: function(e) {
        var _this = this;
        html2canvas($('#map > div'), {
          onrendered: function(canvas) {
            var ctx, dataURL, extra_canvas, filename;
            $(e.target).replaceWith("<a href='#download_image' class='download with-icon'>Download Image</a>");
            filename = "" + (_this.model.get('name')) + "_" + (_this.model.get('empire')) + ".png";
            extra_canvas = document.createElement("canvas");
            extra_canvas.setAttribute('width', 828);
            extra_canvas.setAttribute('height', 681);
            ctx = extra_canvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 828, 681);
            dataURL = extra_canvas.toDataURL();
            return $('a.download').attr({
              href: dataURL,
              download: filename.replace(/\s/, '_')
            });
          }
        });
        return false;
      },
      save_progress: function(e) {
        var $link, d, user_json,
          _this = this;
        $link = $(e.target);
        d = new Date();
        if (this.model.get('file') == null) this.initial_save();
        this.model.set({
          updated_at: "" + (d.getMonth() + 1) + "/" + (d.getDate()) + "/" + (d.getFullYear())
        });
        user_json = {
          user: this.model.toJSON(),
          factions: this.parent.empire_information
        };
        $.ajax({
          url: '/includes/share_map.php',
          type: 'POST',
          dataType: 'json',
          data: {
            content: JSON.stringify(user_json),
            filename: "" + (this.model.get('file')) + ".json"
          },
          success: function(response) {
            if ($link.hasClass('share')) {
              return _this.share_progress($link);
            } else {
              return $(e.target).hide().after("<p>Map Saved! :P</p>");
            }
          },
          error: function() {
            if (e != null) {
              return $(e.target).hide().after("<p>Something went wrong :(</p>");
            }
          }
        });
        return false;
      }
    });
    return Sidebar;
  });

}).call(this);
