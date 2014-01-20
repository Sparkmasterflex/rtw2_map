(function() {

  define(['jquery', 'underscore', 'backbone', 'hbars!templates/users/sidebar'], function($, _, Backbone, sidebar) {
    var Sidebar;
    Sidebar = Backbone.View.extend({
      tagName: 'aside',
      className: 'user-sidebar',
      events: {
        'change select#select-empire': 'select_current_empire',
        "click a.screen-shot": "take_screen_shot",
        "click a.save-progress": "save_and_generate_link"
      },
      region_count: 0,
      initialize: function(options) {
        _.bindAll(this, 'render', 'update_region_count');
        this.empire_data = options.empire_data;
        this.empire = options.empire;
        this.parent = options.parent;
        if (options.allow_edit != null) {
          this.model.set('allow_edit', options.allow_edit);
        }
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
      /*========================
                 EVENTS
      ========================
      */
      select_current_empire: function(e) {
        var val;
        val = $(e.target).val();
        this.selected = this.empire_data[val];
        this.$('.selected h3').html(this.selected.title);
        this.$('.selected img').attr({
          src: "/images/factions/" + val + ".png",
          title: this.selected.title,
          alt: this.selected.title
        });
        return this.parent.selected = this.selected;
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
      save_and_generate_link: function(e) {
        this.parent.save_and_generate_link(e);
        return false;
      }
    });
    return Sidebar;
  });

}).call(this);
