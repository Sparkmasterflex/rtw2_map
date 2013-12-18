define [
  'jquery',
  'underscore',
  'backbone',
  'hbars!templates/users/sidebar'
], ($, _, Backbone, sidebar) ->
  Sidebar = Backbone.View.extend
    tagName: 'aside'
    className: 'user-sidebar'

    events:
      'change select#select-empire': 'select_current_empire'
      "click a.screen-shot":   "take_screen_shot"
      "click a.save-progress": "save_and_generate_link"

    region_count: 0

    initialize: (options) ->
      _.bindAll this, 'render', 'update_region_count'
      this.empire_data = options.empire_data
      this.empire = options.empire
      this.parent = options.parent
      this.model.set('allow_edit', options.allow_edit) if options.allow_edit?
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

    save_and_generate_link: (e) ->
      this.parent.save_and_generate_link(e)
      false

  Sidebar