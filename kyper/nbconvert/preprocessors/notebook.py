
from ..utils.base import NbConvertBase
from IPython.utils.traitlets import Bool

class NotebookPreprocessor(Preprocessor):
    def preprocess(self, nb, resources):
        """
        Preprocessing to apply on each notebook.
        
        Must return modified nb, resources.
        
        If you wish to apply your preprocessing to each cell, you might want
        to override preprocess_cell method instead.
        
        Parameters
        ----------
        nb : NotebookNode
            Notebook being converted
        resources : dictionary
            Additional resources used in the conversion process.  Allows
            preprocessors to pass variables into the Jinja engine.
        """
        for worksheet in nb.worksheets:
            for index, cell in enumerate(worksheet.cells):
                worksheet.cells[index], resources = self.preprocess_cell(cell, resources, index)
        return nb, resources