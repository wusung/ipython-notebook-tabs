#IPython Notebook with Tabs
--------------

## How to install

### Install IPython-notebook-module-tabs
To install this tabs extension, please follow these steps:

1. Copy all files in the projects to `~/.ipython/nbextensions/module-tabs/`.
2. Load the extension in your custom.js. For example: `~/.ipython/profile_default/static/custom/custom.js`
	
```
#!javascript
require(["base/js/events"], function (events) {    
    IPython.load_extensions('module-tabs/module-tabs'); 
});
```

### Install IPython-notebook-tree-remix
To install the tree-remix extension, please follow these steps:

1. Copy templates folder to .ipython to `~/.ipython/templates`.
2. Load the templates in your python notebook configurations file. For example: `~/.ipython/profile_default/ipython_notebook_config.py`
```
#!python
from os.path import expanduser
c = get_config()

# Setup IPython Notebook templates to new
c.NotebookApp.webapp_settings = {'template_path': expanduser("~") + '/.ipython/templates'}
```

3. Paste the contents to custom.js
	
```
#!javascript
if (IPython.NotebookList !== undefined)
IPython.NotebookList.prototype.load_list = function () {

    IPython.NotebookList.prototype.list_loaded = function (data, status, xhr, param) {
        var message = 'Notebook list empty.';
        if (param !== undefined && param.msg) {
            message = param.msg;
        }
        var item = null;
        var len = data.length;
        this.clear_list();
        if (len === 0) {
            item = this.new_notebook_item(0);
            var span12 = item.children().first();
            span12.empty();
            span12.append($('<div style="margin:auto;text-align:center;color:grey"/>').text(message));
        }
        var path = this.notebook_path;
        var offset = 0;
        if (path !== '') {
            item = this.new_notebook_item(0);
            this.add_dir(path, '..', item);
            offset = 1;
        }
        for (var i=0; i<len; i++) {
            if (data[i].type === 'directory') {
                var name = data[i].name;
                item = this.new_notebook_item(i+offset);
                this.add_dir(path, name, item);
            } else {
                var name = data[i].name;
                item = this.new_notebook_item(i+offset);
                this.add_notebook_list_link(path, name, item);
                name = utils.url_path_join(path, name);
                if(this.sessions[name] === undefined){
                    this.add_delete_button(item);
                } else {
                    this.add_shutdown_button(item,this.sessions[name]);
                }
            }
        }

        $('#dock').find('.launcher').find('a[href="/tree"]').parent().addClass('active', 'true');
    };

    var that = this;
    var settings = {
        processData : false,
        cache : false,
        type : "GET",
        dataType : "json",
        success : $.proxy(this.list_loaded, this),
        error : $.proxy( function(xhr, status, error){
            utils.log_ajax_error(xhr, status, error);
            that.list_loaded([], null, null, {msg:"Error connecting to server."});
                         },this)
    };

    var url = utils.url_join_encode(
            this.base_url,
            'api',
            'notebooks',
            this.notebook_path
    );
    $.ajax(url, settings);
};    

if (IPython.NotebookList !== undefined)
IPython.NotebookList.prototype.add_notebook_list_link = function(path, nbname, item) {

    var url = utils.url_join_encode(
                this.base_url,
                "notebooks",
                path,
                nbname
            );
    console.log(url);
    item.data('nbname', nbname);
    item.data('path', path);
    item.find(".item_name").text(nbname);
    item.find(".item_icon").addClass('notebook_icon').addClass('icon-fixed-width');
    item.find("a.item_link")
            .attr('href',
                utils.url_join_encode(
                    this.base_url,
                    "notebooks",
                    path,
                    nbname
                )
            );
};


if (IPython.LayoutManager !== undefined)
	IPython.LayoutManager.prototype.app_height = function() {
        var win = $(window);
        var w = win.width();
        var h = win.height();
        var header_height;
        if ($('div#header').css('display') === 'none') {
            header_height = 0;
        } else {
            header_height = $('div.navbar-default').outerHeight(true);
        }
        var menubar_height;
        if ($('#tools').css('display') === 'none') {
            menubar_height = 0;
        } else {
            menubar_height = $('#tools').outerHeight(true);
        }

        var panel_height = $('.panel-heading').outerHeight(true);

        return h-header_height-menubar_height-panel_height-210; // content height
    };
```