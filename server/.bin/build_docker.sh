#!/bin/bash
docker build --tag server .
docker run -p 6000:6000 server