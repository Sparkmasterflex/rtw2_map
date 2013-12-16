define [
  'jquery',
  'underscore',
  'backbone',
  'app',
  'models/user'
  'views/users/new',
  'views/maps/new'
  'views/maps/show'
], ($, _, Backbone, App, User, NewUser, NewMap, ShowMap) ->

  AppRouter = Backbone.Router.extend
    routes:
      'maps/new':   'maps_new'
      'maps/:file': 'maps_show'
      '*actions':   'default_action'

    initialize: ->
      this.on 'route:maps_new', (actions) ->
        if window.user?
          this.new_map = new NewMap
            user: window.user
          this.new_map.render().el
        else
          this.navigate("/", {trigger: true})

      this.on 'route:maps_show', (file) ->
        $.get "/javascripts/saved_data/#{file}.json", (data) =>
          this.show_map = new ShowMap
            user: new User(data.user)
            empire_information: data.factions
          this.show_map.render().el

      this.on 'route:default_action', (actions) ->
        this.new_user = new NewUser()
        this.new_user.render().el


      Backbone.history.start()


  AppRouter