define [
  'jquery'
  'underscore'
  'backbone'
  'html2canvas'
  'models/map'
  'models/user'
  'views/maps/map_view'
  'views/users/sidebar'
  'hbars!templates/maps/map'
], ($, _, Backbone, html2canvas, Map, User, MapView, Sidebar, newMap) ->
  EditMap = Backbone.View.extend
    el: "#content section"

    events:
      "click area.region":     "highlight_region"

    initialize: (options) ->
      _.bindAll this, 'render'
      this.user = options.user
      this.empire_information = options.empire_information

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
      this.selected = this.empire_information[this.user.get('empire')]
      $.each @empire_information, (key, attrs) =>
        additional = {color: attrs.color, border: attrs.border}
        @color_settlements region, additional for region in attrs.regions

  EditMap