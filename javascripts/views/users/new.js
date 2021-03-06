(function() {

  define(['jquery', 'underscore', 'backbone', 'models/user', 'views/maps/recent_map', 'views/users/returning_map', 'hbars!templates/users/new'], function($, _, Backbone, User, RecentMap, ReturningMap, newUser) {
    var NewUser;
    NewUser = Backbone.View.extend({
      el: "#content section",
      option_group: null,
      events: {
        "submit form#new-user": "create_user"
      },
      initialize: function() {
        _.bindAll(this, 'render');
        return this.model = new User();
      },
      render: function() {
        this.$el.html(newUser(this));
        this.setup_form();
        this.get_recent_maps();
        return this;
      },
      setup_form: function() {
        var _this = this;
        this.$('input#turn').val(this.model.get('turn'));
        this.$('input#regions').val(this.model.get('regions'));
        return $.get("/javascripts/factions.json", function(data) {
          _this.$('select#empire').empty();
          data = MapApp.development ? data : JSON.parse(data);
          return $.each(data, function(key, attrs) {
            var $option;
            if (attrs.playable) {
              if (attrs.expansion !== _this.option_group) {
                if (_this.$optgroup != null) {
                  _this.$('select#empire').append(_this.$optgroup);
                }
                _this.$optgroup = $("<optgroup label='" + attrs.expansion + "'></optgroup>");
                _this.option_group = attrs.expansion;
              }
              $option = $("<option value='" + key + "'>" + (key.charAt(0).toUpperCase()) + (key.slice(1)) + "</option>");
              if (key === _this.model.get('empire')) {
                $option.attr('selected', true);
              }
              return _this.$optgroup.append($option);
            } else if (_this.option_group != null) {
              if (_this.$optgroup != null) {
                _this.$('select#empire').append(_this.$optgroup);
              }
              return _this.option_group = null;
            }
          });
        });
      },
      get_recent_maps: function() {
        var _this = this;
        return $.ajax({
          url: "/includes/recent.php",
          type: "GET",
          success: function(response) {
            if (response.length > 0) _this.$('table.recent-maps tbody').empty();
            return _.each(response, function(map) {
              var recent;
              if ((map.return_key != null) && map.return_key === localStorage.getItem('return_key')) {
                _this.setup_returning_user(map);
              }
              recent = new RecentMap({
                model: map
              });
              return _this.$('table.recent-maps tbody').append(recent.render().el);
            });
          }
        });
      },
      set_user_attributes: function() {
        var emp,
          _this = this;
        $.each(this.$('input, select'), function(i, elm) {
          return _this.model.set($(elm).attr('name'), $(elm).val());
        });
        emp = this.model.get('empire');
        return this.model.set({
          humanized_empire: "" + (emp.charAt(0).toUpperCase()) + (emp.slice(1))
        });
      },
      setup_returning_user: function(map) {
        var returning;
        returning = new ReturningMap({
          model: map
        });
        return $('.previous-maps').prepend(returning.render().el);
      },
      /*=======================
                EVENTS
      =======================
      */
      create_user: function(e) {
        var _this = this;
        $.when(this.set_user_attributes()).then(function() {
          window.user = _this.model;
          return window.location = "/#maps/new";
        });
        return false;
      }
    });
    return NewUser;
  });

}).call(this);
