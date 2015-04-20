c = get_config()

#Export all the notebooks in the current directory to the sphinx_howto format.
c.NbConvertApp.notebooks = ['notebook1.ipynb']
c.NbConvertApp.export_format = 'notebook'
c.Exporter.default_preprocessors = ['kyper.nbconvert.preprocessors.coalesce_streams', 'kyper.nbconvert.preprocessors.SVG2PDFPreprocessor', 'kyper.nbconvert.preprocessors.ExtractOutputPreprocessor', 'kyper.nbconvert.preprocessors.CSSHTMLHeaderPreprocessor', 'kyper.nbconvert.preprocessors.RevealHelpPreprocessor', 'kyper.nbconvert.preprocessors.LatexPreprocessor', 'kyper.nbconvert.preprocessors.HighlightMagicsPreprocessor']
c.Application.verbose_crash=True
