
var utils = IPython.utils;

var nbname = '';

;(function () {

require(["custom/module-tabs", 
		"custom/module-sidebar",
		'custom/jquery.cookie',
		'custom/jquery.treeview',
		'custom/jquery.treeview.async',
		'custom/jquery.ui.position',
		'custom/jquery.contextMenu'
		], 
		function (events) {

//require(['custom/jquery.cookie'], function () {

	'use strict';
	window.console && console.log('custom module loaded');

	//IPython.session_list.load_sessions();

   	var list_loaded = function (data, status, xhr, param) {
   		
    	var len = data.length;

    	if (len > 0) {
    		$('<ul id="directory-tree" class="filetree"></ul>')
    			.appendTo('#directory.tab-pane');
    	}
    	for (var i=0; i<len; i++) {
			var item = data[len];
			if (data[i].type === 'directory') {
				$('<li class="context-menu-one box menu-1"></li>')
					//.append('<span class="folder"><a href="' + data[i].name + '">' + data[i].name + '</a></span>')
					.append('<span class="folder">' + data[i].name + '</span>' + 
						'<ul><li><span class="placeholder">&nbsp;</span></li></ul>')
					.appendTo('#directory-tree');
			} else {
				$('<li class=" context-menu-one box menu-1"></li>')
					.append('<span class="file"><a href="' + data[i].name + '">' + data[i].name + '</a></span>')
					//.append('<span class="file">' + data[i].name + '</span>')
					.appendTo('#directory-tree');
			}
    	}

    	//$('#directory-tree.filetree').appendTo('#directory.tab-pane');
    	$('#directory').tab('show');
    	$('#directory-tree .file a').click(function () {

    	});

		$('#directory-tree').treeview({
			animated: "fast",
			collapsed: true,
			unique: true,
			persist: "cookie",
			"toggle": function() {
				window.console && console.log("%o was toggled", this);
			}
		});

		$.contextMenu({
	        selector: '.context-menu-one', 
	        callback: function(key, options) {
	            var m = "clicked: " + key;
	            window.console && console.log(m);
				if (key == 'delete') {
					nbname = $(this).find('a').html();
					delete_notebook();
		        } else if (key == 'add') {
		        	new_notebook();
		        } else if (key == 'shutdown') {
		        	shutdown_notebook();
		        }
	        },
	        items: {
	            "delete": {name: "Delete", icon: "delete"},
	            "add": {name: "Add", icon: "add"},
	            "rename": {name: "Rename", icon: "quit"},
	            "shutdown": {name: "Shutdown", icon: "quit"}
	        },
			build: function($trigger, e){
			  return {
			    callback: function(){},
			    items: {
			        
			    }
			  };
			}
	    });
	    
	    $('.context-menu-one').on('click', function(e){
	        console.log('clicked', this);
	        
	    })
   	};

    var settings = {
        processData : false,
        cache : false,
        type : "GET",
        dataType : "json",
        success : $.proxy(list_loaded, this),
        error : $.proxy( function(xhr, status, error){
            utils.log_ajax_error(xhr, status, error);
            list_loaded([], null, null, {msg:"Error connecting to server."});
                         },this)
    };

    var url = utils.url_join_encode(
                '/',
                'api',
                'notebooks'
        );

	$.ajax(url, settings);

	var shutdown_notebook = function () {
        var settings = {
            processData : false,
            cache : false,
            type : "DELETE",
            dataType : "json",
            success : function () {
                //that.load_sessions();
            },
            error : utils.log_ajax_error,
        };
        var url = utils.url_join_encode(
            '/',
            'api/sessions',
            session
        );
        $.ajax(url, settings);
	}

	var delete_notebook = function () {

		var message = 'Are you sure you want to permanently delete the notebook: ' + nbname + '?';
		IPython.dialog.modal({
			title : "Delete notebook",
			body : message,
			buttons : {
				Delete: {
					class: "btn-danger",
					click: function () {
						var settings = {
				            processData : false,
				            cache : false,
				            type : "DELETE",
				            dataType : "json",
				            success : function (data, status, xhr) {
				                //parent_item.remove();
				                $('a[href="' + nbname + '"').parent().parent().remove();
				            },
				            error : utils.log_ajax_error,
				        };
				        var url = utils.url_join_encode(
				            '/',
				            'api/notebooks',
				            "",
				            nbname
				        );
				        $.ajax(url, settings);
					}
				},
				Cancel: {}
			}
		});
	}

	var new_notebook = function(){
        var path = '';
        var base_url = '/';
        var settings = {
            processData : false,
            cache : false,
            type : "POST",
            dataType : "json",
            async : false,
            success : function (data, status, xhr) {
                var notebook_name = data.name;
                window.location.replace(utils.url_join_encode(
                        base_url,
                        'notebooks',
                        path,
                        notebook_name));
            },
            error : $.proxy(new_notebook_failed, this),
        };
        var url = utils.url_join_encode(
            base_url,
            'api/notebooks',
            path
        );
        $.ajax(url, settings);
    };

    var new_notebook_failed = function (xhr, status, error) {
        utils.log_ajax_error(xhr, status, error);
        var msg;
        if (xhr.responseJSON && xhr.responseJSON.message) {
            msg = xhr.responseJSON.message;
        } else {
            msg = xhr.statusText;
        }
        IPython.dialog.modal({
            title : 'Creating Notebook Failed',
            body : "The error was: " + msg,
            buttons : {'OK' : {'class' : 'btn-primary'}}
        });
    }
//});
});

}).call(this);