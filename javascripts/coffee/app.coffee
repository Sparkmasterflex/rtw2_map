define [
  'jquery'
  'underscore'
  'backbone'
  'maphilight'
  'router'
], ($, _, backbone, maphilight, Router) ->
  initialize = () ->
    this.development = true if window.location.host is 'rtw_map.dev'
    this.router = new Router()

  {
    initialize: initialize
  }