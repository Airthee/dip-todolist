<?
  // Vérification de la méthode de récupération de la page 
  if($_SERVER['REQUEST_METHOD']!="POST"){
    header('HTTP/1.0 403 Forbidden');
    exit;
  }

  // Résultat à retourner
  $response = array(
    'success'=>false,
    'message'=>'',
    'data'=>[]
  );

  try{
    $pdo = getPdo();

    // Récupération des formulaires
    $action = isset($_POST['action']) ? $_POST['action'] : null;
    $data = isset($_POST['data']) ? json_decode($_POST['data'], true) : null;

    // Traitement de l'action
    switch($action){

      // Ajout d'une tâche à la liste
      case 'add':
        $query = "INSERT INTO todolist (`libelle`) VALUES (?)";
        $statement = $pdo->prepare($query);
        $statement->bindParam(1, $data['libelle']);
        $result = $statement->execute();
      break;

      // Suppression d'une tâche de la liste
      case 'delete':
        foreach($data['toDelete'] as $d){
          $query = "DELETE FROM todolist WHERE id = ?";
          $statement = $pdo->prepare($query);
          $statement->bindParam(1, $d);
          $result = $statement->execute(); 
        }
      break;

      // Récupération de la liste des tâches
      case 'get':
        $result = $pdo->query("SELECT * FROM todolist");
        if($result)
          $response['data'] = $result;
        else
          throw new Exception("Erreur lors de la récupération des todos");
      break;

      // Récupération de la liste des tâches au format html généré par views/list.mustache
      case 'getHtml':
        $result = $pdo->query("SELECT * FROM todolist");
        if($result){
          if(count($result)>0){
            $response['data'] = $mustache->render('list', array(
              'list'=>$result,
            ));
          }
        }
        else
          throw new Exception("Erreur lors de la récupération des todos");
      break;

      // Action non prise en compte
      default:
        throw new Exception(sprintf("L'action %s n'est pas prise en compte", $action));
    }

    $response['success'] = true;
  }
  catch(Exception $e){
    error_log($e->getMessage());
    $response['message'] = "Une erreur est survenue";
  }
  finally{
    echo json_encode($response);
    exit;
  }