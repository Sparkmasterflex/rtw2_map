define [
  'jquery'
  'underscore'
  'backbone'
  'models/user'
  'hbars!templates/users/new'
], ($, _, Backbone, User, newUser) ->
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
        $.each data, (key, attrs) =>
          $option = $("<option value='#{key}'>#{key.charAt(0).toUpperCase()}#{key.slice(1)}</option>")
          $option.attr('selected', true) if key is @model.get('empire')
          @.$('select#empire').append $option

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