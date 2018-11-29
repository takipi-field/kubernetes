#!/bin/bash

# copy the agent into the shared data volume mount
cp -a /takipi/. /shared-data/

# run the container forever to make kubernetes happy
while true; do sleep 30; done;
