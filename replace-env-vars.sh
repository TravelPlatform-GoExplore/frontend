#!/bin/sh

# Replace placeholders in the environment files
for file in $(find /usr/share/nginx/html -name '*.js'); do
  echo "Replacing environment variables in $file"
  sed -i "s|\${BACKEND_URL}|${BACKEND_URL}|g" $file
done