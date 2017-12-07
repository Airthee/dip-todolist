<?
  // Connexion à la base de données
  try{
    $pdo = new PDO('mysql:dbname=base_1;host=127.0.0.1', 'root', 'root');
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
  }
  catch(Exception $e){
    echo "Une erreur est survenue";
    erro_log($e->getMessage());
  }

  // Récupération des formulaires
  $libelle = isset($_POST['libelle']) ? $_POST['libelle'] : null;
  $toDelete = isset($_POST['toDelete']) ? $_POST['toDelete'] : null;

  // Ajout d'un élément
  if ($libelle){
    $query = "INSERT INTO todolist (`libelle`) VALUES (?)";
    $statement = $pdo->prepare($query);
    $statement->bindParam(1, $libelle);
    $result = $statement->execute();
  }

  // Suppresion d'un élément
  if ($toDelete){
    foreach($toDelete as $d){
      $query = "DELETE FROM todolist WHERE id = ?";
      $statement = $pdo->prepare($query);
      $statement->bindParam(1, $d);
      $result = $statement->execute(); 
    }
  }

	// Récupération des éléments à afficher
  $result = $pdo->query("SELECT * FROM todolist");
  $list = array();
  while($row = $result->fetch())
    $list[] = $row;
?>

<!DOCTYPE html>
<html>
  <head>
    <title>TodoList</title>
    <link rel="stylesheet" type="text/css" href="style.css">
  </head>
  <body>
    <div class="container">
      <div class="header">
        <span class="reload">TODO List</span>
      </div>
      <div class="content">
        <fieldset>
          <legend>Liste des tâches</legend>
          <form method="post">
            <table>
              <tr>
                <td>
                    <div>
                      <? if(count($list)==0) : ?>
                        Aucune tâche n'a été renseignée pour le moment.
                      <? else: ?>
                        <label>
                          <input type="checkbox" id="selectAll">
                          <span id="selectAllLibelle">Tout sélectionner</span>
                        </label>
                      <? endif ?>
                    </div>
                    <? foreach($list as $element): ?>
                      <div id="listTaches">
                        <label>
                          <input type="checkbox" name="toDelete[]" value="<?= $element->id ?>">
                          <?= $element->libelle ?>
                        </label>
                      </div>
                    <? endforeach ?>
                </td>
                <td valign="bottom" class="align-right">
                  <input class="btn btn-danger" type="submit" value="Supprimer">
                </td>
              </tr>
            </table>
          </form>
        </fieldset>
        <fieldset>
          <legend>Ajouter une tâche</legend>
          <form method="post">
            <table>
              <tr>
                <td>
                  <div>
                    <input class="wallow" id="inputLibelle" type="text" name="libelle" autocomplete="off" placeholder="Saisir une tâche...">
                  </div>
                </td>
                <td class="align-right">
                  <input class="btn btn-success" type="submit" value="Ajouter">
                </td>
              </tr>
            </table>
          </form>
        </fieldset>
      </div>
      <div class="footer">
        
      </div>
    </div>

    <!-- JS -->
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
    <script type="text/javascript" src="script.js"></script>
  </body>
</html>