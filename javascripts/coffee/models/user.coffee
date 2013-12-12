define [
  'jquery',
  'underscore',
  'backbone'
], ($, _, Backbone) ->
  User = Backbone.Model.extend
    defaults:
      turn: 1
      empire: 'rome'
      regions: 4

    capitalize_empire: ->
      "#{this.get('empire').charAt(0).toUpperCase()}#{this.get('empire').slice(1)}"

  User