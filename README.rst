IPython Notebook Module Tabs
----------------------------

.. image:: https://badge.fury.io/py/bookstore.png
   :target: http://badge.fury.io/py/bookstore

.. image:: https://travis-ci.org/rgbkrk/bookstore.png?branch=master
   :target: https://travis-ci.org/rgbkrk/bookstore

Add multiple checkpoints for IPython.

*Add your provider with a pull request!*

**Note: IPython Notebook Module Tabs requires IPython 1.0+**

Once installed and configured (added to an ipython profile), just launch
IPython notebook like normal:

.. code-block:: bash

    $ ipython notebook
    2013-08-01 13:44:19.199 [NotebookApp] Using existing profile dir: u'/home/user/.ipython/profile_default'
    2013-08-01 13:44:25.384 [NotebookApp] Using MathJax from CDN: http://cdn.mathjax.org/mathjax/latest/MathJax.js
    2013-08-01 13:44:25.400 [NotebookApp] Serving rgbkrk's notebooks on Rackspace CloudFiles from container: notebooks
    2013-08-01 13:44:25.400 [NotebookApp] The IPython Notebook is running at: http://127.0.0.1:9999/
    2013-08-01 13:44:25.400 [NotebookApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).

Installation
------------

Simply:

.. code-block:: bash

    $ pip install git+https://git.kyper.co/wusung.peng/ipython-notebook-tabs.git

Installation isn't the end though. You need to configure your account details
as well as where you'll be storing the notebooks.

Upgrade
------------

.. code-block:: bash

    $ pip install --upgrade git+https://git.kyper.co/wusung.peng/ipython-notebook-tabs.git

Configuration
-------------

IPython Notebook Module Tabs has to be added to an IPython profile. If you want to keep it simple, just add your configuration to the default configuration located at:

.. code-block:: bash

    ~/.ipython/profile_default/ipython_notebook_config.py

Alternatively, you can create a brand new notebook profile for it:

.. code-block:: bash

    $ ipython profile create nbserver
    [ProfileCreate] Generating default config file: u'/Users/theuser/.ipython/profile_nbserver/ipython_config.py'
    [ProfileCreate] Generating default config file: u'/Users/theuser/.ipython/profile_nbserver/ipython_notebook_config.py'

When launching, just set the custom profile you want to use

.. code-block:: bash

    $ ipython notebook --profile=nbserver

Using Kyper Contents Manager
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Add this to your ipython notebook profile *ipython_notebook_config.py*, making
sure it comes after the config declaration ``c = get_config()``.

.. code-block:: python

    c = get_config()

    # Setup IPython Notebook to support multiple checkpoints
    c.NotebookApp.contents_manager_class = 'kyper.filemanager.DefaultContentsManager'

Importing Module Tabs
~~~~~~~~~~~~~~~~~~~~~

Add this to custom.js

.. code-block:: javascript

    define(function (require) {
        "use strict";

        require('../nbextensions/dir-tabs/module-tabs');
    });

Contributing
------------

Send a pull request on `Kyper Git <https://git.kyper.co/wusung.peng/ipython-notebook-tabs.git>`_. It's
that simple. More than happy to respond to issues on Kyper Git as well.
