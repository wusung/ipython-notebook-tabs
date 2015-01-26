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