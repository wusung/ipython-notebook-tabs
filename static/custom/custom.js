// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

// Notebook.prototype.find_cell_index = function (cell) {
//     return 0;
// };

var domIsModified = false;

IPython.Notebook.prototype.get_cell_elements = function () {
    // return $("#notebook-container").find(".cell").not('.cell .cell');
    if (domIsModified)
        return $("#notebook-container").find(".cell");
    else 
        return $("#notebook-container").find(".cell").not('.cell .cell');
};

// IPython.Notebook.prototype.get_selected_cell = function () {
//     return $("#content-0 cell");
// };

$([IPython.events]).on('notebook_loaded.Notebook', function() {
    
    domIsModified = true;
    
    var html = '';

    $('#notebook-container').append('<div class="tabbable" id="tabs_table">');
    $('#tabs_table').append('<ul class="nav nav-tabs" id="nav_tabs"></ul>');
    $('#tabs_table').append('<div class="tab-content" id="tab_content">');
    
    var i = 0;
    
    $("#notebook-container .cell").each(function() {
        
        var nav_id = 'nav-id_' + i;
        var content_id = 'content-' + i;
        //$("#ipython-main-app").append('<div id="notebook_pane" class="border-box-sizing"></div>');
        $("#nav_tabs").append('<li id="' + nav_id + '"><a href="#' + content_id + '" data-toggle="tab">Editor ' + i + '</a></li>');
        
        $('#tab_content').append('<div class="tab-pane" id=content-' + i + '></div>');
        $(this).appendTo($("#content-" + i));
        
        i++;
    });
    
    $('.end_space').remove();
    $('nav-id-0').addClass('active');
});