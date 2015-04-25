<?php

defined('ROOT') || define('ROOT', realpath(__DIR__.'/../'));
defined('SRC') || define('SRC', ROOT.'/src');
defined('APP') || define('APP', 'Tori');

defined('VERSION') || define('VERSION', '0.2');


$found_file = false;
$file_path  = ROOT.'/vendor/autoload.php';

if (file_exists($file_path)) {
    $loader = require_once($file_path);
    $loader->set('Tori', SRC);
    $found_file = true;
}


if (! $found_file) {
    die('$ php composer.phar install を実行してください');
}

