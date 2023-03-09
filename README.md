# Equipment Booking App

This web app is for booking assets in a organisation. It's originally developed for booking it equipment in a high school. It can be used for other type of equipment.

It is somewhat configurable, but it's not very flexible. 

## Features

 - Opend ID signin
 - Admin interface
 - Create bookings
 - Deploy and return assets to people
 - Preload users manually if doesn't exist in the system or never logged in
 - Limit time of booking
 - Limit extent of booking to a single day

## Stack

It is made using next.js and t3 stack (create.t3.gg). It uses sqlite as database.

## Installation

 - Clone the repo
 - Install dependencies with `npm install`
 - Setup envirnonment variables (see .env.example)
 - Run `npm run dev` to start the dev server
 - Run `npm run build` to build the app
 - Run `npm run start` to start the app


## Configuration

See .env.example for configuration options. You can set them in a .env file in the root of the project or as normal environment variables.

You can also use Docker to deploy the app. See the docker-compose.yml for more information.