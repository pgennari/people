#!/bin/bash
sleep 15
until mongo --eval "db.runCommand({ ping: 1 })" mongodb:27017/test --quiet; do
  echo "MongoDB is not ready yet...retrying"
  sleep 5
done

echo "MongoDB is ready!"
exit 0
