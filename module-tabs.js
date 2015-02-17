// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

var Custom = {};

$([IPython.events]).on('create.Cell', function(cell, index) {

});

var new_page = function () {
    var nextTab = $('#tab-nav.nav-tabs li').size()-1;
    if (nextTab < 0)
        nextTab = 0;
    $('#tab-nav').append('<li class="active" id="nav-id-' + nextTab + 
        '"><a href="#nav-content-'+nextTab+
        '" data-toggle="tab" class="page-a">Page'+nextTab+'</a></li>');
    $('#tab-content').append('<div class="tab-pane tabs-tab-pane active" id="nav-content-'+nextTab+'"></div>');
    $("#new-page").appendTo('#tab-nav');
    
    $('.page-a').off('shown.bs.tab');
    $('.page-a').on('shown.bs.tab', function (e) {
        
        $('.end_space').appendTo(e.target.hash);
        Custom.worksheetIndex = e.target.hash.replace('#nav-content-', '');
        if ($('#nav-content-' + Custom.worksheetIndex).find('div.cell').length == 0) {
            $('.end_space').appendTo(e.target.hash);
            IPython.notebook.insert_cell_below('code');            
        }            

        $('.unrendered').remove();
    });

    $('#tab-nav').find('.page-a').click(function () {
        $(this).attr('contenteditable', 'true');
        IPython.keyboard_manager.disable();
    })
    .blur(function() {
        $(this).attr('contenteditable', 'false');
        IPython.keyboard_manager.enable();
    });

    $('#tab-nav').unbind('click');  
    $('div.cell').appendTo('#nav-content-0');
    $('.end_space').appendTo('#nav-content-0');
}

$([IPython.events]).on('notebook_loaded.Notebook', function() {

    ext_path = '../nbextensions/dir-tabs'
    $("head").append($("<link rel='stylesheet' href='#{ext_path}/module-tabs.css' type='text/css' />"));

    $('.code_cell').appendTo('#notebook-container');

    $('#notebook-container').prepend('<ul class="nav nav-tabs" id="tab-nav"/>');
    var i=0;
    for (var sheet in Custom.content.worksheets) {
        var worksheet = Custom.content.worksheets[i];
        var sheet_name = worksheet.name;
        if (worksheet.name === undefined)
            sheet_name = 'Page ' + i;
        if (i==0)
            $('<li class="active"><a href="#nav-content-' + i + '" data-toggle="tab" class="page-a">' + sheet_name + '</a></li>')
                .appendTo('#tab-nav');
        else
            $('<li><a href="#nav-content-' + i + '" data-toggle="tab" class="page-a">' + sheet_name + '</a></li>')
                .appendTo('#tab-nav');
                
        $('.cell[wsid=' + i + ']').appendTo('#nav-content-' + i);
        i++;
    }

    if (Custom.content.worksheets.length == 0) {
        new_page();
    }
    
    $("#tab-nav").append('<li id="new-page"><a href="javascript:void(0);" class="icon-plus"></a></li>')
        .blur(function() {
            //$(this).attr('contenteditable', 'false');
        })
        .click(function() {
            $('#tab-nav').find('a[data-toggle="tab"]').click(function () {
                $(this).attr('contenteditable', 'true');
                IPython.keyboard_manager.disable();
            })
            .blur(function() {
                $(this).attr('contenteditable', 'false');
                IPython.keyboard_manager.enable();
            });

            $(this).unbind('click');
        });


    $("#new-page").click(function(e) {
        //var nextTab = $('.nav-tabs li').size()+1;
        var nextTab = $('#tab-nav.nav-tabs li').size()-1;
        $('#tab-nav').append('<li id="nav-id-' + nextTab + 
            '"><a href="#nav-content-'+nextTab+
            '" data-toggle="tab" class="page-a">Page'+nextTab+
            '</a></li>');
        $('#tab-content').append('<div class="tab-pane tabs-tab-pane" id="nav-content-'+nextTab+'"></div>');
        $("#new-page").appendTo('#tab-nav');
        
        $('.page-a').off('shown.bs.tab');
        $('.page-a').on('shown.bs.tab', function (e) {
            
            $('.end_space').appendTo(e.target.hash);
            Custom.worksheetIndex = e.target.hash.replace('#nav-content-', '');
            if ($('#nav-content-' + Custom.worksheetIndex).find('div.cell').length == 0) {
                IPython.notebook.insert_cell_below('code');
                $('.end_space').appendTo(e.target.hash);
            }            

            $('.unrendered').remove();
        });

        $('#tab-nav').find('.page-a').click(function () {
            $(this).attr('contenteditable', 'true');
            IPython.keyboard_manager.disable();
        })
        .blur(function() {
            $(this).attr('contenteditable', 'false');
            IPython.keyboard_manager.enable();
        });

        $('#tab-nav').unbind('click');        
    });    
    
    $('.end_space').appendTo('.tabs-tab-pane.active');
    $('#dock').find('.launcher').find('a[href="/tree"]').parent().addClass('active', 'true');

});

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

        if (Custom.content.worksheets.length == 0) {  
            $('#div.cell').appendTo('#tab-content');
        }
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

        if (Custom.content.worksheets.length == 0) {  
            $('#div.cell').appendTo('#tab-content');
        }
    };
});

if (IPython.Notebook !== undefined)
IPython.Notebook.prototype.get_cell_elements = function () {
    return $(".tabs-tab-pane.active").find(".cell");
};

/**
 * Create an HTML and CSS representation of the notebook.
 * 
 * @method create_elements
 */
if (IPython.Notebook !== undefined)
IPython.Notebook.prototype.create_elements = function () {

    var that = this;
    this.element.attr('tabindex','-1');
    this.container = $("<div/>").addClass("container").attr("id", "notebook-container");
    
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



/**
 * Load a notebook from JSON (.ipynb).
 * 
 * This currently handles one worksheet: others are deleted.
 * 
 * @method fromJSON
 * @param {Object} data JSON representation of a notebook
 */
if (IPython.Notebook !== undefined)
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

        if (j == 0) {
            $('<div />').addClass('tab-pane')
            .attr('id', 'nav-content-' + j)
            .appendTo('#tab-content.tab-content')
            .addClass('active')
            .addClass('tabs-tab-pane');
        } else {
            $('<div />').addClass('tab-pane')
            .attr('id', 'nav-content-' + j)
            .appendTo('#tab-content.tab-content')
            .addClass('tabs-tab-pane');
        }

        $('.end_space').appendTo('#nav-content-' + j);
        
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

            Custom.worksheetIndex = 0;
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
if (IPython.Notebook !== undefined) 
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
            worksheets[wsid] = {};
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
if (IPython.Notebook !== undefined)
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
    
