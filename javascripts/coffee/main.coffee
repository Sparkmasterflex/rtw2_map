require.config
  paths:
    jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min'
    maphilight: 'vendor/jquery.maphilight'
    cycle2: 'vendor/cycle2.min'
    underscore: 'vendor/underscore.min'
    backbone: 'vendor/backbone.min'
    templates: '../templates'
    Handlebars: 'vendor/handlebars'
    text: 'vendor/text'
    hbars: 'vendor/hbars'
    html2canvas: 'vendor/html2canvas'

  shim:
    'backbone':
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    'underscore':
      exports: '_'
    'Handlebars':
      exports: 'Handlebars'
    'html2canvas':
      exports: 'html2canvas'
      deps: ['jquery']
    'cycle2':
      deps: ['jquery']
      exports: 'jQuery.fn.cycle'
    'maphilight':
      deps: ['jquery']
      exports: 'jQuery.fn.maphilight'
      init: ($) ->
        $.fn.maphilight.defaults =
          fill: true,
          fillColor: 'cccccc',
          fillOpacity: 0.5,
          stroke: true,
          strokeColor: '999999',
          strokeOpacity: 0.8,
          strokeWidth: 1,
          fade: true,
          alwaysOn: false,
          neverOn: false,
          groupBy: false,
          wrapClass: true,
          shadow: false,
          shadowX: 0,
          shadowY: 0,
          shadowRadius: 6,
          shadowColor: '000000',
          shadowOpacity: 0.8,
          shadowPosition: 'outside',
          shadowFrom: false

require [
  'app', 'cycle2', 'views/maps/map_view', 'views/maps/new', 'views/maps/edit'
], (App, cycle, MapView, NewMap, EditMap) ->
  $('.slideshow').cycle
    delay: 4000
    speed: 1500
    loader: 'wait'

  _.extend NewMap.prototype, MapView
  _.extend EditMap.prototype, MapView

  window.MapApp = App
  MapApp.initialize()
