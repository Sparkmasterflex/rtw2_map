define [
  'jquery'
  'underscore'
  'backbone'
  'views/users/sidebar'
], ($, _, Backbone, Sidebar) ->
  MapView =
    minor:   {fill: 0.25, stroke: 0.5}
    major:   {fill: 0.4, stroke: 0.7}
    current: {fill: 0.75, stroke: 1}

    render_sidebar: (options) ->
      this.sidebar = new Sidebar
        model: this.user
        empire_data: this.empire_information
        empire: this.user.get('empire')
        parent: options.parent
        allow_edit: options.allow_edit
        update_turn: options.update_turn
      this.$('#map_container').prepend this.sidebar.render().el


    color_settlements: (region, additional) ->
      $area = this.$("area##{region}")
      data = $area.data('maphilight') or {}
      data.fillColor = additional.color
      data.strokeColor = additional.border if additional.border?
      if additional.current
        data.fillOpacity = this.current.fill
        data.strokeOpacity = this.current.stroke
      else if !additional.playable
        data.fillOpacity = this.minor.fill
        data.strokeOpacity = this.minor.stroke
      data.alwaysOn = true
      $area.data('empire', additional.empire).data('maphilight', data).trigger('alwaysOn.maphilight')
      $area.attr 'title', "#{additional.empire}: #{$area.attr('title')}"


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

    highlight_selected_regions: (prev) ->
      this.brighten_highlight region for region in this.selected.regions

      this.previous = prev if prev?
      this.dim_highlight region for region in this.previous.regions

    dim_highlight: (region) ->
      data = $("##{region}").data('maphilight') or {}
      data.fillOpacity = if this.previous.playable then this.major.fill else this.minor.fill
      data.strokeOpacity = if this.previous.playable then this.major.stroke else this.minor.stroke
      $("##{region}").data('maphilight', data).trigger('alwaysOn.maphilight')

    brighten_highlight: (region) ->
      data = $("##{region}").data('maphilight') or {}
      data.fillOpacity = this.current.fill
      data.strokeOpacity = this.current.stroke
      $("##{region}").data('maphilight', data).trigger('alwaysOn.maphilight')




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
        data.fillOpacity = this.current.fill
        data.strokeOpacity = this.current.stroke
        data.fillColor = this.selected.color
        data.strokeColor = this.selected.border
        data.alwaysOn = true
      $area.data('maphilight', data).trigger('alwaysOn.maphilight')


  MapView