<?php
  $data     = $_POST['content'];
  $filename = $_POST['filename'];

  file_put_contents($_SERVER['DOCUMENT_ROOT']."/javascripts/saved_data/$filename", $data);

  header('Content-type: application/json');
  echo json_encode(array('success' => true));
?>