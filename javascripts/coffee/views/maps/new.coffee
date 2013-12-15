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
      "click area.region":     "highlight_region"
      "click a.screen-shot":   "take_screen_shot"
      "click a.save-progress": "save_and_generate_link"

    initialize: (options) ->
      _.bindAll this, 'render'
      # this.user = options.user
      this.user = new User
        name: "Keith Raymond"
        turn: 1
        empire: 'carthage'
        humanized_empire: 'Carthage'
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

    update_empire_data: (region, add) ->
      current_emp = this.selected.title.toLowerCase()
      current_data = this.empire_information[current_emp]
      i = _.indexOf current_data.regions, region
      if i >= 0
        current_data.regions.splice(i, 1)
      else
        current_data.regions.push(region)


    ###=============================
                EVENTS
    =============================###
    highlight_region: (e) ->
      $area = $(e.target)
      data = $area.data('maphilight') or {}
      this.sidebar.add_remove_region $area.attr('id') unless data.fillColor? and data.fillColor isnt this.selected.color
      this.update_empire_data $area.attr('id'), !data.fillColor
      if data.fillColor
        delete data.fillColor
        delete data.strokeColor
        data.alwaysOn = false
      else
        data.fillColor = this.selected.color
        data.strokeColor = this.selected.border
        data.alwaysOn = true
      $area.data('maphilight', data).trigger('alwaysOn.maphilight')

    take_screen_shot: (e) ->
      html2canvas this.$('#map > div'),
        onrendered: (canvas) =>
          $(e.target).replaceWith "<a href='#download_image' class='download-image'>Download Image</a>"
          filename = "#{@user.get('name')}_#{@user.get('empire')}.png"
          extra_canvas = document.createElement("canvas")
          extra_canvas.setAttribute('width',828)
          extra_canvas.setAttribute('height',681)
          ctx = extra_canvas.getContext('2d')
          ctx.drawImage(canvas,0,0,canvas.width, canvas.height,0,0,828,681)
          dataURL = extra_canvas.toDataURL()

          $('a.download-image').attr
            href: dataURL
            download: filename.replace(/\s/, '_')
      false

    save_and_generate_link: (e) ->
      d = new Date()
      timestamp = "#{d.getFullYear()}#{d.getMonth()}#{d.getDate()}#{d.getTime()}"
      filename = "#{this.user.get('name').replace(/\s/, '_')}_#{this.user.get('empire')}_#{timestamp}.json"
      user_json = {
        user: @user.toJSON()
        factions: this.empire_information
      }
      $.ajax
        url: '/share_map.php'
        type: 'POST'
        dataType: 'json'
        data:
          content: JSON.stringify(user_json)
          filename: filename
        success: (response) ->
          url = "http://totalwar.ifkeithraymond.com/%23maps/#{filename.replace(/\.json$/, '')}"
          # window.location = "http://twitter.com/share?url=#{url}&text=Check out my empire"
        error: (response, err, other...) ->
          $(e.target).hide().after "<p>Something went wrong :(</p>"

      false

  NewMap