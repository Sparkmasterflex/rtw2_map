define [
  'jquery'
  'underscore'
  'backbone'
  'hbars!templates/users/returning_view'
], ($, _, Backbone, ReturningView) ->
  ReturningMap = Backbone.View.extend

    initialize: () ->
      _.bindAll this, 'render'

    render: () ->
      this.$el.html ReturningView(this.model)
      this