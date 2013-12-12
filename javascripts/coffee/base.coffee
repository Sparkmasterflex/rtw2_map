$ ->
  $('#map_image').maphilight()  #({fill:'false'});
  $('area.region').click (e) ->
    $area = $(e.target)
    data = $area.data('maphilight') or {}
    data.fillColor = 'ffffff'
    data.alwaysOn = true
    $area.data('maphilight', data).trigger('alwaysOn.maphilight')


  $.get "/javascripts/factions.json", (data) ->
    $.each data, (key, attrs) ->
      additional = {color: attrs.color, border: attrs.border}
      color_settlements region, additional for region in attrs.regions


color_settlements = (region, additional) ->
  $area = $("area##{region}")
  data = $area.data('maphilight') or {}
  data.fillColor = additional.color
  data.strokeColor = additional.border if additional.border?
  data.alwaysOn = true
  $area.data('maphilight', data).trigger('alwaysOn.maphilight')


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
}