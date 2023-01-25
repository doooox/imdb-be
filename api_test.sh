#!/bin/bash

npm install
./seeder.sh
cd apps/imdb-be
npx nx test
