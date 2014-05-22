<?php
  $data     = $_POST['content'];
  $filename = $_POST['filename'];

  $body = "A map was created on totalwar.ifkeith.com.\n\nSee it here: http://totalwar.ifkeith.com/#/maps/" . $_POST['filename'];

  file_put_contents($_SERVER['DOCUMENT_ROOT']."/javascripts/saved_data/$filename", $data);
  mail("raymondke99@gmail.com", "Map Created on totalwar.ifkeith.com", $body, "no-reply@ifkeith.com");

  header('Content-type: application/json');
  echo json_encode(array('success' => true));
?>