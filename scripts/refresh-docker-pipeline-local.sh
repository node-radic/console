#!/bin/bash
set -e
mydir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

dirname="docker-console-pipeline-local"
dirpath="$mydir/../../$dirname"


if [ -d $dirpath ]; then
    echo "Deleting $dirpath"
    sudo rm -rf $dirpath
fi


cd "$mydir/../.."
echo "in $PWD"

git clone console "$dirname"

cd "$mydir/.."