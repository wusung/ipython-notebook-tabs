#IPython Notebook with Tabs

How to install
--------------

1. Copy all files in the projects to `~/.ipython/nbextensions/module-tabs/`.
2. Add new reference in your custom.js. For example: `~/.ipython/profile_default/static/custom`
	require(["base/js/events"], function (events) {    
    	IPython.load_extensions('module-tabs/module-tabs'); 
	});
