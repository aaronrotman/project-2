# A Flask API to serve the data from the beer stats csv

# Current API version
api_version = "v1.0"

# Dependencies
#Postgres credentials
from config import username, password
import pandas as pd
from flask import Flask, jsonify, render_template
import json
import csv
# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
# Instantiate Flask
app = Flask(__name__)


# Database set-up
conn = f"{username}:{password}@localhost:5432/project_2"
engine = create_engine(f'postgresql://{conn}')
# Reflect the database into a new model
Base = automap_base()

# Reflect the tables
Base.prepare(engine, reflect=True)
beer_stats = Base.classes.beer_stats

# Index route
@app.route('/')
def index():
    print("Received request for index route")
    return(
        """
        Welcome to our beer data API.
        <br><br>
        Available Routes:
        <br><br>
        /api/v1.0/states
        <br>
        <a href="/api/v1.0/states">View 'States' endpoint</a> 
        <br><br>
        /api/v1.0/by_state/<state_name>
        <br>
        <a href="/api/v1.0/by_state/California">Test endpoint for 'California'</a> 
        <br>
        """)


# Simple route to test functionality
@app.route('/api/v1.0/states')
def states():
    print("Received request for 'testing' route")

    session = Session(engine)
    states = session.query(
        beer_stats.state, 
        beer_stats.abbr, 
        beer_stats.per_cap_consumption, 
        beer_stats.total_consumption,
        beer_stats.five_year_change, 
        beer_stats.bar_rest_per_100k, 
        beer_stats.br_rank,
        beer_stats.beer_tax_per_gallon,
        beer_stats.beer_tax_rank
        )
    session.close()
    state_list = []
    for state, abbr, per_cap_consumption, total_consumption, five_year_change, bar_rest_per_100k, br_rank, beer_tax_per_gallon, beer_tax_rank in states:
        state_dict = {}
        state_dict["state"] = state
        state_dict["abreviation"] = abbr
        state_dict["pc_consumption"] = per_cap_consumption
        state_dict["total_sonsumption"] = total_consumption
        state_dict["five_year_change"] = five_year_change
        state_dict["br_per_100"] = bar_rest_per_100k
        state_dict["br_rank"] = br_rank
        state_dict["tax_per_gallon"] = beer_tax_per_gallon
        state_dict["tax_rank"] = beer_tax_rank
        state_list.append(state_dict)
    return jsonify(state_list)

# Another route to test functionality
@app.route('/api/v1.0/by_state/<state_name>')
def by_state(state_name):
    print("Received request for 'more-testing' route")

    
    session = Session(engine)
    states = session.query(
        beer_stats.state, 
        beer_stats.abbr, 
        beer_stats.per_cap_consumption, 
        beer_stats.total_consumption,
        beer_stats.five_year_change, 
        beer_stats.bar_rest_per_100k, 
        beer_stats.br_rank,
        beer_stats.beer_tax_per_gallon,
        beer_stats.beer_tax_rank
        ).\
        filter(beer_stats.state == state_name).all()
    session.close()
    state_list = []
    for state, abbr, per_cap_consumption, total_consumption, five_year_change, bar_rest_per_100k, br_rank, beer_tax_per_gallon, beer_tax_rank in states:
        state_dict = {}
        state_dict["state"] = state
        state_dict["abreviation"] = abbr
        state_dict["pc_consumption"] = per_cap_consumption
        state_dict["total_sonsumption"] = total_consumption
        state_dict["five_year_change"] = five_year_change
        state_dict["br_per_100"] = bar_rest_per_100k
        state_dict["br_rank"] = br_rank
        state_dict["tax_per_gallon"] = beer_tax_per_gallon
        state_dict["tax_rank"] = beer_tax_rank
        state_list.append(state_dict)
    return jsonify(state_list)

# Include at bottom of script
if __name__ == "__main__":
    app.run(debug=True)