<?
  // Chargement des dépendances
  require_once '../vendor/autoload.php';

  // Connexion à la base de données
  try{
    $pdo = new PDO('mysql:dbname=base_1;host=127.0.0.1', 'root', 'root');
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
  }
  catch(Exception $e){
    echo "Une erreur est survenue";
    erro_log($e->getMessage());
  }