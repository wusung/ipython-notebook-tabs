import io
import os
import glob
import shutil
import uuid

from tornado import web

from IPython.html.services.contents.filemanager import FileContentsManager
from kyper import nbformat
from IPython.utils.traitlets import Unicode, Bool, TraitError
from IPython.utils.py3compat import getcwd
from IPython.utils import tz
from IPython.html.utils import is_hidden, to_os_path
from IPython.utils.tz import utcnow, tzUTC
from IPython.nbformat import sign, validate, ValidationError

class DefaultContentsManager(FileContentsManager):

    def validate_notebook_model(self, model):
        """Add failed-validation message to model"""
        # try:
        #     validate(model['content'])
        # except ValidationError as e:
        #     model['message'] = u'Notebook Validation failed: {}:\n{}'.format(
        #         e.message, json.dumps(e.instance, indent=1, default=lambda obj: '<UNKNOWN>'),
        #     )
        return model

    def _read_notebook(self, os_path, as_version=4):
        """Read a notebook from an os path."""

        self.log.debug("_read_notebook()")
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

        self.log.debug("_save_notebook")
        with self.atomic_writing(os_path, encoding='utf-8') as f:
            nbformat.write(nb, f, version=nbformat.NO_CONVERT)
