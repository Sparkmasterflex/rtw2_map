(function() {

  define(['jquery', 'underscore', 'backbone', 'models/user', 'hbars!templates/users/new'], function($, _, Backbone, User, newUser) {
    var NewUser;
    NewUser = Backbone.View.extend({
      el: "#content section",
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
        return this;
      },
      setup_form: function() {
        var _this = this;
        this.$('input#turn').val(this.model.get('turn'));
        this.$('input#regions').val(this.model.get('regions'));
        return $.get("/javascripts/factions.json", function(data) {
          _this.$('select#empire').empty();
          return $.each(data, function(key, attrs) {
            var $option;
            $option = $("<option value='" + key + "'>" + (key.charAt(0).toUpperCase()) + (key.slice(1)) + "</option>");
            if (key === _this.model.get('empire')) $option.attr('selected', true);
            return _this.$('select#empire').append($option);
          });
        });
      },
      set_user_attributes: function() {
        var _this = this;
        return $.each(this.$('input, select'), function(i, elm) {
          return _this.model.set($(elm).attr('name'), $(elm).val());
        });
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
