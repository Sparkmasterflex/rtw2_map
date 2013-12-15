<?php
  $data     = $_POST['content'];
  $filename = $_POST['filename'];

  // $file = fopen("/javascripts/saved_data/$filename", 'w') or die("can't open file");
  file_put_contents($_SERVER['DOCUMENT_ROOT']."/javascripts/saved_data/$filename", $data);

  header('Content-type: application/json');
  echo json_encode(array('success' => true));
?>