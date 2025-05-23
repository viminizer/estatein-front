#!/bin/bash

git checkout develop
git merge master
git add .
git status

echo "Enter commit message: "
read COMMIT_MESSAGE

git commit -m "$COMMIT_MESSAGE"
git push origin develop

echo "Switching to master branch..."
git checkout master
git merge develop
git push origin master

echo "Switching to develop branch..."
git checkout develop
echo "Changes have been committed with message: '$COMMIT_MESSAGE'"
