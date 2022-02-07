# MondialRelay

## Overview
This project is intended to find a relay point and create customs stickers in an easier way than the original MondialRelay API.

This program contains an API and a front-end website.

This application intermediates between the client (a website or other service) and the MondialRelay API by translating requests and responses from XML to JSON. 

## How to use it

First you need to clone this project and open it with a code editor like Visual Studio Code.

Then, you need to download the node modules in the back, front and global application.

### Back-end application
```bash
cd back
npm i
```
### Front-end application
```bash
cd front
npm i
```
### Global application (to run both applications)
```bash
npm i
```

if you need to go in the parent folder, you can use
```bash
cd ../
```

Finally, to run the application you can run
```bash
npm start
```

## Technologies used

The API is running thanks to Nodejs and some other modules.

The Website is running with parcel, a node module.

The 'global application' is running both front and back with concurrently module.

---

Warning : **If you are using back-end app**: 
You need to create a database with mongoDB and include it in your .env file.

Same with a private key used for the encryption of passwords.


## Resources

[MondialRelay](https://www.mondialrelay.fr/)

[Leaflet](https://leafletjs.com/)

[Fontawesome](https://fontawesome.com/)

## Authors

[NolannC](https://github.com/nolannC)

[Mathieu-URA](https://github.com/Mathieu-URA)

[morganeHi](https://github.com/morganeHi)

[Bllrt-cindy](https://github.com/Bllrt-cindy)