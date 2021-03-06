"""Base classes and utilities for readers and writers."""

# Copyright (c) IPython Development Team.
# Distributed under the terms of the Modified BSD License.

from IPython.utils.py3compat import string_types, cast_unicode_py2

import convert
from IPython.utils.log import get_logger

def rejoin_lines(nb):
    """rejoin multiline text into strings

    For reversing effects of ``split_lines(nb)``.

    This only rejoins lines that have been split, so if text objects were not split
    they will pass through unchanged.

    Used when reading JSON files that may have been passed through split_lines.
    """

    if nb.nbformat_minor == 1:
        for ws in nb.worksheets:
            for cell in ws.cells:
                if 'source' in cell and isinstance(cell.source, list):
                    cell.source = ''.join(cell.source)
                if cell.get('cell_type', None) == 'code':
                    for output in cell.get('outputs', []):
                        output_type = output.get('output_type', '')
                        if output_type in {'execute_result', 'display_data'}:
                            for key, value in output.get('data', {}).items():
                                if key != 'application/json' and isinstance(value, list):
                                    output.data[key] = ''.join(value)
                        elif output_type:
                            if isinstance(output.get('text', ''), list):
                                output.text = ''.join(output.text)
    else:
        for cell in nb.cells:
            if 'source' in cell and isinstance(cell.source, list):
                cell.source = ''.join(cell.source)
            if cell.get('cell_type', None) == 'code':
                for output in cell.get('outputs', []):
                    output_type = output.get('output_type', '')
                    if output_type in {'execute_result', 'display_data'}:
                        for key, value in output.get('data', {}).items():
                            if key != 'application/json' and isinstance(value, list):
                                output.data[key] = ''.join(value)
                    elif output_type:
                        if isinstance(output.get('text', ''), list):
                            output.text = ''.join(output.text)
    return nb

def split_lines(nb):
    """split likely multiline text into lists of strings

    For file output more friendly to line-based VCS. ``rejoin_lines(nb)`` will
    reverse the effects of ``split_lines(nb)``.

    Used when writing JSON files.
    """
    #self.log.info(nb.metadata.get('orig_nbformat'))
    orig_nbformat = nb.metadata.pop('orig_nbformat', None)
    print ('format=v{}.{}'.format(orig_nbformat, nb.nbformat_minor))
    if nb.nbformat_minor == 1:
        if orig_nbformat is None:
            for ws in nb.worksheets:
                if ws is not None:
                    #print(ws['cells'])
                    for cell in ws['cells']:
                        source = cell.get('source', None)
                        if isinstance(source, string_types):
                            cell['source'] = source.splitlines(True)
                        if cell.cell_type == 'code':
                            for output in cell.outputs:
                                if output.output_type in {'execute_result', 'display_data'}:
                                    for key, value in output.data.items():
                                        if key != 'application/json' and isinstance(value, string_types):
                                            output.data[key] = value.splitlines(True)
                                elif output.output_type == 'stream':
                                    if isinstance(output.text, string_types):
                                        output.text = output.text.splitlines(True)

        else:
            #nb = convert.upgrade(nb, 3, 0)
            for ws in nb.worksheets:
                for cell in ws.cells:
                    cell = convert.upgrade_cell(cell)
                    source = cell.get('source', None)
                    if isinstance(source, string_types):
                        cell['source'] = source.splitlines(True)

                    if cell.cell_type == 'code':
                        cell.source = cell.get('input', '')
                    elif cell.cell_type == 'heading':
                        level = cell.get('level', 1)
                        cell.source = u'{hashes} {single_line}'.format(
                            hashes='#' * level,
                            single_line = ' '.join(cell.get('input', '').splitlines()),
                        )

                    if cell.cell_type == 'code':
                        for output in cell.outputs:
                            #output = convert.upgrade_output(output)
                            if output.output_type in {'execute_result', 'display_data'}:
                                for key, value in output.data.items():
                                    if key != 'application/json' and isinstance(value, string_types):
                                        output.data[key] = value.splitlines(True)
                            elif output.output_type == 'stream':
                                if isinstance(output.text, string_types):
                                    output.text = output.text.splitlines(True)

                    #cell['level'] = 1
                    cell.source = source
        nb.pop('cells', None)
    else:
        for cell in nb.cells:
            source = cell.get('source', None)
            if isinstance(source, string_types):
                cell['source'] = source.splitlines(True)

            if cell.cell_type == 'code':
                for output in cell.outputs:
                    if output.output_type in {'execute_result', 'display_data'}:
                        for key, value in output.data.items():
                            if key != 'application/json' and isinstance(value, string_types):
                                output.data[key] = value.splitlines(True)
                    elif output.output_type == 'stream':
                        if isinstance(output.text, string_types):
                            output.text = output.text.splitlines(True)
    return nb

def strip_transient(nb):
    """Strip transient values that shouldn't be stored in files.

    This should be called in *both* read and write.
    """
    nb.metadata.pop('orig_nbformat', None)
    nb.metadata.pop('orig_nbformat_minor', None)
    nb.metadata.pop('signature', None)
    if nb.nbformat_minor == 1:
        for ws in nb.worksheets:
            if ws is not None:
                if ws['cells'] is not None:
                    for cell in ws['cells']:
                        cell.metadata.pop('trusted', None)
    else:
        for cell in nb.cells:
            cell.metadata.pop('trusted', None)
    return nb

class NotebookReader(object):
    """A class for reading notebooks."""

    def reads(self, s, **kwargs):
        """Read a notebook from a string."""
        raise NotImplementedError("loads must be implemented in a subclass")

    def read(self, fp, **kwargs):
        """Read a notebook from a file like object"""
        nbs = cast_unicode_py2(fp.read())
        return self.reads(nbs, **kwargs)


class NotebookWriter(object):
    """A class for writing notebooks."""

    def writes(self, nb, **kwargs):
        """Write a notebook to a string."""
        raise NotImplementedError("loads must be implemented in a subclass")

    def write(self, nb, fp, **kwargs):
        """Write a notebook to a file like object"""
        nbs = cast_unicode_py2(self.writes(nb, **kwargs))
        return fp.write(nbs)
