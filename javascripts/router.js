(function() {

  define(['jquery', 'underscore', 'backbone', 'app', 'views/users/new', 'views/maps/new'], function($, _, Backbone, App, NewUser, NewMap) {
    var AppRouter;
    AppRouter = Backbone.Router.extend({
      routes: {
        'maps/new': 'maps_new',
        '*actions': 'default_action'
      },
      initialize: function() {
        this.on('route:maps_new', function(actions) {
          this.new_map = new NewMap({
            user: window.user
          });
          return this.new_map.render().el;
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
