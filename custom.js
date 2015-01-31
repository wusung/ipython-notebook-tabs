// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

require(["base/js/events"], function (events) {

    // IPython.load_extensions('module-sidebar/module-sidebar'); 
    // IPython.load_extensions('module-tabs/module-tabs'); 
    //IPython.load_extensions('module-tree/module-tree'); 
});

require(["custom/module-tabs"], function (events) {
	console.log('module-tabs loaded');

});

require(["custom/module-sidebar"], function (events) {
	console.log('module-sidebar loaded');
});

