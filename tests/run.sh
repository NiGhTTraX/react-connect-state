#!/usr/bin/env bash

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

npm run _test:fixtures
npm run _test:selenium
npm run _test:playground

# --silent so we don't get the npm err epilogue.
npm run _test
