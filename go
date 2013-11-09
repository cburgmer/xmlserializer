#!/bin/bash
set -e

installBuildDependencies() {
    npm install
}

build() {
    node ./node_modules/jake/bin/cli.js "$@"
}

main() {
    if [ ! -d node_modules ]; then
        installBuildDependencies
    fi

    build "$@"
}

main "$@"
