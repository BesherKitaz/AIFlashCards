#!/bin/bash

# Activate virtual environment
source .venv/Scripts/activate

# Export environment variables
export FLASK_ENV=development
export FLASK_DEBUG=1
export FLASK_APP=run.py

