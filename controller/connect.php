<?
  // Connexion à la base de données
function getPdo(){
  $pdo = null;
  try{
    $pdo = new PDO('mysql:dbname=todolist;host=127.0.0.1', 'root', 'root');
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
  }
  catch(Exception $e){
    echo "Une erreur est survenue lors de la connexion à la base de données";
    error_log($e->getMessage());
    exit;
  }
  return $pdo;
}