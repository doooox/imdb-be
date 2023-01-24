#!/bin/bash

npm install
node ./apps/imdb-be/src/seeder/userSeeder
node ./apps/imdb-be/src/seeder/genreSeeder
node ./apps/imdb-be/src/seeder/movieSeeder
cd apps/imdb-be
npx nx test
