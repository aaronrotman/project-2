-- Drop the 'breweries' table if it exists
DROP TABLE IF EXISTS breweries;

-- Create the 'breweries' table
CREATE TABLE breweries (
	key SERIAL PRIMARY KEY,
	id VARCHAR,
	name VARCHAR,
	brewery_type VARCHAR,
	street VARCHAR,
	city VARCHAR,
	state VARCHAR,
	postal_code VARCHAR,
	website_url VARCHAR,
	phone VARCHAR,
	created_at VARCHAR,
	updated_at VARCHAR,
	country VARCHAR,
	longitude FLOAT,
	latitude FLOAT,
	tags VARCHAR
);

-- Confirm the table was created properly
SELECT name FROM breweries;
