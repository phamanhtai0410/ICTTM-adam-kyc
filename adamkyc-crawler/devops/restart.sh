#!/usr/bin/env sh

pm2 stop all
rm -rf ownershipcrawl.log sanctioncrawl.log ownership_data sanction_data temporary
/app/env/bin/python3 /app/restart.py
/app/env/bin/python3 /app/mongo_main.py
pm2 start 0
sleep 5
pm2 start 1
