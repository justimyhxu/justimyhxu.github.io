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

// function showPubs(id) {
//   if (id == 0) {
//     document.getElementById('pubs').innerHTML = document.getElementById('pubs_selected').innerHTML;
//     document.getElementById('select0').style = 'text-decoration:underline;color:#000000';
//     document.getElementById('select1').style = '';
//     document.getElementById('select2').style = '';
//   } else if (id == 1) {
//     document.getElementById('pubs').innerHTML = document.getElementById('pubs_by_date').innerHTML;
//     document.getElementById('select1').style = 'text-decoration:underline;color:#000000';
//     document.getElementById('select0').style = '';
//     document.getElementById('select2').style = '';
//   } else {
//     document.getElementById('pubs').innerHTML = document.getElementById('pubs_by_topic').innerHTML;
//     document.getElementById('select2').style = 'text-decoration:underline;color:#000000';
//     document.getElementById('select0').style = '';
//     document.getElementById('select1').style = '';
//   }
// }



function showRecruit() {
  if (recruit == 0) {
    document.getElementById('recruit').style='display:inline-block';
  } else {
    document.getElementById('recruit').style='display:none';
  }
  recruit = 1 - recruit;
}



function showPubs(id) {
    var pubsElement = document.getElementById('pubs');
    var selectedElement = document.getElementById('pubs_selected');
    var byDateElement = document.getElementById('pubs_by_date');
    var byTopicElement = document.getElementById('pubs_by_topic');
  
    if (id == 0) {
      pubsElement.innerHTML = selectedElement.innerHTML;
      adjustLinkStyles('select0');
    } else if (id == 1) {
      pubsElement.innerHTML = byDateElement.innerHTML;
      adjustLinkStyles('select1');
    } else {
      pubsElement.innerHTML = byTopicElement.innerHTML;
      adjustLinkStyles('select2');
    }
  
    // Ensure scripts are executed
    executeScripts(pubsElement);
  }
  
  function adjustLinkStyles(selectedLinkId) {
    var linkIds = ['select0', 'select1', 'select2'];
  
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
  
//   function executeScripts(element) {
//     var scripts = element.getElementsByTagName('script');
//     for (var i = 0; i < scripts.length; i++) {
//       var script = document.createElement('script');
//       script.type = 'text/javascript';
//       script.text = scripts[i].text;
//       element.appendChild(script).parentNode.removeChild(script);
//     }
//   }
  
function executeScripts(element) {
    var scripts = element.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      eval(scripts[i].innerText);
    }
}