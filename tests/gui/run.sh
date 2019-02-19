#!/bin/bash

trap cleanup EXIT
cleanup() {
  docker-compose down -v
}

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

rm -rf ./results
mkdir -p screenshots
mkdir -p ./results/coverage

docker-compose build

# --force-recreate and --remove-orphans in case we've run a debug instance
# before and it left things behind.
docker-compose up -d --force-recreate --remove-orphans selenium

# TODO: firefox is disabled because it has problems with taking screenshots of #root
./wait-for-nodes.sh 1

npm run _test:gui:fixtures

set +e
COVERAGE=1 BROWSER=chrome npm run _test:gui
RESULT=$?
set -e

if [[ ${RESULT} != 0 ]]; then
  echo Playground logs:
  docker-compose logs playground

  echo Playground logs:
  docker-compose logs playground

  echo Selenium logs:
  docker-compose logs selenium
fi

exit ${RESULT}
