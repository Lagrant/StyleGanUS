from flask import Flask, render_template, request, flash, Request, url_for, redirect, jsonify
import json

app = Flask(__name__)
log = app.logger

@app.route('/')
@app.route('/index')
def index_page(name=None):

    return render_template('index.html', name=name)