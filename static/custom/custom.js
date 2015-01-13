// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

var afterModifyDom= false;

var Custom = {};

// require(['/static/custom/jquery.cookie.js'], function() {
    
// }); 

require(['/static/custom/jquery.cookie.js']);



/**
 * Load a notebook from JSON (.ipynb).
 * 
 * This currently handles one worksheet: others are deleted.
 * 
 * @method fromJSON
 * @param {Object} data JSON representation of a notebook
 */
 
// IPython.Notebook.prototype.fromJSON = function (data) {
//     var content = data.content;
//     var ncells = this.ncells();
//     var i;
//     for (i=0; i<ncells; i++) {
//         // Always delete cell 0 as they get renumbered as they are deleted.
//         this.delete_cell(0);
//     }
//     // Save the metadata and name.
//     this.metadata = content.metadata;
//     this.notebook_name = data.name;
//     var trusted = true;
    
//     // Only handle 1 worksheet for now.
//     for (var worksheet in content.worksheets) {
//         if (worksheet !== undefined) {
//             if (worksheet.metadata) {
//                 this.worksheet_metadata = worksheet.metadata;
//             }
//             var new_cells = worksheet.cells;
//             ncells = new_cells.length;
//             var cell_data = null;
//             var new_cell = null;
//             for (i=0; i<ncells; i++) {
//                 cell_data = new_cells[i];
//                 // VERSIONHACK: plaintext -> raw
//                 // handle never-released plaintext name for raw cells
//                 if (cell_data.cell_type === 'plaintext'){
//                     cell_data.cell_type = 'raw';
//                 }
        
//                 new_cell = this.insert_cell_at_index(cell_data.cell_type, i);
//                 new_cell.fromJSON(cell_data);
//                 if (new_cell.cell_type == 'code' && !new_cell.output_area.trusted) {
//                     trusted = false;
//                 }
//             }
//         }
//     }
//     if (trusted != this.trusted) {
//         this.trusted = trusted;
//         $([IPython.events]).trigger("trust_changed.Notebook", trusted);
//     }
//     if (content.worksheets.length > 1) {
//         IPython.dialog.modal({
//             title : "Multiple worksheets",
//             body : "This notebook has " + data.worksheets.length + " worksheets, " +
//                 "but this version of IPython can only handle the first.  " +
//                 "If you save this notebook, worksheets after the first will be lost.",
//             buttons : {
//                 OK : {
//                     class : "btn-danger"
//                 }
//             }
//         });
//     }
// };

/**
 * Dump this notebook into a JSON-friendly object.
 * 
 * @method toJSON
 * @return {Object} A JSON-friendly representation of this notebook.
 */
// IPython.Notebook.prototype.toJSON = function () {
//     var cells = this.get_cells();
//     var ncells = cells.length;
//     var cell_array = new Array(ncells);
//     var trusted = true;
//     for (var i=0; i<ncells; i++) {
//         var cell = cells[i];
//         if (cell.cell_type == 'code' && !cell.output_area.trusted) {
//             trusted = false;
//         }
//         cell_array[i] = cell.toJSON();
//     }
//     var data = {
//         // Only handle 1 worksheet for now.
//         worksheets : [{
//             cells: cell_array,
//             metadata: this.worksheet_metadata
//         }],
//         metadata : this.metadata
//     };
//     if (trusted != this.trusted) {
//         this.trusted = trusted;
//         $([IPython.events]).trigger("trust_changed.Notebook", trusted);
//     }
//     return data;
// };

IPython.Notebook.prototype.get_cell_elements = function () {
    if (afterModifyDom)
        return $("#notebook-container .active").find(".cell");
    else 
        return $("#notebook-container").find(".cell").not('.cell .cell');
};

// $([IPython.events]).on('create.Cell', function(cell, index) {
//     var i = 0;
//     $("#notebook-container .cell").each(function() {
//         var nav_id = 'nav-id_' + i;
//         var content_id = 'content-' + i;
//         $(this).appendTo($('#content-' + i));
        
//         i++;
//     });
// });

// function render_editor() {
    
//     afterModifyDom = true;
//     $('#notebook-container').append('<div class="tabbable" id="tabs_table">');
//     $('#tabs_table').append('<ul class="nav nav-tabs" id="nav-tabs"></ul>');
//     $('#tabs_table').append('<div class="tab-content" id="tab-content">');
    
//     var i = 0;
//     $("#notebook-container .cell").each(function() {
//         var nav_id = 'nav-id_' + i;
//         var content_id = 'content-' + i;
//         $("#nav-tabs").append('<li id="' + nav_id + '"><a href="#' + content_id + '" data-toggle="tab">Editor ' + i + '</a></li>');
//         $('#tab-content').append('<div class="tab-pane" id="content-' + i + '"></div>');
//         $(this).appendTo($("#content-" + i));
        
//         i++;
//     });
    
//     $("#nav-tabs").append('<li id="new-editor"><a href="#" data-toggle="tab">+</a></li>');
//     $("#new-editor").click(function(e) {
//         var nextTab = $('#nav-tabs li').size()+1;
//       	$('#nav-tabs').append('<li id="nav-id_' + nextTab + '"><a href="#content-'+nextTab+'" data-toggle="tab">Editor '+nextTab+'</a></li>');
//       	$('#tab-content').append('<div class="tab-pane" id="content-'+nextTab+'"></div>');
//       	$("#new-editor").appendTo('#nav-tabs');

//       	IPython.notebook.insert_cell_below('code');
//       	// make the new tab active
//       	// $('#nav-tabs a')[$('#nav-tabs a').size() - 2].tab('show');
//     });
    
//     $('.end_space').remove();
//     $('#nav-id_0').addClass('active');
//     $('#content-0').addClass('active');
// }

$([IPython.events]).on('notebook_loaded.Notebook', function() {
    // render_editor();
    
    $('.code_cell').appendTo('#notebook-container');
    
        $('#notebook-container').prepend('<ul class="nav nav-tabs" id="tab-nav"/>');
        var i=0;
        for (var sheet in Custom.content.worksheets) {
            if (i==0)
                $('<li class="active"><a href="#nav-content" data-toggle="tab"> Page' + i + '</a></li>').appendTo('#tab-nav');
            else
                $('<li><a href="#nav-content" data-toggle="tab"> Page' + i + '</a></li>').appendTo('#tab-nav');
            i++;
        }
        
        $('.end_space').appendTo('#notebook-container');
});

    /**
     * Create an HTML and CSS representation of the notebook.
     * 
     * @method create_elements
     */
    IPython.Notebook.prototype.create_elements = function () {
        var that = this;
        this.element.attr('tabindex','-1');
        
        //this.container = $('<div class="tab-content" id="tab-content"><div class="container" id="notebook-container"></div></div>');
        this.container = $("<div/>").addClass("container").attr("id", "notebook-container");
        //this.container.append('<div class="tab-content" id="tab-content"></div>');
        

        
        //this.container = $('#tab-content');
        
        // this.container = $('<div><div class="tab-content" id="tab-content"></div>')
        //     .addClass("container").attr("id", "notebook-container");
        //this.container = $("<div/>").addClass("container").attr("id", "notebook-container");
        
        // We add this end_space div to the end of the notebook div to:
        // i) provide a margin between the last cell and the end of the notebook
        // ii) to prevent the div from scrolling up when the last cell is being
        // edited, but is too low on the page, which browsers will do automatically. ,          0 b0. 
        var end_space = $('<div/>').addClass('end_space');
        end_space.dblclick(function (e) {
            var ncells = that.ncells();
            that.insert_cell_below('code',ncells-1);
        });
        this.element.append(this.container);
        this.container.append(end_space);    
    };


$([IPython.events]).on('notebook_loading.Notebook', function() {
    /** @method create_element */
    IPython.CodeCell.prototype.create_element = function () {
        IPython.Cell.prototype.create_element.apply(this, arguments);
    
        var cell =  $('<div></div>').addClass('cell border-box-sizing code_cell');
        cell.attr('tabindex','2');
    
        var input = $('<div></div>').addClass('input');
        var prompt = $('<div/>').addClass('prompt input_prompt');
        var inner_cell = $('<div/>').addClass('inner_cell');
        this.celltoolbar = new IPython.CellToolbar(this);
        inner_cell.append(this.celltoolbar.element);
        var input_area = $('<div/>').addClass('input_area');
        this.code_mirror = CodeMirror(input_area.get(0), this.cm_config);
        $(this.code_mirror.getInputField()).attr("spellcheck", "false");
        inner_cell.append(input_area);
        input.append(prompt).append(inner_cell);
    
        var widget_area = $('<div/>')
            .addClass('widget-area')
            .hide();
        this.widget_area = widget_area;
        var widget_prompt = $('<div/>')
            .addClass('prompt')
            .appendTo(widget_area);
        var widget_subarea = $('<div/>')
            .addClass('widget-subarea')
            .appendTo(widget_area);
        this.widget_subarea = widget_subarea;
        var widget_clear_buton = $('<button />')
            .addClass('close')
            .html('&times;')
            .click(function() {
                widget_area.slideUp('', function(){ widget_subarea.html(''); });
                })
            .appendTo(widget_prompt);
    
        var output = $('<div></div>');
        cell.append(input).append(widget_area).append(output);
        //cell.appendTo('#tab-content');
        this.element = cell;
        this.output_area = new IPython.OutputArea(output, true);
        this.completer = new IPython.Completer(this);
    };        
    

});

// $([IPython.events]).on("app_initialized.NotebookApp", function () {
    

// });

    
    var set_content = function (data) {
        this.content = data;
    }
    
    var set_content = function () {
        return this.content;
    }

    IPython.Notebook.prototype.fromJSON = function (data) {
        Custom.content = data.content;
        var content = data.content;
        var ncells = this.ncells();
        var i;
        for (i=0; i<ncells; i++) {
            // Always delete cell 0 as they get renumbered as they are deleted.
            this.delete_cell(0);
        }
        // Save the metadata and name.
        this.metadata = content.metadata;
        this.notebook_name = data.name;
        var trusted = true;

        // Only handle 1 worksheet for now.
        var worksheet = content.worksheets[get_selected_worksheet_index()];
        if (worksheet !== undefined) {
            if (worksheet.metadata) {
                this.worksheet_metadata = worksheet.metadata;
            }
            var new_cells = worksheet.cells;
            ncells = new_cells.length;
            var cell_data = null;
            var new_cell = null;
            for (i=0; i<ncells; i++) {
                cell_data = new_cells[i];
                // VERSIONHACK: plaintext -> raw
                // handle never-released plaintext name for raw cells
                if (cell_data.cell_type === 'plaintext'){
                    cell_data.cell_type = 'raw';
                }

                new_cell = this.insert_cell_at_index(cell_data.cell_type, i);
                new_cell.fromJSON(cell_data);
                if (new_cell.cell_type == 'code' && !new_cell.output_area.trusted) {
                    trusted = false;
                }
            }
        }
        if (trusted != this.trusted) {
            this.trusted = trusted;
            $([IPython.events]).trigger("trust_changed.Notebook", trusted);
        }
        if (content.worksheets.length > 1) {
            IPython.dialog.modal({
                title : "Multiple worksheets",
                body : "This notebook has " + data.worksheets.length + " worksheets, " +
                    "but this version of IPython can only handle the first.  " +
                    "If you save this notebook, worksheets after the first will be lost.",
                buttons : {
                    OK : {
                        class : "btn-danger"
                    }
                }
            });
        }
    };
    
    var get_selected_worksheet_index = function() {
        return 0;
    }