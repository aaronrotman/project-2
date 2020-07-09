-- Create a new table to store the state beer states data
CREATE TABLE beer_stats (
	id INT,
	state VARCHAR PRIMARY KEY,
	abbr VARCHAR(10),
	per_cap_consumption FLOAT,
	total_consumption INT,
	five_year_change FLOAT,
	bar_rest_per_100k FLOAT,
	br_rank INT,
	beer_tax_per_gallon float,
	beer_tax_rank int
);

-- 	View the beer_stats table
SELECT * FROM beer_stats;

