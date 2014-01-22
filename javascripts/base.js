(function() {
  var color_settlements;

  $(function() {
    $('#map_image').maphilight();
    $('area.region').click(function(e) {
      var $area, data;
      $area = $(e.target);
      data = $area.data('maphilight') || {};
      data.fillColor = 'ffffff';
      data.alwaysOn = true;
      return $area.data('maphilight', data).trigger('alwaysOn.maphilight');
    });
    return $.get("/javascripts/factions.json", function(data) {
      return $.each(data, function(key, attrs) {
        var additional, region, _i, _len, _ref, _results;
        additional = {
          color: attrs.color,
          border: attrs.border
        };
        _ref = attrs.regions;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          region = _ref[_i];
          _results.push(color_settlements(region, additional));
        }
        return _results;
      });
    });
  });

  color_settlements = function(region, additional) {
    var $area, data;
    $area = $("area#" + region);
    data = $area.data('maphilight') || {};
    data.fillColor = additional.color;
    if (additional.border != null) {
      data.strokeColor = additional.border;
    }
    data.alwaysOn = true;
    return $area.data('maphilight', data).trigger('alwaysOn.maphilight');
  };

  $.fn.maphilight.defaults = {
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

}).call(this);
