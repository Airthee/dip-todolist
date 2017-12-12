<?
  require_once 'controller/connect.php';

	// Récupération des éléments à afficher
  $result = $pdo->query("SELECT * FROM todolist");

  // Rend la vue
  $m = new Mustache_Engine(array(
    'loader'=>new Mustache_Loader_FilesystemLoader(dirname(__FILE__) . '/views'),
  ));
  echo $m->render('index', array(
    'list'=>$result,
  ));