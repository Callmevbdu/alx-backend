#!/usr/bin/env python3

"""
Basic Flask app
"""

from flask import Flask, render_template
from collections.abc import MutableMapping

app = Flask(__name__)


@app.route('/', methods=["GET"], strict_slashes=False)
def hello() -> str:
    """
    Hello world
    """
    return render_template('0-index.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")