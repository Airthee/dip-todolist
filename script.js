var selectAllSelector = '#selectAll';
var checkBoxesSelector = "#listTaches input[type='checkbox']";

(function($){
	$(function(){
		// Focus
		$('#inputLibelle').focus();

    // Check all
		$('#selectAll').on('change', initSelectAll);
    initSelectAll();

    $('.reload').on('click', function(){
      window.location.href = "";
    });
  });

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

})(jQuery);