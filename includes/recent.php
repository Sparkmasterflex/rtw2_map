<?php
  $recent = array();
  foreach(glob($_SERVER['DOCUMENT_ROOT']."/javascripts/saved_data/*.json") as $map) {
    $json = json_decode(file_get_contents($map), true);
    // $recent[basename($map)] = array(
    $user_map = array(
      'link' => preg_replace("/\.json$/", "", basename($map)),
      'name' => $json['user']['name'],
      'empire' => $json['user']['humanized_empire'],
      'regions' => $json['user']['regions'],
      'turn' => $json['user']['turn']
    );
    array_push($recent, $user_map);
  }
  header('Content-type: application/json');
  echo json_encode($recent);
?>