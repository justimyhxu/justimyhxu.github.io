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


function showPubs(id, targetAnchor) {
    var pubsElement = document.getElementById('pubs');
    var recentElement = document.getElementById('pubs_recent');
    var selectedElement = document.getElementById('pubs_selected');
    var byDateElement = document.getElementById('pubs_by_date');
    var byTopicElement = document.getElementById('pubs_by_topic');
    var byOralElement = document.getElementById('pubs_oral');

    // if (id == -1) {
    //   pubsElement.innerHTML = pubsElement.innerHTML;
    //   adjustLinkStyles('select-1');
    // }
    if (id == 0) {
      pubsElement.innerHTML = recentElement.innerHTML;
      adjustLinkStyles('select0');
    } else if (id == 1) {
      pubsElement.innerHTML = selectedElement.innerHTML;
      adjustLinkStyles('select1');
    } else if (id == 2){
      pubsElement.innerHTML = byOralElement.innerHTML;
      adjustLinkStyles('select2');
    } else if (id == 3){
      pubsElement.innerHTML = byDateElement.innerHTML;
      adjustLinkStyles('select3');
    } else if (id == 4){
      pubsElement.innerHTML = byTopicElement.innerHTML;
      adjustLinkStyles('select4');
    }

    // Ensure scripts are executed
    loadProjectRenderer();

    // If target anchor is provided, scroll to it after content is loaded
    if (targetAnchor) {
      setTimeout(function() {
        var targetElement = document.getElementById(targetAnchor);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 150);
    }
  }
  
  function adjustLinkStyles(selectedLinkId) {
    var linkIds = ['select0', 'select1', 'select2', 'select3', 'select4'];
  
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

// Navigation Bar Functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToSection(sectionId) {
    var targetElement = document.getElementById(sectionId);
    if (targetElement) {
        var navbarHeight = 60;
        var targetPosition = targetElement.offsetTop - navbarHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function toggleMobileMenu() {
    var navbarMenu = document.querySelector('.navbar-menu');
    var navbarToggle = document.querySelector('.navbar-toggle');

    if (navbarMenu) {
        navbarMenu.classList.toggle('mobile-active');

        // Animate hamburger menu
        if (navbarToggle) {
            navbarToggle.classList.toggle('active');
        }
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    var navbarMenu = document.querySelector('.navbar-menu');
    var navbarToggle = document.querySelector('.navbar-toggle');
    var navbar = document.querySelector('.fixed-navbar');

    if (navbarMenu && navbarMenu.classList.contains('mobile-active')) {
        if (!navbar.contains(event.target)) {
            navbarMenu.classList.remove('mobile-active');
            if (navbarToggle) {
                navbarToggle.classList.remove('active');
            }
        }
    }
});

// Highlight active navigation item based on scroll position
function updateActiveNavItem() {
    var sections = ['about', 'publications', 'news', 'experience'];
    var navItems = document.querySelectorAll('.navbar-item');
    var scrollPosition = window.scrollY + 80;

    for (var i = 0; i < sections.length; i++) {
        var section = document.getElementById(sections[i]);
        if (section) {
            var sectionTop = section.offsetTop;
            var sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Remove active class from all nav items
                navItems.forEach(function(item) {
                    item.classList.remove('active');
                });

                // Add active class to current nav item
                var activeNavItem = document.querySelector('.navbar-item[href="#' + sections[i] + '"]');
                if (activeNavItem) {
                    activeNavItem.classList.add('active');
                }
                break;
            }
        }
    }
}

// Add scroll event listener
window.addEventListener('scroll', updateActiveNavItem);