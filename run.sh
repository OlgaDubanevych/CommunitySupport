#!/bin/bash
ls -l /app
echo "Classpath: $CLASSPATH"
java -cp "/app/*" backend.JavaBackend

