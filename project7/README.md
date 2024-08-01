# Photo App
## Set Up
```npm run build``` - Runs Webpack using the configuration file webpack.config.js to package all of the projects JSX files into a single JavaScipt bundle in the directory compiled.<br>
```npm run build:w``` - Runs Webpack like the "run build" command except it invokes webpack with --watch so it will monitor the React components and regenerates the bundle if any of them change.<br>
```node loadDatabase.js``` - Load the photo app data<br>
```nodemon webServer.js``` - Start the web server and watch for any changes to the server code and automatically restart the web server: