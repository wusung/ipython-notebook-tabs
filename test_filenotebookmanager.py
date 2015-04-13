#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Tests for bookstore
"""

from unittest import TestCase
import doctest
import logging

from bookstore.filenotebookmanager import FileNotebookManager

logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)

class TestFileNotebookManager(TestCase):
    def setUp(self):
    	pass

    def tearDown(self):
        pass

    def test_entry_points(self):
        pass
    
    def test_nb_dir(self):
    	pass

    def test_create_checkpoint(self):
    	filenotebookManager = FileNotebookManager()
        filenotebookManager.create_checkpoint(name = 'test1.ipynb')

    def test_list_checkpoint(self):
    	filenotebookManager = FileNotebookManager()
    	filenotebookManager.list_checkpoints(name = 'test1.ipynb')
