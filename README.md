# AnthroProject
This project is a small Web App compatible with Android meant to facilitate software project management within development teams. It keeps track of developper's skillsets through profile sheets and facilitates task assignation using those entered skillsets. As a project management application, it is also possible to create, delete and modify various tasks. When it comes to visualisation, a Gantt diagram and a task list will be available.

This project was made as part of the Project Management class (410-654-FD) at Cégep à Distance.

## To build the project in android:
``` bash
npm run build
cordova build android
```
After this, a .apk installation file should be in C:\Users\Mr_Marcoux\Downloads\AnthroProject\platforms\android\app\build\outputs\apk in the debug or the release folder.

## To build and run the project in browser:
``` bash
npm run build
cordova build browser
cordova run browser
```
Alternatively, it's possible to simply run the command

``` bash
npm start
```


## Useful npm commands:
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```