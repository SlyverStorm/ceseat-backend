#!/bin/bash

npx prisma migrate deploy
npx prisma db seed
node build/src/app.js