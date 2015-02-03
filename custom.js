// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.



var utils = IPython.utils;


require(["base/js/events"], function (events) {

    // IPython.load_extensions('module-sidebar/module-sidebar'); 
    // IPython.load_extensions('module-tabs/module-tabs'); 
    //IPython.load_extensions('module-tree/module-tree'); 
});

require(["custom/module-tabs", 
		"custom/module-sidebar", 
		'custom/jquery.treeview'], 
		function (events) {

require(['custom/jquery.cookie'], function () {

	'use strict';
	console.log('custom module loaded');

	$('#data.tab-pane').html('');

   	var list_loaded = function (data, status, xhr, param) {
    	var len = data.length;

    	if (len > 0) {
    		$('<div id="directory-tree" class="filetree"></div>')
    			.appendTo('#directory.tab-pane');
    	}
    	for (var i=0; i<len; i++) {
			var item = data[len];
			if (data[i].type === 'directory') {
				$('<li></li>').append('<span class="folder">' + data[i].name + '</span>')
					.appendTo('#directory-tree.filetree');
			} else {
				$('<li></li>').append('<span class="file">' + data[i].name + '</span>')
					.appendTo('#directory-tree.filetree');
			}
    	}

    	$('#directory-tree.filetree').appendTo('#directory.tab-pane');

    	$(document).ready(function(){
			$("#directory-tree").treeview({
				animated: "fast",
				collapsed: true,
				unique: true,
				persist: "cookie",
				toggle: function() {
					window.console && console.log("%o was toggled", this);
				},
				'click.treeview': function () {
					window.console && console.log("%o was toggled", this);
				}
			});    		
    	})
    	
   	}

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


});
});