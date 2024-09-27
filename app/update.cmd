echo off
set /p "tag=Enter Version: "
docker build -t phonegallery:%tag% .
docker tag phonegallery:%tag% docker.lamour.bzh/phonegallery:%tag%
docker tag phonegallery:%tag% docker.lamour.bzh/phonegallery:latest
docker push docker.lamour.bzh/phonegallery:%tag%
docker push docker.lamour.bzh/phonegallery:latest
pause