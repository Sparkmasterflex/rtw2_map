define [
  'jquery'
  'underscore'
  'backbone'
  'models/user'
  'views/maps/recent_map'
  'views/users/returning_map'
  'hbars!templates/users/new'
], ($, _, Backbone, User, RecentMap, ReturningMap, newUser) ->
  NewUser = Backbone.View.extend
    el: "#content section"

    option_group: null

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
        data = if MapApp.development then data else JSON.parse(data)
        $.each data, (key, attrs) =>
          if attrs.playable
            if attrs.expansion isnt @option_group
              @.$('select#empire').append @$optgroup if @$optgroup?

              @$optgroup = $("<optgroup label='#{attrs.expansion}'></optgroup>")
              @option_group = attrs.expansion

            $option = $("<option value='#{key}'>#{key.charAt(0).toUpperCase()}#{key.slice(1)}</option>")
            $option.attr('selected', true) if key is @model.get('empire')
            @$optgroup.append $option
          else if @option_group?
            @.$('select#empire').append @$optgroup if @$optgroup?
            @option_group = null


    get_recent_maps: () ->
      $.ajax
        url: "/includes/recent.php"
        type: "GET"
        success: (response) =>
          @.$('table.recent-maps tbody').empty() if response.length > 0
          _.each response, (map) =>
            @setup_returning_user map if map.return_key? and map.return_key is localStorage.getItem('return_key')
            recent = new RecentMap model: map
            @.$('table.recent-maps tbody').append recent.render().el

    set_user_attributes: ->
      $.each this.$('input, select'), (i, elm) =>
        @model.set $(elm).attr('name'), $(elm).val()
      emp = this.model.get('empire')
      this.model.set {humanized_empire: "#{emp.charAt(0).toUpperCase()}#{emp.slice(1)}"}

    setup_returning_user: (map) ->
      returning = new ReturningMap model: map
      $('.previous-maps').prepend returning.render().el

    # build_option_group: (opt_group) ->
    #   str = ""
    #   if opt_group isnt this.option_group
    #     str += "</optgroup>" if this.option_group?
    #     str += "<optgroup label='#{opt_group}'>"
    #     this.option_group = opt_group

    #   str


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