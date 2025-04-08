#!/bin/bash
sleep 10
echo "Initializing replica set..."

mongo --eval "rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: 'mongodb:27017' }] })"

until mongo --eval "rs.status()" | grep -q "primary"; do
  echo "Waiting for replica set to initialize..."
  sleep 5
done

echo "Replica set initialized successfully!"
