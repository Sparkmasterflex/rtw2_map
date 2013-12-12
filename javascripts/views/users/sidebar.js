(function() {

  define(['jquery', 'underscore', 'backbone', 'hbars!templates/users/sidebar'], function($, _, Backbone, sidebar) {
    var Sidebar;
    Sidebar = Backbone.View.extend({
      tagName: 'aside',
      className: 'user-sidebar',
      events: {
        'change select#select-empire': 'select_current_empire'
      },
      region_count: 0,
      initialize: function(options) {
        _.bindAll(this, 'render', 'update_region_count');
        this.empire_data = options.empire_data;
        this.empire = options.empire;
        this.parent = options.parent;
        return this.model.bind('change:regions', this.update_region_count);
      },
      render: function() {
        this.$el.html(sidebar(this.model.toJSON()));
        this.setup_empire_select();
        this.append_controlled_regions();
        return this;
      },
      setup_empire_select: function() {
        var _this = this;
        return _.each(this.empire_data, function(value, key) {
          var $option;
          $option = $("<option value='" + key + "'>" + key + "</option>");
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
        if (this.$('select#select-empire').val() === this.empire) {
          $li = this.$(".regions-list li[data-region=" + region + "]");
          if ($li.length > 0) {
            $li.remove();
            this.region_count -= 1;
          } else {
            this.$(".regions-list ul").append("<li data-region='" + region + "'>" + region + "</li>");
            this.region_count += 1;
          }
          return this.model.set({
            regions: this.region_count
          });
        }
      },
      update_region_count: function() {
        return this.$('li.region-count').html("Total Regions: " + this.region_count);
      },
      /*========================
                 EVENTS
      ========================
      */
      select_current_empire: function(e) {
        var val;
        val = $(e.target).val();
        this.selected = this.empire_data[val];
        this.$('.selected img').attr({
          src: "/images/factions/" + val + ".png",
          title: val,
          alt: val
        });
        return this.parent.selected = this.selected;
      }
    });
    return Sidebar;
  });

}).call(this);
