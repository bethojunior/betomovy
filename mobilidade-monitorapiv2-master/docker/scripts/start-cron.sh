#!/bin/bash

# turn on bash's job control
set -m

# extract all system environment variables for cron (cron doesn't get them automatically)
printenv | awk -F= '{print "export " $1 "='\''" $2 "'\''"}' > /home/www-data/project_env.sh

supercronic /home/www-data/crontabs/www-data &
