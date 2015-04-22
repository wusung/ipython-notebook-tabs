import io
import os
import glob
import shutil
import uuid

from tornado import web
HTTPError = web.HTTPError

from IPython.utils.log import get_logger
from IPython.html.services.contents.filemanager import FileContentsManager
from IPython.utils.traitlets import Unicode, Bool, TraitError
from IPython.utils.py3compat import getcwd
from IPython.utils import tz
from IPython.html.utils import is_hidden, to_os_path
from IPython.utils.tz import utcnow, tzUTC
from kyper import nbformat
from kyper.nbformat import sign, validate, ValidationError
from kyper.nbformat.v4 import new_notebook
from IPython.utils.traitlets import (
    Any,
    Dict,
    Instance,
    List,
    TraitError,
    Type,
    Unicode,
)

class DefaultContentsManager(FileContentsManager):

    notary = Instance(sign.NotebookNotary)
    def _notary_default(self):
        return sign.NotebookNotary(parent=self)

    def validate_notebook_model(self, model):
        """Add failed-validation message to model"""
        try:
            validate(model['content'])
        except ValidationError as e:
            model['message'] = u'Notebook Validation failed: {}:\n{}'.format(
                e.message, json.dumps(e.instance, indent=1, default=lambda obj: '<UNKNOWN>'),
            )
        return model

    def _read_notebook(self, os_path, as_version=4):
        """Read a notebook from an os path."""

        with self.open(os_path, 'r', encoding='utf-8') as f:
            try:
                return nbformat.read(f, as_version=as_version)
            except Exception as e:
                raise HTTPError(
                    400,
                    u"Unreadable Notebook: %s %r" % (os_path, e),
                )

    def _save_notebook(self, os_path, nb):
        """Save a notebook to an os_path."""

        with self.atomic_writing(os_path, encoding='utf-8') as f:
            nbformat.write(nb, f, version=nbformat.NO_CONVERT)

    def trust_notebook(self, path):
        """Explicitly trust a notebook

        Parameters
        ----------
        path : string
            The path of a notebook
        """
        model = self.get(path)
        nb = model['content']
        self.log.warn("Trusting notebook %s", path)
        self.notary.mark_cells(nb, True)
        self.save(model, path)

    def check_and_sign(self, nb, path=''):
        """Check for trusted cells, and sign the notebook.

        Called as a part of saving notebooks.

        Parameters
        ----------
        nb : dict
            The notebook dict
        path : string
            The notebook's path (for logging)
        """
        if self.notary.check_cells(nb):
            self.notary.sign(nb)
        else:
            self.log.warn("Saving untrusted notebook %s", path)

    def mark_trusted_cells(self, nb, path=''):
        """Mark cells as trusted if the notebook signature matches.

        Called as a part of loading notebooks.

        Parameters
        ----------
        nb : dict
            The notebook object (in current nbformat)
        path : string
            The notebook's path (for logging)
        """
        trusted = self.notary.check_signature(nb)
        if not trusted:
            self.log.warn("Notebook %s is not trusted", path)
        self.notary.mark_cells(nb, trusted)        

    def check_and_sign(self, nb, path=''):
        """Check for trusted cells, and sign the notebook.

        Called as a part of saving notebooks.

        Parameters
        ----------
        nb : dict
            The notebook dict
        path : string
            The notebook's path (for logging)
        """
        if self.notary.check_cells(nb):
            self.notary.sign(nb)
        else:
            self.log.warn("Saving untrusted notebook %s", path)

    def new(self, model=None, path=''):
        """Create a new file or directory and return its model with no content.
        
        To create a new untitled entity in a directory, use `new_untitled`.
        """
        path = path.strip('/')
        if model is None:
            model = {}
        
        if path.endswith('.ipynb'):
            model.setdefault('type', 'notebook')
        else:
            model.setdefault('type', 'file')
        
        # no content, not a directory, so fill out new-file model
        if 'content' not in model and model['type'] != 'directory':
            if model['type'] == 'notebook':
                model['content'] = new_notebook()
                model['format'] = 'json'
            else:
                model['content'] = ''
                model['type'] = 'file'
                model['format'] = 'text'
        
        model = self.save(model, path)
        return model