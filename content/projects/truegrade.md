+++
title = "TrueGrade"
type = "project"
description = "A mineral grade estimation API using 3D Ordinary Kriging to predict gold grades from drillhole and surface sample data."
symbol = "Au"
year = 2025
featured = true
[taxonomies]
tags = ["Python", "FastAPI", "PostGIS", "Kriging"]
[extra]
github = "https://github.com/yousufaltayeb/truegrade"
+++

A mineral grade estimation API that uses Ordinary Kriging 3D to predict gold grades at any location based on drillhole and surface sample data. Users create sites, upload geological datasets via Excel, and query the API to estimate mineral grades at arbitrary (x, y, z) coordinates.

Built with FastAPI and PostGIS for spatial data storage and nearest-neighbor queries. Uses PyKrige and GSTools for geostatistical computation — dual-mode estimation with PyKrige for rapid auto-estimation and GSTools for full manual parameter control behind a single unified API.

The stack includes SQLAlchemy with Alembic for migrations, JWT authentication, and Docker Compose for local development.
