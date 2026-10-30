#!/bin/sh
# line endings must be \n, not \r\n ! to json
set +e
cd /usr/share/nginx/html 2>/dev/null || cd "$(dirname "$0")" || true

if [ ! -f ./index.html ]; then
  echo "env.sh: index.html ausente, skip"
  exit 0
fi

if [ ! -f ./.env ]; then
  touch ./.env
fi

echo "{" > ./env.json
awk -F '=' 'NF && $1 !~ /^#/ { key=$1; val=substr($0, index($0,$2)); gsub(/"/, "\\\"", val); print "\"" key "\": \"" (ENVIRON[key] != "" ? ENVIRON[key] : val) "\"," }' ./.env >> ./env.json
# remove last comma
sed '$ s/,$//' ./env.json > ./env_temp.json
mv ./env_temp.json ./env.json
echo "}" >> ./env.json

if grep -q 'import_meta_env_placeholder' ./index.html; then
  json=$(tr -d '\n' < ./env.json)
  # Escape for sed replacement
  esc=$(printf '%s' "$json" | sed -e 's/\\/\\\\/g' -e 's/\//\\\//g' -e 's/&/\\\&/g')
  sed "s/\"import_meta_env_placeholder\"/${esc}/" ./index.html > ./index_temp.html && mv ./index_temp.html ./index.html
fi

rm -f ./env.json
exit 0
