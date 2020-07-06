# A Flask API to serve the data from the beer stats csv

# Current API version
api_version = "v1.0"

# Dependencies
import pandas as pd
from flask import Flask
import json

# Instantiate Flask
app = Flask(__name__)

# Index route
@app.route('/')
def index():
    print("Received request for index route")
    return(
        """
        Welcome to our beer data API.
        <br>
        Available Routes:
        <br>
        '/api/v1.0/testing'
        <br>
        <a href="/api/v1.0/testing">Give it a try!</a> 
        <br>
        '/api/v1.0/more-testing'
        <br>
        <a href="/api/v1.0/more-testing">Give it another try!</a> 
        """)

# Simple route to test functionality
@app.route('/api/v1.0/testing')
def testing():
    print("Received request for 'testing' route")
    return(
    """
    <a href='/'>Home</a>
    <br>
    JSON data would go here 

    """)

# Another route to test functionality
@app.route('/api/v1.0/more-testing')
def more_testing():
    print("Received request for 'more-testing' route")
    return(
    """
    <a href='/'>Home</a>
    <br>
    More JSON data would go here 
    """)

# Include at bottom of script
if __name__ == "__main__":
    app.run(debug=True)