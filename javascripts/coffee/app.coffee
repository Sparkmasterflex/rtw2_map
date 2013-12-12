define [
  'jquery'
  'underscore'
  'backbone'
  'maphilight'
  'router'
], ($, _, backbone, maphilight, Router) ->
  initialize = () ->
    this.router = new Router()

  {
    initialize: initialize
  }