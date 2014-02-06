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
        update_turn: true

      this.$('#map_container').prepend this.sidebar.render().el
      this.sidebar.$el.addClass 'full-sized'

    color_settlements: (region, additional) ->
      $area = this.$("area##{region}")
      data = $area.data('maphilight') or {}
      data.fillColor = additional.color
      data.strokeColor = additional.border if additional.border?
      data.alwaysOn = true
      $area.data('maphilight', data).trigger('alwaysOn.maphilight')

    update_empire_data: (region, prev_emp) ->
      empires = [this.selected.title.toLowerCase()]
      empires.push(prev_emp) if prev_emp?
      _.each empires, (emp) =>
        current_data = this.empire_information[emp]
        i = _.indexOf current_data.regions, region
        if i >= 0
          current_data.regions.splice(i, 1)
          this.$("area##{region}").removeAttr('data-empire')
        else
          current_data.regions.push(region)
          this.$("area##{region}").data('empire', emp)


    ###=============================
                EVENTS
    =============================###
    highlight_region: (e) ->
      $area = $(e.target)
      data = $area.data('maphilight') or {}
      this.sidebar.add_remove_region $area.attr('id') unless data.fillColor? and data.fillColor isnt this.selected.color
      this.update_empire_data $area.attr('id'), $area.data('empire')
      if data.fillColor
        delete data.fillColor
        delete data.strokeColor
        data.alwaysOn = false
      else
        data.fillColor = this.selected.color
        data.strokeColor = this.selected.border
        data.alwaysOn = true
      $area.data('maphilight', data).trigger('alwaysOn.maphilight')


    save_and_generate_link: (e) ->
      filename = "#{this.user.get('file')}.json"
      d = new Date()
      this.user.set 'updated_at', "#{d.getMonth()+1}/#{d.getDate()}/#{d.getFullYear()}"
      user_json = {
        user: this.user.toJSON()
        factions: this.empire_information
      }
      $.ajax
        url: '/includes/share_map.php'
        type: 'POST'
        dataType: 'json'
        data:
          content: JSON.stringify(user_json)
          filename: filename
        success: (response) ->
          url = "http://totalwar.ifkeithraymond.com/%23maps/#{filename.replace(/\.json$/, '')}"
          window.location = "http://twitter.com/share?url=#{url}&text=Check out my empire"
        error: (response, err, other...) ->
          $(e.target).hide().after "<p>Something went wrong :(</p>"
      false
