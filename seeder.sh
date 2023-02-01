#!/bin/bash

node ./apps/imdb-be/src/seeder/userSeeder
node ./apps/imdb-be/src/seeder/genreSeeder
node ./apps/imdb-be/src/seeder/movieSeeder

