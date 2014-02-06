define [
  'jquery',
  'underscore',
  'backbone',
  'hbars!templates/users/sidebar'
], ($, _, Backbone, sidebar) ->
  Sidebar = Backbone.View.extend
    tagName: 'aside'
    className: 'user-sidebar clearfix'

    events:
      'change select#select-empire': 'select_current_empire'
      'change input.sidebar-input': 'update_user_turn'
      "click a.screen-shot":   "take_screen_shot"
      "click a.save-progress": "save_progress"
      "click a.share":         "save_progress"

    region_count: 0

    initialize: (options) ->
      _.bindAll this, 'render', 'update_region_count'
      this.empire_data = options.empire_data
      this.empire = options.empire
      this.parent = options.parent
      this.model.set
        allow_edit: options.allow_edit
        update_turn: options.update_turn
      this.region_count = parseInt(this.model.get('regions'))
      this.model.bind 'change:regions', this.update_region_count

    render: () ->
      this.$el.html sidebar(this.model.toJSON())
      this.setup_empire_select() if this.model.get('allow_edit')?
      this.append_controlled_regions()
      this

    setup_empire_select: ->
      _.each this.empire_data, (value, key) =>
        $option = $("<option value='#{key}'>#{value.title}</option>")
        $option.attr('selected', true) if key is this.empire
        @.$('select#select-empire').append $option

    append_controlled_regions: ->
      this.$('.regions-list ul').empty()
      $.each this.empire_data[this.empire].regions, (i, region) =>
        @add_remove_region region

    add_remove_region: (region) ->
      if this.user_empire_region(region)
        $li = this.$(".regions-list li[data-region=#{region}]")
        if $li.length > 0
          this.region_count -= 1 unless this.$('.regions-list li').length < this.region_count
          $li.remove()
        else
          this.region_count += 1 unless this.$('.regions-list li').length < this.region_count
          this.$(".regions-list ul").prepend "<li data-region='#{region}'>#{this.humanize(region)}</li>"
        this.model.set {regions: this.region_count}

    user_empire_region: (region) ->
      if this.model.get('allow_edit')
        this.$('select#select-empire').val() is this.empire
      else
        _.indexOf(this.empire_data[this.empire].regions, region) >= 0

    update_region_count: ->
      this.$('li.region-count').html "Total Regions: #{this.region_count}"

    humanize: (string) ->
      humanized = ""
      arr = string.split('_')
      _.each arr, (str) => humanized += "#{str.charAt(0).toUpperCase()}#{str.slice(1)} "

      humanized

    initial_save: () ->
      d = new Date()
      timestamp = "#{d.getFullYear()}#{d.getMonth()}#{d.getDate()}#{d.getTime()}"
      this.model.set
        file: "#{this.model.get('name').replace(/\s/, '_')}_#{this.model.get('empire')}_#{timestamp}"
        return_key: "#{this.make_id()}_#{this.model.get('name').toLowerCase().replace(/\s/, '_')}_#{this.make_id()}"
      localStorage.setItem 'return_key', this.model.get('return_key')

    make_id: () ->
      text = ""
      possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

      text += (possible.charAt(Math.floor(Math.random() * possible.length)) for num in [8..1])
      text.toString().replace(/,/g, '')

    share_progress: ($link) ->
      url = "#{$link.attr('href')}http://totalwar.ifkeith.com/%23/maps/#{this.model.get('file')}"
      url += "&text=Check out my empire" if $link.hasClass 'twitter'

      window.location = url




    ###========================
               EVENTS
    ========================###
    select_current_empire: (e) ->
      val = $(e.target).val()
      this.selected = this.empire_data[val]
      this.$('.selected h3').html this.selected.title
      this.$('.selected img').attr
        src: "/images/factions/#{val}.png"
        title: this.selected.title
        alt: this.selected.title
      this.parent.selected = this.selected

    update_user_turn: (e) ->
      this.model.set 'turn', $(e.target).val()
      console.log this.model.get('turn')

    take_screen_shot: (e) ->
      html2canvas $('#map > div'),
        onrendered: (canvas) =>
          $(e.target).replaceWith "<a href='#download_image' class='download with-icon'>Download Image</a>"
          filename = "#{@model.get('name')}_#{@model.get('empire')}.png"
          extra_canvas = document.createElement("canvas")
          extra_canvas.setAttribute('width',828)
          extra_canvas.setAttribute('height',681)
          ctx = extra_canvas.getContext('2d')
          ctx.drawImage(canvas,0,0,canvas.width, canvas.height,0,0,828,681)
          dataURL = extra_canvas.toDataURL()

          $('a.download').attr
            href: dataURL
            download: filename.replace(/\s/, '_')
      false

    save_progress: (e) ->
      $link = $(e.target)
      d = new Date()
      this.initial_save() unless this.model.get('file')?
      this.model.set updated_at: "#{d.getMonth()+1}/#{d.getDate()}/#{d.getFullYear()}"
      user_json =
        user: this.model.toJSON()
        factions: this.parent.empire_information
      $.ajax
        url: '/includes/share_map.php'
        type: 'POST'
        dataType: 'json'
        data:
          content: JSON.stringify(user_json)
          filename: "#{this.model.get('file')}.json"
        success: (response) =>
          if $link.hasClass 'share'
            @share_progress($link)
          else
            $(e.target).hide().after "<p>Map Saved! :P</p>"
        error: ->
          $(e.target).hide().after "<p>Something went wrong :(</p>" if e?

      false

  Sidebar