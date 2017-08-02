#!/bin/bash
mydir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

dir_console="$mydir/.."
dir_node="$mydir/../.."
dir_config="$dir_node/radical-console-crypto-file-config"
dir_database="$dir_node/radical-console-database"
dir_demo="$dir_node/radical-console-demo"


_run(){
    dir=$1
    run=$2
    cd "$dir"
    npm run "$run"
}

_link(){
    dir=$1
    shift
    cd "$dir"
    npm link $*
}

_run-all(){
    run=$1
    _run "$dir_console"
    _run "$dir_config"
    _run "$dir_database"
    _run "$dir_demo"
}

_watch-all(){
    _run-all watch
}
_reinstall-all(){
    _run-all reinstall
}
_build-all(){
    _run-all build
}


_run $dir_console reinstall

echo "done, wait 5"
wait 1
echo "done, wait 4"
wait 1
echo "done, wait 3"
wait 1
echo "done, wait 2"
wait 1
echo "done, wait 1"
wait 1

_run $dir_config reinstall

echo "done, wait 5"
wait 1
echo "done, wait 4"
wait 1
echo "done, wait 3"
wait 1
echo "done, wait 2"
wait 1
echo "done, wait 1"
wait 1

_link $dir_config

echo "done, wait 5"
wait 1
echo "done, wait 4"
wait 1
echo "done, wait 3"
wait 1
echo "done, wait 2"
wait 1
echo "done, wait 1"
wait 1

_run $dir_database reinstall

echo "done, wait 5"
wait 1
echo "done, wait 4"
wait 1
echo "done, wait 3"
wait 1
echo "done, wait 2"
wait 1
echo "done, wait 1"
wait 1

_link $dir_database

echo "done, wait 5"
wait 1
echo "done, wait 4"
wait 1
echo "done, wait 3"
wait 1
echo "done, wait 2"
wait 1
echo "done, wait 1"
wait 1

_run $dir_demo reinstall
