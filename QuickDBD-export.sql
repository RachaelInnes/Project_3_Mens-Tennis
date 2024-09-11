-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.
-- Created tables in reverse order, so import from bottom table up

DROP TABLE IF EXISTS "Mens_Tennis_Grand_Slam_Winner";
CREATE TABLE "Mens_Tennis_Grand_Slam_Winner" (
    "TOURNAMENT_ID" INT   NOT NULL,
    "YEAR" INT   NOT NULL,
    "TOURNAMENT" VARCHAR(20)   NOT NULL,
    "WINNER" VARCHAR(30)   NOT NULL,
    "RUNNER-UP" VARCHAR(30)   NOT NULL,
    "WINNER_NATIONALITY" VARCHAR(60)   NOT NULL,
    "WINNER_ATP_RANKING" INT,
    "RUNNER-UP_ATP_RANKING" INT,
    "WINNER_LEFT_OR_RIGHT_HANDED" VARCHAR(5)   NOT NULL,
    "TOURNAMENT_SURFACE" VARCHAR(30)   NOT NULL,
    "WINNER_PRIZE" INT   NOT NULL,
    CONSTRAINT "pk_Mens_Tennis_Grand_Slam_Winner" PRIMARY KEY (
        "TOURNAMENT_ID"
     )
);
ALTER TABLE "Mens_Tennis_Grand_Slam_Winner" ADD CONSTRAINT "fk_Mens_Tennis_Grand_Slam_Winner_WINNER_NATIONALITY" FOREIGN KEY("WINNER_NATIONALITY")
REFERENCES "countries" ("nationality");
SELECT * FROM "Mens_Tennis_Grand_Slam_Winner";

DROP TABLE IF EXISTS "countries";
CREATE TABLE "countries" (
    "num_code" INT   NOT NULL,
    "alpha_2_code" VARCHAR(2)   NOT NULL,
    "alpha_3_code" VARCHAR(3)   NOT NULL,
    "en_short_name" VARCHAR(60)   NOT NULL,
    "nationality" VARCHAR(60)   NOT NULL,
    CONSTRAINT "pk_countries" PRIMARY KEY (
        "nationality"
     )
);
ALTER TABLE "countries" ADD CONSTRAINT "fk_countries_alpha_2_code" FOREIGN KEY("alpha_2_code")
REFERENCES "world_coordinates" ("Code");
SELECT * FROM "countries";

DROP TABLE IF EXISTS "world_coordinates";
CREATE TABLE "world_coordinates" (
    "Code" VARCHAR(2)   NOT NULL,
    "Country" VARCHAR(60)   NOT NULL,
    "latitude" DEC   NOT NULL,
    "longitude" DEC   NOT NULL,
    CONSTRAINT "pk_world_coordinates" PRIMARY KEY (
        "Code"
     )
);
SELECT * FROM "world_coordinates";

--Merge Query
SELECT
	mg.*,
    c.*,
    wc.*
	
From "Mens_Tennis_Grand_Slam_Winner" mg
LEFT JOIN "countries" c ON mg."WINNER_NATIONALITY" = c."nationality"
LEFT JOIN "world_coordinates" wc ON c."alpha_2_code" = wc."Code";

--Output the merged data into json format
--Double click the cell of the json data in the output
--Select all, copy and paste into VS Code and save as .json file type
--This file was then uploaded to the GitHub repo and the URL was used with D3 library.

SELECT json_agg(result) AS results
FROM (
    SELECT
        mg.*,
        c.*,
        wc.*
    FROM "Mens_Tennis_Grand_Slam_Winner" mg
    LEFT JOIN "countries" c ON mg."WINNER_NATIONALITY" = c."nationality"
    LEFT JOIN "world_coordinates" wc ON c."alpha_2_code" = wc."Code"
) result;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Mens_Tennis_Grand_Slam_Winner';



