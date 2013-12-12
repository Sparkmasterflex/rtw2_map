(function() {

  require.config({
    paths: {
      jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
      maphilight: 'vendor/jquery.maphilight',
      underscore: 'vendor/underscore.min',
      backbone: 'vendor/backbone.min',
      templates: '../templates',
      Handlebars: 'vendor/handlebars',
      text: 'vendor/text',
      hbars: 'vendor/hbars'
    },
    shim: {
      'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      'underscore': {
        exports: '_'
      },
      'Handlebars': {
        exports: 'Handlebars'
      },
      'maphilight': {
        deps: ['jquery'],
        exports: 'jQuery.fn.maphilight',
        init: function($) {
          return $.fn.maphilight.defaults = {
            fill: true,
            fillColor: 'cccccc',
            fillOpacity: 0.5,
            stroke: true,
            strokeColor: '999999',
            strokeOpacity: 1,
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
          };
        }
      }
    }
  });

  require(['app'], function(App) {
    window.MapApp = App;
    return MapApp.initialize();
  });

}).call(this);
