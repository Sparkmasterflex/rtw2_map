define [
  'jquery'
  'underscore'
  'backbone'
  'html2canvas'
  'models/map'
  'models/user'
  'views/users/sidebar'
  'hbars!templates/maps/map'
], ($, _, Backbone, html2canvas, Map, User, Sidebar, newMap) ->
  NewMap = Backbone.View.extend
    el: "#content section"

    events:
      "click area.region": "highlight_region"

    initialize: (options) ->
      _.bindAll this, 'render'
      this.user = options.user
      # this.user = new User
      #   name: "Keith Raymond"
      #   turn: 1
      #   empire: 'carthage'
      #   humanized_empire: 'Carthage'
      #   regions: 4

    render: () ->
      this.$el.html newMap(this)
      options =
        parent: this
        allow_edit: true
        update_turn: false
      $.when(this.prepare_map()).then => @render_sidebar options
      this

    prepare_map: () ->
      this.$('#map_image').maphilight()
      $.get "/javascripts/factions.json", (data) =>
        @empire_information = if MapApp.development then data else JSON.parse(data)
        @selected = this.empire_information[@user.get('empire')]
        $.each @empire_information, (key, attrs) =>
          additional = {empire: key, color: attrs.color, border: attrs.border, playable: attrs.playable, current: (attrs is @selected)}
          @color_settlements region, additional for region in attrs.regions
          @previous = @selected

  NewMap