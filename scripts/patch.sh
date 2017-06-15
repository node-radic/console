#!/usr/bin/env bash

npm run clean &&
npm run build &&
#npm run test &&
npm run dev:docs &&
git add -A &&
git commit -m "R $*" &&
npm run deploy:docs &&
npm run patch  &&
echo "done"