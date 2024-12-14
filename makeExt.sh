#!/bin/bash
#
#install jq before run this script (apt install jq   or   https://stedolan.github.io/jq/download/)
#
NAME=ReturnNewReddit
BRANCH=${PWD##*/}
INITIAL_DIR=${PWD}
#create a working folder in parent directory named '_ext'
mkdir ../_ext/ > /dev/null 2>&1
#copy all files in the working folder
cd $INITIAL_DIR
cd ../_ext/
rm -rf $BRANCH/
cp -fr $INITIAL_DIR $BRANCH/
#cleanup unnecessary files
cd $INITIAL_DIR
cd ../_ext/$BRANCH
rm -rf README.md
rm -rf icons/icon.svg
rm -rf *.sh
rm -rf .git/
rm -rf .vscode/
rm -rf .eslintrc.json
rm -rf .gitignore
#Creating for zip manifest v2 version
cd $INITIAL_DIR
cp -p manifestv2.json manifest.json
cp -p manifestv2.json ../_ext/$BRANCH/manifest.json
sleep 1
cd ../_ext/$BRANCH
VERSION=$(jq -r '.version' manifest.json)
rm -rf ../$NAME-$VERSION-mv2.zip
zip -r ../$NAME-$VERSION-mv2.zip * >/dev/null
#Creating for zip manifest v3 version
cd $INITIAL_DIR
cp -p manifestv3.json manifest.json
cp -p manifestv3.json ../_ext/$BRANCH/manifest.json
sleep 1
cd ../_ext/$BRANCH
VERSION=$(jq -r '.version' manifest.json)
rm -rf ../$NAME-$VERSION-mv3.zip
zip -r ../$NAME-$VERSION-mv3.zip * >/dev/null
#finishing...
cd $INITIAL_DIR
echo "Extension created"
