<?
  // Dépendances
  require_once 'connect.php';

  try{
    // Récupération des formulaires
    $action = isset($_POST['action']) ? $_POST['action'] : null;
    $datas = isset($_POST['datas']) ? $_POST['datas'] : null;

    // Traitement de l'action
    switch($action){
      case 'add':
        $query = "INSERT INTO todolist (`libelle`) VALUES (?)";
        $statement = $pdo->prepare($query);
        $statement->bindParam(1, $datas['libelle']);
        $result = $statement->execute();
      break;

      case 'delete':
        foreach($datas['toDelete'] as $d){
          $query = "DELETE FROM todolist WHERE id = ?";
          $statement = $pdo->prepare($query);
          $statement->bindParam(1, $d);
          $result = $statement->execute(); 
        }
      break;

      default:
        throw new Exception("L'action n'est pas prise en compte");
    }
  }
  catch(Exception $e){
    // Page d'erreur
    // header('')
  }