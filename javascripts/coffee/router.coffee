define [
  'jquery',
  'underscore',
  'backbone',
  'app',
  'models/user'
  'views/users/new',
  'views/maps/new'
  'views/maps/edit'
  'views/maps/show'
], ($, _, Backbone, App, User, NewUser, NewMap, EditMap, ShowMap) ->

  AppRouter = Backbone.Router.extend
    routes:
      'maps/new':          'maps_new'
      'maps/:file/update': 'maps_edit'
      'maps/:file':        'maps_show'
      '*actions':          'default_action'

    initialize: ->
      this.on 'route:maps_new', (actions) ->
        if window.user?
          this.new_map = new NewMap
            user: window.user
          this.new_map.render().el
        else
          this.navigate("/", {trigger: true})

      this.on 'route:maps_edit', (file) ->
        $.get "/javascripts/saved_data/#{file}.json", (data) =>
          data = if MapApp.development then data else JSON.parse(data)
          user = new User(data.user).set('file', file)
          this.edit_map = new EditMap
            user: user
            empire_information: data.factions
          this.edit_map.render().el

      this.on 'route:maps_show', (file) ->
        $.get "/javascripts/saved_data/#{file}.json", (data) =>
          data = if MapApp.development then data else JSON.parse(data)
          this.show_map = new ShowMap
            user: new User(data.user)
            empire_information: data.factions
          this.show_map.render().el

      this.on 'route:default_action', (actions) ->
        this.new_user = new NewUser()
        this.new_user.render().el


      Backbone.history.start()


  AppRouter