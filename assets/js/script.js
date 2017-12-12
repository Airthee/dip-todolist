var selectAllSelector = '#selectAll';
var checkBoxesSelector = "#listTaches input[type='checkbox']";

(function($){
	$(function(){
		// Focus
		$('#inputLibelle').focus();
  });

  // Check all
	$('#selectAll').on('change', initSelectAll);
  initSelectAll();

  $('.reload').on('click', function(){
    window.location.href = "";
  });

  // A la soumission d'un formulaire
  $('form').submit(function(e){
    e.preventDefault();

    var $this = $(this);
    action(
      $this.data('action'),
      $this.serializeArray()
    );
  })

  function initSelectAll(){
		var checkAll = $(selectAllSelector).is(':checked');
		var $checkboxes = $(checkBoxesSelector);
    $checkboxes.each(function(i, el){
      setChecked(el, checkAll);
    });
  }

  function setChecked(el, check=true){
    $(el).attr('checked', check).prop('checked', check);
  }

  /**
   * Gestion des todos
   */
  function action(action, data){
    $.ajax({
      'type': 'post',
      'url': 'controller/todosController.php',
      'data': data,
      'success': function(response){
        console.log(response);
      }
    });
  }

})(jQuery);