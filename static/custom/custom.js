// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

var Custom = {};

require(['/static/custom/jquery.cookie.js']);

IPython.Notebook.prototype.get_cell_elements = function () {
    return $(".tab-pane.active").find(".cell");
};

$([IPython.events]).on('create.Cell', function(cell, index) {
    // var i = 0;
    // $("#notebook-container .cell").each(function() {
    //     var nav_id = 'nav-id_' + i;
    //     var content_id = 'content-' + i;
    //     $(this).appendTo($('#content-' + i));
        
    //     i++;
    // });
});

$([IPython.events]).on('notebook_loaded.Notebook', function() {
    $('.code_cell').appendTo('#notebook-container');
    
    $('#notebook-container').prepend('<ul class="nav nav-tabs" id="tab-nav"/>');
    var i=0;
    for (var sheet in Custom.content.worksheets) {
        var worksheet = Custom.content.worksheets[i];
        if (i==0)
            $('<li class="active"><a href="#nav-content-' + i + '" data-toggle="tab">' + worksheet.name + '</a></li>')
                .appendTo('#tab-nav');
        else
            $('<li><a href="#nav-content-' + i + '" data-toggle="tab">' + worksheet.name + '</a></li>')
                .appendTo('#tab-nav');
                
        $('.cell[wsid=' + i + ']').appendTo('#nav-content-' + i);
        i++;
    }
    
    $("#tab-nav").append('<li id="new-page"><a href="javascript:void(0);" class="icon-plus"></a></li>')
        .blur(function() {
            $(this).attr('contenteditable', 'false');
        })
        .dblclick(function() {
            $(this).attr('contenteditable', 'true');
        });
    $("#new-page").click(function(e) {
        //var nextTab = $('.nav-tabs li').size()+1;
        var nextTab = $('.nav-tabs li').size()-1;
        $('#tab-nav').append('<li id="nav-id-' + nextTab + '"><a href="#nav-content-'+nextTab+'" data-toggle="tab">Page'+nextTab+'</a></li>');
      	$('#tab-content').append('<div class="tab-pane" id="nav-content-'+nextTab+'"></div>');
        $("#new-page").appendTo('#tab-nav');
        
        $('a[data-toggle="tab"]').off('shown.bs.tab');
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            $('.end_space').appendTo(e.target.hash);
            Custom.worksheetIndex = e.target.hash.replace('#nav-content-', '');
            if ($('#nav-content-' + Custom.worksheetIndex).find('div.cell').length == 0) {
                IPython.notebook.insert_cell_below('code');
            }
        });
    
    //   	IPython.notebook.insert_cell_below('code');
    //   	// make the new tab active
    //   	// $('#nav-tabs a')[$('#nav-tabs a').size() - 2].tab('show');
    });    
    
    $('.end_space').appendTo('.tab-pane.active');
});


/**
 * Create an HTML and CSS representation of the notebook.
 * 
 * @method create_elements
 */
IPython.Notebook.prototype.create_elements = function () {
    var that = this;
    this.element.attr('tabindex','-1');
    
    this.container = $("<div/>").addClass("container").attr("id", "notebook-container");
    //this.container.append('<div class="tab-content" id="tab-content"></div>');
    //this.container = $('#tab-content');
    
    // this.container = $('<div><div class="tab-content" id="tab-content"></div>')
    //     .addClass("container").attr("id", "notebook-container");
    //this.container = $("<div/>").addClass("container").attr("id", "notebook-container");
    
    // We add this end_space div to the end of the notebook div to:
    // i) provide a margin between the last cell and the end of the notebook
    // ii) to prevent the div from scrolling up when the last cell is being
    // edited, but is too low on the page, which browsers will do automatically.
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
        cell.attr('wsId', Custom.worksheetIndex);
    
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
        this.element = cell;
        this.output_area = new IPython.OutputArea(output, true);
        this.completer = new IPython.Completer(this);
    };        
    
    /**
     * Create the DOM element of the TextCell
     * @method create_element
     * @private
     */
    IPython.TextCell.prototype.create_element = function () {
        IPython.Cell.prototype.create_element.apply(this, arguments);

        var cell = $("<div>").addClass('cell text_cell border-box-sizing');
        cell.attr('tabindex','2');
        cell.attr('wsId', Custom.worksheetIndex);

        var prompt = $('<div/>').addClass('prompt input_prompt');
        cell.append(prompt);
        var inner_cell = $('<div/>').addClass('inner_cell');
        this.celltoolbar = new IPython.CellToolbar(this);
        inner_cell.append(this.celltoolbar.element);
        var input_area = $('<div/>').addClass('input_area');
        this.code_mirror = new CodeMirror(input_area.get(0), this.cm_config);
        // The tabindex=-1 makes this div focusable.
        var render_area = $('<div/>').addClass('text_cell_render border-box-sizing').
            addClass('rendered_html').attr('tabindex','-1');
        inner_cell.append(input_area).append(render_area);
        cell.append(inner_cell);
        this.element = cell;
    };
});

$([IPython.events]).on("app_initialized.NotebookApp", function () {

});

/**
 * Load a notebook from JSON (.ipynb).
 * 
 * This currently handles one worksheet: others are deleted.
 * 
 * @method fromJSON
 * @param {Object} data JSON representation of a notebook
 */

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

    $('<div class="tab-content" id="tab-content"/>').appendTo('#notebook-container');
    for (var j=0; j<content.worksheets.length; j++) {

        //$('#notebook-container')
        
        if (j == 0) {
            $('<div />').addClass('tab-pane')
            .attr('id', 'nav-content-' + j)
            .appendTo('.tab-content')
            .addClass('active');
        } else {
            $('<div />').addClass('tab-pane')
            .attr('id', 'nav-content-' + j)
            .appendTo('.tab-content');
        }
        
        var worksheet = content.worksheets[j];
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

                Custom.worksheetIndex = j;    
                new_cell = this.insert_cell_at_index(cell_data.cell_type, i);
                new_cell.fromJSON(cell_data);
                if (new_cell.cell_type == 'code' && !new_cell.output_area.trusted) {
                    trusted = false;
                }
            }
        }
    }
    if (trusted != this.trusted) {
        this.trusted = trusted;
        $([IPython.events]).trigger("trust_changed.Notebook", trusted);
    }
};
    
var get_all_cells = function() {
    return $('div.cell').toArray().map(function (e) {
        return $(e).data("cell");
    });
}    
    
/**
 * Dump this notebook into a JSON-friendly object.
 * 
 * @method toJSON
 * @return {Object} A JSON-friendly representation of this notebook.
 */
IPython.Notebook.prototype.toJSON = function () {
    var cells = get_all_cells();
    var ncells = cells.length;
    var cell_array = new Array(ncells);
    var trusted = true;

    var worksheets = [];
    for (var i=0; i<cells.length; i++) {
        var cell = cells[i];
        if (cell.cell_type == 'code' && !cell.output_area.trusted) {
            trusted = false;
        }
        
        var wsid = 0;
        if ($(cell.element).attr('wsid') === undefined) {
            cell_array[i] = cell.toJSON();
        } else {
            wsid = $(cell.element).attr('wsid')
        }

        if (worksheets[wsid] === undefined) {
            worksheets.push({});
        }
        
        if (worksheets[wsid].cells === undefined) {
            worksheets[wsid].cells = [];
        }
        worksheets[wsid]['name'] = $('a[href="#nav-content-' + wsid + '"]').html();
        worksheets[wsid].cells.push(cell.toJSON()); 
    }

    var data = {
        worksheets : worksheets,
        metadata : this.metadata
    };
    
    if (trusted != this.trusted) {
        this.trusted = trusted;
        $([IPython.events]).trigger("trust_changed.Notebook", trusted);
    }
    return data;
}; 

/**
 * Once a session is started, link the code cells to the kernel and pass the 
 * comm manager to the widget manager
 *
 */
IPython.Notebook.prototype._session_started = function(){
    this.kernel = this.session.kernel;
    var ncells = get_all_cells().length;
    for (var i=0; i<ncells; i++) {
        var cell = get_all_cells()[i];
        if (cell instanceof IPython.CodeCell) {
            cell.set_kernel(this.session.kernel);
        }
    }
};
    
$(function() {
    
});
