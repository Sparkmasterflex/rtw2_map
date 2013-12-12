define [
  'jquery'
  'underscore'
  'backbone'
  'models/map'
  'models/user'
  'views/users/sidebar'
  'hbars!templates/maps/map'
], ($, _, Backbone, Map, User, Sidebar, newMap) ->
  NewMap = Backbone.View.extend
    el: "#content section"

    events:
      "click area.region": "highlight_region"

    initialize: (options) ->
      _.bindAll this, 'render'
      # this.user = options.user
      this.user = new User
        name: "Keith Raymond"
        turn: 1
        empire: 'carthage'
        regions: 4

    render: () ->
      this.$el.html newMap(this)
      $.when(this.prepare_map()).then => @render_sidebar()
      this

    prepare_map: () ->
      this.$('#map_image').maphilight()
      $.get "/javascripts/factions.json", (data) =>
        @empire_information = data
        @selected = this.empire_information[@user.get('empire')]
        $.each @empire_information, (key, attrs) =>
          additional = {color: attrs.color, border: attrs.border}
          @color_settlements region, additional for region in attrs.regions

    render_sidebar: () ->
      this.sidebar = new Sidebar
        model: this.user
        empire_data: this.empire_information
        empire: this.user.get('empire')
        parent: this
      this.$('#map_container').append this.sidebar.render().el


    color_settlements: (region, additional) ->
      $area = this.$("area##{region}")
      data = $area.data('maphilight') or {}
      data.fillColor = additional.color
      data.strokeColor = additional.border if additional.border?
      data.alwaysOn = true
      $area.data('maphilight', data).trigger('alwaysOn.maphilight')


    ###=============================
                EVENTS
    =============================###
    highlight_region: (e) ->
      $area = $(e.target)
      data = $area.data('maphilight') or {}
      this.sidebar.add_remove_region $area.attr('id') unless data.fillColor? and data.fillColor isnt this.selected.color
      if data.fillColor
        delete data.fillColor
        delete data.strokeColor
        data.alwaysOn = false
      else
        data.fillColor = this.selected.color
        data.strokeColor = this.selected.border
        data.alwaysOn = true
      $area.data('maphilight', data).trigger('alwaysOn.maphilight')

  NewMap