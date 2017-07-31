#!/bin/bash
set -e

# add github remote and push all to keep it in sync
#apt-get install -y --no-install-recommends git
#git remote add github git@github.com:node-radic/console
#git push github --all
#git push github --tags

# install yarn
curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 0.18.1
export PATH=$HOME/.yarn/bin:$PATH

# install dependencies and build the package
yarn install
npm run build

# unit tests
npm run test

# deploy typedoc
npm run dev:docs
npm run deploy:docs