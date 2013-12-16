define [
  'jquery'
  'underscore'
  'backbone'
  'html2canvas'
  'models/map'
  'models/user'
  'views/users/sidebar'
  'hbars!templates/maps/map'
], ($, _, Backbone, html2canvas, Map, User, Sidebar, showMap) ->
  ShowMap = Backbone.View.extend
    el: "#content section"

    initialize: (options) ->
      _.bindAll this, 'render'
      this.user = options.user
      this.empire_information = options.empire_information

    render: () ->
      this.$el.html showMap(this)
      $.when(this.prepare_map()).then => @render_sidebar()
      this

    prepare_map: () ->
      this.$('#map_image').maphilight()
      this.selected = this.empire_information[this.user.get('empire')]
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