#!/bin/bash

if npx prisma migrate deploy ; then
    npx prisma db seed
    node build/src/app.js
fi