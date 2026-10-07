#!/bin/sh
# line endings must be \n, not \r\n ! to json
echo "{" > ./env.json
awk -F '=' '{ print "\""$1"\"" ": \"" (ENVIRON[$1] ? ENVIRON[$1] : $2) "\"," }' ./.env >> ./env.json
# remove last comma
sed '$ s/.$//' ./env.json > ./env_temp.json
mv ./env_temp.json ./env.json
echo "}" >> ./env.json

# create env as json into:
# <script>
#     globalThis.import_meta_env = JSON.parse('"import_meta_env_placeholder"');
# </script>
# change import_meta_env_placeholder line to JSON.parse with env.json
json=$(cat ./env.json)
sed "s/\"import_meta_env_placeholder\"/$(echo $json | sed -e 's/\\/\\\\/g; s/\//\\\//g; s/&/\\\&/g')/" ./index.html > ./index_temp.html
mv ./index_temp.html ./index.html

# remove env.json file
rm ./env.json
