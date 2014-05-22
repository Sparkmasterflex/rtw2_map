<?php
  $recent = array();
  $i = 0;
  $files = glob($_SERVER['DOCUMENT_ROOT']."/javascripts/saved_data/*.json");
  rsort($files);
  foreach($files as $map) {
    if($i < 10) {
      $json = json_decode(file_get_contents($map), true);
      $user_map = array(
        'link'             => preg_replace("/\.json$/", "", basename($map)),
        'name'             => $json['user']['name'],
        'empire'           => $json['user']['empire'],
        'humanized_empire' => $json['user']['humanized_empire'],
        'regions'          => $json['user']['regions'],
        'turn'             => $json['user']['turn'],
        'return_key'       => $json['user']['return_key'],
        'updated_at'       => $json['user']['updated_at']
      );
      array_push($recent, $user_map);
      $i++;
    }
  }
  header('Content-type: application/json');
  echo json_encode($recent);
?>