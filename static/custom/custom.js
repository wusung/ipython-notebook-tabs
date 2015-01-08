// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

require([
    'base/js/namespace',
    'base/js/utils',
], function(IPython) {
    "use strict";
    
});


$([IPython.events]).on('notebook_loaded.Notebook', function() {
    // $("#notebook_panel").remove();
    $("#ipython-main-app").append('<div id="notebook_pane" class="border-box-sizing"></div>');
    
    var html = '';
    html = '<ul class="nav nav-tabs" id="nav_tabs">';
    html += '<li class="active">';
    //html += '<a href="#tab-' + itemLink + '" data-url="' + itemLink + '" >' + itemName + '</a>';
    html += '<a href="#tab-1">Notebook1<button class="close" type="button">×</button></a>';
    html += '</li>';
    
    html += '<li>';
    //html += '<a href="#tab-' + itemLink + '" data-url="' + itemLink + '" >' + itemName + '</a>';
    html += '<a href="#x">+</a>';
    html += '</li>';
    
    html += '</ul>';
    $("#notebook_pane").append(html);
    
    html = '<div class="tab-content" id="tab_content">';
    html += '<div id="tab-1" class="tab-pane active"></div>';
    html += '<div id="tab-2" class="tab-pane active">Tab2</div>';
    html += '</div>';
    $("#notebook_pane").append(html);
    
    $("#notebook_panel").appendTo("#tab-1");
});