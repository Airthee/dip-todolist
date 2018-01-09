(function(){
  // HXMLHttpRequest.readyState values
  var ajaxHttp = {
    states: {
      UNSENT: 0,
      OPENED: 1,
      HEADERS_RECEIVED: 2,
      LOADING: 3,
      DONE: 4
    },
    httpStatus: {
      OK: 200,
      BAD_REQUESET: 300,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      SERVER_ERROR: 500
    }
  };

  var reloadPage = function(){
    window.location.href="";
  }

  /**
   * Envoi une requête ajax
   */
  var ajax = function(options){
    if(!typeof options.url=='undefined') throw "'url' must be defined";

    // Création de l'objet xhttp
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
      if(this.readyState==ajaxHttp.states.DONE){
        switch(this.status){
          case ajaxHttp.httpStatus.OK:
            if(typeof options.success == 'function')
              options.success.call(null, this.response);
          break;
        }
      }
    }

    // POST
    if(typeof options.data != 'undefined'){
      var params = "";
      var data;
      var keys = Object.keys(options.data);
      var dataLenght = keys.length;
      keys.forEach(function(attr, i){
        data = options.data[attr];
        params+=attr+"="+(typeof data=='object' ? JSON.stringify(data) : data); // Ajoute la paramètre

        // Ajoute & si on n'est pas sur le dernier élément
        if(i < dataLenght-1)
          params += "&";
      });

      // Envoi la requête
      xhttp.open("POST", options.url, true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send(params);
    }

    // GET
    else{
      xhttp.open("GET", options.url, true);
      xhttp.send();
    }
  }

  /**
   * Charge les todos
   */
  var loadList = function(){
    // Récupère la liste
    var url = 'index.php?page=todos';
    ajax({
      'url': url,
      'data': {
        'action': 'getHtml'
      },
      'success': function(response){
        response = JSON.parse(response);
        if(response.success){
          document.getElementById('listContainer').innerHTML = response.data;
        }
      }
    });

    // Vide le champ et focus
    var $inputLibelle = document.getElementById('inputLibelle');
    $inputLibelle.value = "";
    $inputLibelle.focus();
  }

  /**
   * Actions à réaliser à la soumission d'un formulaire
   */
  var onFormSubmit = function(event){
    var form = this;
    event.preventDefault();
    var action = form.attributes['data-action'].value; // Récupére l'action

    // Récupération des valeurs des champs
    var values = {};
    var element, name, value;
    for(var j=0; j<form.elements.length; j++){
      element = form.elements[j];

      // Si c'est une checkbox et qu'elle n'est pas cochée on continue
      if(element.type=='checkbox' && element.checked==false)
        continue;

      // Transforme les champs en données
      name = element.name;
      value = element.value;
      if (typeof name!='undefined' && name.length>0){
        switch(typeof values[name]){
          case 'undefined':
            values[name] = (typeof value!='undefined' ? value : null);
          break;

          case 'string':
            values[name] = [values[name]];
            values[name].push(typeof value!='undefined' ? value : null);
          break;

          case 'object':
            values[name].push(typeof value!='undefined' ? value : null);
          break;

          default:
            throw "Type non supporté";
        }
      }
    }

    // Création des données
    var data = {
      'url': '/index.php?page=todos',
      'data': {
        'action': action,
        'data': values
      }
    };

    // Callback success si classe reload-list-on-submit
    if(this.classList.contains('reload-list-on-submit')){
      data.success = loadList;
    }

    // Envoi le formulaire
    ajax(data);
  };

  /**
   * Au changement de la valeur d'un .jscolor on change l'attribut CSS renseigné
   */
  var initJSColor = function(){
    var jscolor = document.getElementsByClassName('jscolor');
    var element;
    for(var i=0; i<jscolor.length; i++){
      element = jscolor[i];
      var dataValue = element.attributes['data-target'].value;

      // Récupère la valeur depuis les cookies
      var value = getCookie('color.'+dataValue);
      // element.jscolor.fromString(value);
    }
  }

  /**
   * A la soumission d'un formulaire on envoi les données en AJAX
   */
  var initFormEvents = function(){
    var forms = document.getElementsByClassName("form-ajax");

    // Déclaration des variables utilisées dans les boucles
    var form, i, action;

    for(i=0; i<forms.length; i++){
      form = forms[i];
      // A la soumission du formulaire
      if (typeof form.attributes['data-action']!='undefined')
        form.addEventListener('submit', onFormSubmit,false);
    }
  }

  /**
   * Initialise les élements qui rechargent la page au click
   */
  var initReloadElements = function(){
    var reloads = document.getElementsByClassName('reload');
    for(var i=0; i<reloads.length; i++)
      reloads[i].addEventListener('click', reloadPage, false);
  }

  /**
   * Initialise les évènements
   */
  var initEvents = function(){
    initReloadElements();
    initFormEvents();
  }

  // Lancement du script
  loadList();
  initEvents();
  initJSColor();
})();

/********************** Fonctions ********************/
function onJSColorChanged($this){
  var element = $this.valueElement;
  var dataValue = element.attributes['data-target'].value;
  var split = dataValue.split('.');
  var targetSelect = split[0];
  var cssAttribut = split[1];
  var color = '#'+element.jscolor;

  // Change le css
  var targets = document.getElementsByClassName(targetSelect);
  var target;
  for(var j=0; j<targets.length; j++){
    target = targets[j];
    target.style[cssAttribut] = color;
  }

  // Ecrit les cookies
  setCookie('color.'+dataValue, color);
}

function getCookie(name){
  console.log("Récupération de " +name);
  var name = name + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

function setCookie(name, value){
  var d = new Date();
  d.setTime(d.getTime() + (30*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = name+"="+value+";" + expires;
}