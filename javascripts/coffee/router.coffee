define [
  'jquery',
  'underscore',
  'backbone',
  'app',
  'views/users/new',
  'views/maps/new'
], ($, _, Backbone, App, NewUser, NewMap) ->

  AppRouter = Backbone.Router.extend
    routes:
      'maps/new': 'maps_new'
      '*actions': 'default_action'

    initialize: ->

      this.on 'route:maps_new', (actions) ->
        this.new_map = new NewMap
          user: window.user
        this.new_map.render().el

      this.on 'route:default_action', (actions) ->
        this.new_user = new NewUser()
        this.new_user.render().el


      Backbone.history.start()


  AppRouter