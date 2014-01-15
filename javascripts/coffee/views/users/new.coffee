define [
  'jquery'
  'underscore'
  'backbone'
  'models/user'
  'views/maps/recent_map'
  'hbars!templates/users/new'
], ($, _, Backbone, User, RecentMap, newUser) ->
  NewUser = Backbone.View.extend
    el: "#content section"

    events:
      "submit form#new-user": "create_user"

    initialize: () ->
      _.bindAll this, 'render'
      this.model = new User()

    render: () ->
      this.$el.html newUser(this)
      this.setup_form()
      this.get_recent_maps()
      this

    # Create options for empire dropdown
    # Set values from model
    #
    # ==== Returns
    # Backbone.Model
    setup_form: ->
      this.$('input#turn').val this.model.get('turn')
      this.$('input#regions').val this.model.get('regions')
      # setup empire select
      $.get "/javascripts/factions.json", (data) =>
        @.$('select#empire').empty()
        $.each JSON.parse(data), (key, attrs) =>
          $option = $("<option value='#{key}'>#{key.charAt(0).toUpperCase()}#{key.slice(1)}</option>")
          $option.attr('selected', true) if key is @model.get('empire')
          @.$('select#empire').append $option

    get_recent_maps: () ->
      $.ajax
        url: "/includes/recent.php"
        type: "GET"
        success: (response) =>
          @.$('table.recent-maps tbody').empty() if response.length > 0
          _.each response, (map) =>
            recent = new RecentMap model: map
            @.$('table.recent-maps tbody').append recent.render().el

    set_user_attributes: ->
      $.each this.$('input, select'), (i, elm) =>
        @model.set $(elm).attr('name'), $(elm).val()
      emp = this.model.get('empire')
      this.model.set {humanized_empire: "#{emp.charAt(0).toUpperCase()}#{emp.slice(1)}"}


    ###=======================
              EVENTS
    =======================###
    # Create user and move to map page
    #
    # ==== Parameters:
    # e:: Event
    #
    # ==== Returns:
    # Boolean
    create_user: (e) ->
      $.when(this.set_user_attributes()).then =>
        window.user = this.model
        window.location = "/#maps/new"
      false



  NewUser