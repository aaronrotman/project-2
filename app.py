# A Flask API to serve the data from the beer stats csv

# Current API version
api_version = "v1.0"

# Dependencies
#Postgres credentials
from config import username, password
import pandas as pd
from flask import Flask, jsonify
import json

# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

# Instantiate Flask
app = Flask(__name__)


# Database set-up
conn = f"{username}:{password}@localhost:5432/project_2"
engine = create_engine(f'postgresql://{conn}')
# Reflect the database into a new model
Base = automap_base()

# Reflect the tables
Base.prepare(engine, reflect=True)

# Store the beer stats table
beer_stats = Base.classes.beer_stats

# Index route
@app.route('/')
def index():
    print("Received request for index route")
    return(
        """
        <h1>Welcome to the US Beer Consumption Data API.</h1>
        <p>Version: v1.0</p>
        <hr>
        <h2>The following routes are available:</h2>
        <h3>Endpoint for all US states:</h3>
        <p>/api/v1.0/states</P>
        <a href="/api/v1.0/us_states">View endpoint</a>
        <h3>Endpoint for a single US state:</h3>
        <p>/api/v1.0/by_state/<state_name></p>
        <a href="/api/v1.0/by_state/California">View endpoint</a> 
        """
        )

# Endpoint that returns beer statistics data for all 50 US states
@app.route(f'/api/{api_version}/us_states')
def states():
    print("Received request for 'us_states' route")
    # Create a new session
    session = Session(engine)
    # Query the database
    states = session.query(
        beer_stats.id,
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
    # Close the session
    session.close()

    # List to store a dictionary for each state's statistics
    state_list = []

    # Create a dictionary of beer statistics data for each state and add them to the list of state dictionaries
    for id, state, abbr, per_cap_consumption, total_consumption, five_year_change, bar_rest_per_100k, br_rank, beer_tax_per_gallon, beer_tax_rank in states:
        state_dict = {}
        state_dict["id"] = id
        state_dict["state"] = state
        state_dict["abreviation"] = abbr
        state_dict["pc_consumption"] = per_cap_consumption
        state_dict["total_consumption"] = total_consumption
        state_dict["five_year_change"] = five_year_change
        state_dict["br_per_100"] = bar_rest_per_100k
        state_dict["br_rank"] = br_rank
        state_dict["tax_per_gallon"] = beer_tax_per_gallon
        state_dict["tax_rank"] = beer_tax_rank
        state_list.append(state_dict)
    
    # Return the results in JSON format
    return jsonify(state_list)

# Endpoint that returns beer statistics data for a single US state
@app.route(f'/api/{api_version}/by_state/<state_name>')
def by_state(state_name):
    print(f"Received request for single state route for state: {state_name}")

    # Create a new session
    session = Session(engine)
    # Query the database
    states = session.query(
        beer_stats.id,
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
    # Close the session
    session.close()

    # List to store a dictionary for a specific state's statistics
    state_list = []

    # Create a dictionary of beer statistics data for a specific state and add it to the list of state dictionaries
    for id, state, abbr, per_cap_consumption, total_consumption, five_year_change, bar_rest_per_100k, br_rank, beer_tax_per_gallon, beer_tax_rank in states:
        state_dict = {}
        state_dict["id"] = id
        state_dict["state"] = state
        state_dict["abreviation"] = abbr
        state_dict["pc_consumption"] = per_cap_consumption
        state_dict["total_consumption"] = total_consumption
        state_dict["five_year_change"] = five_year_change
        state_dict["br_per_100"] = bar_rest_per_100k
        state_dict["br_rank"] = br_rank
        state_dict["tax_per_gallon"] = beer_tax_per_gallon
        state_dict["tax_rank"] = beer_tax_rank
        state_list.append(state_dict)
    
    # Return the results in JSON format
    return jsonify(state_list)

# Include at bottom of script
if __name__ == "__main__":
    app.run(debug=True)