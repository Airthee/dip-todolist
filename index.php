<?
require_once 'vendor/autoload.php';
require_once 'controller/connect.php';

// Mustach Engine
$mustache = new Mustache_Engine(array(
  'loader'=>new Mustache_Loader_FilesystemLoader(dirname(__FILE__) . '/views'),
));

// Traitement page
$page = isset($_GET['page']) ? $_GET['page'] : 'index';
$filename = sprintf('controller/%s.php', $page);
if (!file_exists($filename)){
  header('HTTP/1.0 404 Not Found');
  exit;
}
include $filename;