define [
  'jquery'
  'underscore'
  'backbone'
  'models/map'
  'hbars!templates/maps/recent_map'
], ($, _, Backbone, Map, recentMap) ->
  RecentMap = Backbone.View.extend
    tagName: 'tr'

    initialize: () ->
      _.bindAll this, 'render'

    render: () ->
      this.$el.html recentMap(this.model)
      this

  RecentMap