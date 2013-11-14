#!/bin/bash
set -e
PATH=$PATH:node_modules/.bin/

installBuildDependencies() {
    npm install
}

build() {
    jake "$@"
}

main() {
    if [ ! -d node_modules ]; then
        installBuildDependencies
    fi

    build "$@"
}

main "$@"
