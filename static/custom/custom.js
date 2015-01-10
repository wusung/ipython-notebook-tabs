// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

var afterModifyDom= false;

IPython.Notebook.prototype.get_cell_elements = function () {
    if (afterModifyDom)
        return $("#notebook-container .active").find(".cell");
    else 
        return $("#notebook-container").find(".cell").not('.cell .cell');
};

$([IPython.events]).on('create.Cell', function(cell, index) {
    var i = 0;
    $("#notebook-container .cell").each(function() {
        var nav_id = 'nav-id_' + i;
        var content_id = 'content-' + i;
        $(this).appendTo($('#content-' + i));
        
        i++;
    });
    
    // $('#tab-content .tab-pane').each(function() {
    //     if ($(this).find('div.cell').size() > 1) {
    //         var size = $(this).find('div.cell').size();
    //         for (var i=1; i<size; i++) {
    //             if ($(this).find('div.cell')[i] !== undefined) {
    //                 $($(this).find('div.cell')[i]).appendTo('#tab-content div.tab-pane');
    //             }
    //         }
    //     }
    // });
    
    // $('#tab-content .tab-pane').each(function() {
    //     if ($(this).find('div.cell').size() > 1) {
    //         var size = $(this).find('div.cell').size();
    //         for (var i=1; i<size; i++) {
    //             if ($(this).find('div.cell')[i] !== undefined) {
    //                 $($(this).find('div.cell')[i]).remove();
    //             }
    //         }
    //     }
    // });

});

function render_editor() {
    afterModifyDom = true;
    $('#notebook-container').append('<div class="tabbable" id="tabs_table">');
    $('#tabs_table').append('<ul class="nav nav-tabs" id="nav-tabs"></ul>');
    $('#tabs_table').append('<div class="tab-content" id="tab-content">');
    
    var i = 0;
    $("#notebook-container .cell").each(function() {
        var nav_id = 'nav-id_' + i;
        var content_id = 'content-' + i;
        $("#nav-tabs").append('<li id="' + nav_id + '"><a href="#' + content_id + '" data-toggle="tab">Editor ' + i + '</a></li>');
        $('#tab-content').append('<div class="tab-pane" id="content-' + i + '"></div>');
        $(this).appendTo($("#content-" + i));
        
        i++;
    });
    
    $("#nav-tabs").append('<li id="new-editor"><a href="#" data-toggle="tab">+</a></li>');
    $("#new-editor").click(function(e) {
        var nextTab = $('#nav-tabs li').size()+1;
      	$('#nav-tabs').append('<li id="nav-id_' + nextTab + '"><a href="#content-'+nextTab+'" data-toggle="tab">Editor '+nextTab+'</a></li>');
      	$('#tab-content').append('<div class="tab-pane" id="content-'+nextTab+'"></div>');
      	$("#new-editor").appendTo('#nav-tabs');

      	IPython.notebook.insert_cell_below('code');
      	// make the new tab active
      	// $('#nav-tabs a')[$('#nav-tabs a').size() - 2].tab('show');
    });
    
    $('.end_space').remove();
    $('#nav-id_0').addClass('active');
    $('#content-0').addClass('active');
}

$([IPython.events]).on('notebook_loaded.Notebook', function() {
    render_editor();
});