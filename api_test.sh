#!/bin/bash

npm install
node ./apps/imdb-be/src/seeder/userSeeder
cd apps/imdb-be
npx nx test
