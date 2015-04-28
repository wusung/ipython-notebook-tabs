"""Python API for composing notebook elements

The Python representation of a notebook is a nested structure of
dictionary subclasses that support attribute access
(IPython.utils.ipstruct.Struct). The functions in this module are merely
helpers to build the structs in the right form.
"""

# Copyright (c) IPython Development Team.
# Distributed under the terms of the Modified BSD License.

from ..notebooknode import from_dict, NotebookNode

# Change this when incrementing the nbformat version
nbformat = 4
nbformat_minor = 1
nbformat_schema = 'nbformat.v4.schema.json'


def validate(node, ref=None):
    """validate a v4 node"""
    from .. import validate
    return validate(node, ref=ref, version=nbformat)


def new_output(output_type, data=None, **kwargs):
    """Create a new output, to go in the ``cell.outputs`` list of a code cell."""
    output = NotebookNode(output_type=output_type)

    # populate defaults:
    if output_type == 'stream':
        output.name = u'stdout'
        output.text = u''
    elif output_type in {'execute_result', 'display_data'}:
        output.metadata = NotebookNode()
        output.data = NotebookNode()
    # load from args:
    output.update(from_dict(kwargs))
    if data is not None:
        output.data = from_dict(data)
    # validate
    validate(output, output_type)
    return output


def output_from_msg(msg):
    """Create a NotebookNode for an output from a kernel's IOPub message.

    Returns
    -------

    NotebookNode: the output as a notebook node.

    Raises
    ------

    ValueError: if the message is not an output message.

    """
    msg_type = msg['header']['msg_type']
    content = msg['content']

    if msg_type == 'execute_result':
        return new_output(output_type=msg_type,
            metadata=content['metadata'],
            data=content['data'],
            execution_count=content['execution_count'],
        )
    elif msg_type == 'stream':
        return new_output(output_type=msg_type,
            name=content['name'],
            text=content['text'],
        )
    elif msg_type == 'display_data':
        return new_output(output_type=msg_type,
            metadata=content['metadata'],
            data=content['data'],
        )
    elif msg_type == 'error':
        return new_output(output_type=msg_type,
            ename=content['ename'],
            evalue=content['evalue'],
            traceback=content['traceback'],
        )
    else:
        raise ValueError("Unrecognized output msg type: %r" % msg_type)


def new_code_cell(source='', **kwargs):
    """Create a new code cell"""
    cell = NotebookNode(
        cell_type='code',
        metadata=NotebookNode(),
        execution_count=None,
        source=source,
        outputs=[],
    )
    cell.update(from_dict(kwargs))

    validate(cell, 'code_cell')
    return cell

def new_markdown_cell(source='', **kwargs):
    """Create a new markdown cell"""
    cell = NotebookNode(
        cell_type='markdown',
        source=source,
        metadata=NotebookNode(),
    )
    cell.update(from_dict(kwargs))

    validate(cell, 'markdown_cell')
    return cell

def new_raw_cell(source='', **kwargs):
    """Create a new raw cell"""
    cell = NotebookNode(
        cell_type='raw',
        source=source,
        metadata=NotebookNode(),
    )
    cell.update(from_dict(kwargs))

    validate(cell, 'raw_cell')
    return cell

def new_worksheet(name=None, cells=None, metadata=None):
    """Create a worksheet by name with with a list of cells."""
    ws = NotebookNode()
    if cells is None:
        ws.cells = []
    else:
        ws.cells = list(cells)
    ws.metadata = NotebookNode(metadata or {})
    return ws

def new_notebook(name=None, metadata=None, worksheets=None):
    """Create a notebook by name, id and a list of worksheets."""
    nb = NotebookNode()
    nb.nbformat = nbformat
    nb.nbformat_minor = nbformat_minor
    if worksheets is None:
        nb.worksheets = []
    else:
        nb.worksheets = list(worksheets)
    if metadata is None:
        nb.metadata = new_metadata()
    else:
        nb.metadata = NotebookNode(metadata)
    if name is not None:
        nb.metadata.name = cast_unicode(name)
    return nb

def new_metadata(name=None, authors=None, license=None, created=None,
    modified=None, gistid=None):
    """Create a new metadata node."""
    metadata = NotebookNode()
    if name is not None:
        metadata.name = cast_unicode(name)
    if authors is not None:
        metadata.authors = list(authors)
    if created is not None:
        metadata.created = cast_unicode(created)
    if modified is not None:
        metadata.modified = cast_unicode(modified)
    if license is not None:
        metadata.license = cast_unicode(license)
    if gistid is not None:
        metadata.gistid = cast_unicode(gistid)
    return metadata
