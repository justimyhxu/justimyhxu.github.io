var scripts = document.getElementsByTagName('script');
var myScript = scripts[scripts.length - 1];

var queryString = myScript.src.replace(/^[^\?]+\??/, '');

var params = parseQuery(queryString);

var recruit = 0;

function parseQuery(query) {
    var Params = {};
    if (!query) return Params; // return empty object
    var Pairs = query.split(/[;&]/);
    for (var i = 0; i < Pairs.length; i++) {
        var KeyVal = Pairs[i].split('=');
        if (!KeyVal || KeyVal.length != 2) continue;
        var key = unescape(KeyVal[0]);
        var val = unescape(KeyVal[1]);
        val = val.replace(/\+/g, ' ');
        Params[key] = val;
    }
    return Params;
}


function showPubs(id) {
    var pubsElement = document.getElementById('pubs');
    var selectedElement = document.getElementById('pubs_selected');
    var byDateElement = document.getElementById('pubs_by_date');
    var byTopicElement = document.getElementById('pubs_by_topic');
    var byOralElement = document.getElementById('pubs_oral');
  
    if (id == 0) {
      pubsElement.innerHTML = selectedElement.innerHTML;
      adjustLinkStyles('select0');
    } else if (id == 1) {
      pubsElement.innerHTML = byDateElement.innerHTML;
      adjustLinkStyles('select1');
    } else if (id == 2){
      pubsElement.innerHTML = byTopicElement.innerHTML;
      adjustLinkStyles('select2');
    } else {
        pubsElement.innerHTML = byOralElement.innerHTML;
        adjustLinkStyles('select3');
    }
  
    // Ensure scripts are executed
    loadProjectRenderer();
  }
  
  function adjustLinkStyles(selectedLinkId) {
    var linkIds = ['select0', 'select1', 'select2', 'select3'];
  
    for (var i = 0; i < linkIds.length; i++) {
      var linkElement = document.getElementById(linkIds[i]);
      if (linkIds[i] === selectedLinkId) {
        linkElement.style.textDecoration = 'underline';
        linkElement.style.color = '#000000';
      } else {
        linkElement.style.textDecoration = '';
        linkElement.style.color = '';
      }
    }
  }
  
  function loadProjectRenderer() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = './assets/project_renderer.js';

    script.src += '?t=' + new Date().getTime();

    script.onload = function() {
        this.parentNode.removeChild(this);
    };

    document.getElementsByTagName('head')[0].appendChild(script);
}


function toggle_vis(id) {
    // var e = document.getElementById(id);
    var e = document.getElementsByClassName(id);
    var showText = document.getElementById("showText");
    for (var i = 0; i < e.length; i++) {
        if (e[i].style.display == "none") {
            e[i].style.display = "inline";
            showText.innerHTML = "[Show less]";
        } else {
            e[i].style.display = "none";
            showText.innerHTML = "[Show more]";
        }
    }
}