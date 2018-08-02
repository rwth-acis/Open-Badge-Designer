#!/bin/bash
echo "attempting to kill previous server"
kill $(cat ./pid.file)
echo "attempting to package application"
./mvnw clean package
echo "package complete, attempting to run"
java -jar target/open-badge-designer-0.1.jar & echo $! > ./pid.file &
