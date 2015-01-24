#IPython Notebook with Tabs

How to install
--------------
To install this IPython extension, please follow these steps:

1. Copy all files in the projects to `~/.ipython/nbextensions/module-tabs/`.
2. Add new reference in your custom.js. For example: `~/.ipython/profile_default/static/custom/custom.js`
	
```
#!javascript
require(["base/js/events"], function (events) {    
    IPython.load_extensions('module-tabs/module-tabs'); 
});
```