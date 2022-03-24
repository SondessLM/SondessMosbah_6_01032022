# HOT TAKES #

## Installation ##

Here are the dependancies you need to install:
- NodeJS 12.14 or 14.0.
- Angular CLI 7.0.2.
- node-sass : make sure to use the corresponding version to NodeJS. For Noe 14.0 for instance, you need node-sass in version 4.14+.

//On Windows, these installations require to use PowerShell in administrator mode.

Then, clone this repo. 

## Usage ##

### Backend ###

Install npm express run `npm install`.

Create  a folder `images`.

Create a file `.env` with this url exemple `MONGO_URI=''mongodb+srv://...'`.

Run `node server`or Run `nodemon server`.

### Frontend ###

run `npm install`, and run `npm install --save-dev run-script-os`.

Run `npm start`. This should both run the local server and launch your browser.

If your brvowser fails to launch, or shows a 404 error, navigate your browser to http://localhost:8080.

The app should reload automatically when you make a change to a file.

Use `Ctrl+C` in the terminal to stop the local server.
