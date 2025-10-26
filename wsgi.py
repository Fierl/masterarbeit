#!/usr/bin/python3
import sys
import os

# App-Verzeichnis zum Python-Pfad hinzufügen
sys.path.insert(0, os.path.dirname(__file__))

from app import app as application  # WSGI erwartet 'application'
