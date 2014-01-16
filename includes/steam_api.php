<?php
  include "openid.php";

  $open_id = new LightOpenID('rtw_map.dev');

  session_start();

  if(!$open_id->mode) {
    if(isset($_GET['login'])) {
      $open_id->identity = "http://steamcommunity.com/openid";
      header("Location: {$open_id->authURL()}");
    }

    if(!isset($_SESSION['T2SteamAuth'])) {
      $login = "<div id='login'>Welcome Guest. Please <a href='?login'>login</a></div>";
    }
  } else if($open_id->mode == 'cancel') {
    echo "User has canceled Authentication";
  } else {
    if(!isset($_SESSION['T2SteamAuth'])) {
      $_SESSION['T2SteamAuth'] = $open_id->validate() ? $open_id->identity : null;
      $_SESSION['T2SteamID64'] = str_replace("http://steamcommunity.com/openid/id/", "", $_SESSION['T2SteamAuth']);

      if($_SESSION['T2SteamAuth'] !== null) {
        $steam64 = str_replace("http://steamcommunity.com/openid/id/", "", $_SESSION['T2SteamAuth']);
        // $profile = file_get_contents("http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=214950&key=B42DD494E046A9389AED0C3AF9B1A88B&steamid={$steam64}");

        $buffer = fopen("cache/{$steam64}.json", "w+");
        fwrite($buffer, $profile);
        fclose($buffer);
      }

      header("Location: steam_api.php");
    }
  }

  if(isset($_SESSION['T2SteamAuth'])) {
    $login = "<div id='login'><a href='?logout'>logout</a></div>";
  }

  if(isset($_GET['logout'])) {
    unset($_SESSION['T2SteamAuth']);
    unset($_SESSION['T2SteamID64']);
    header("Location: steam_api.php");
  }

  $steam = json_decode(file_get_contents("cache/{$_SESSION['T2SteamID64']}.json"));

  echo $login;
  echo $steam->response->players[0]->personaname;
?>