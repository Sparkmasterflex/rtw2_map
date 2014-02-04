(function() {

  define(['jquery', 'underscore', 'backbone', 'app', 'models/user', 'views/users/new', 'views/maps/new', 'views/maps/edit', 'views/maps/show'], function($, _, Backbone, App, User, NewUser, NewMap, EditMap, ShowMap) {
    var AppRouter;
    AppRouter = Backbone.Router.extend({
      routes: {
        'maps/new': 'maps_new',
        'maps/:file/update': 'maps_edit',
        'maps/:file': 'maps_show',
        '*actions': 'default_action'
      },
      initialize: function() {
        this.on('route:maps_new', function(actions) {
          if (window.user != null) {
            this.new_map = new NewMap({
              user: window.user
            });
            return this.new_map.render().el;
          } else {
            return this.navigate("/", {
              trigger: true
            });
          }
        });
        this.on('route:maps_edit', function(file) {
          var _this = this;
          return $.get("/javascripts/saved_data/" + file + ".json", function(data) {
            var user;
            data = MapApp.development ? data : JSON.parse(data);
            user = new User(data.user).set('file', file);
            _this.edit_map = new EditMap({
              user: user,
              empire_information: data.factions
            });
            return _this.edit_map.render().el;
          });
        });
        this.on('route:maps_show', function(file) {
          var _this = this;
          return $.get("/javascripts/saved_data/" + file + ".json", function(data) {
            data = MapApp.development ? data : JSON.parse(data);
            _this.show_map = new ShowMap({
              user: new User(data.user),
              empire_information: data.factions
            });
            return _this.show_map.render().el;
          });
        });
        this.on('route:default_action', function(actions) {
          this.new_user = new NewUser();
          return this.new_user.render().el;
        });
        return Backbone.history.start();
      }
    });
    return AppRouter;
  });

}).call(this);
