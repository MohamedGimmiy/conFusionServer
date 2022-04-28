## conFusionServer-nodejs&express App


## Overview
ConFusionServer is a back-end ( node js & express js app) that serves the front-end client side,
it contains several components of back-end such as (passport-OAuth & local & third party(facebook) Authentication),
also it includes cors and admin & user restricts for several sections, in addition to mongoose schemas & routers & generators & encryption using https protocol (signed certificate) and redirecting from http to https.
ConFusionServer is a complete back-end app that consists of 2 layers (express server and database server which is mongodb)



## Table of contents (contents)

* Project main elements 
    - **express server** using (npm i express --save)
    - **morgan module** for log any info requests on console
    - **body-parser** for parsing body to json object 
    - **express-generator module** for generating an express project skeleton
    - **mongodb server** for storage as a NoSql dataabse 
    - **mongodb driver** for connecting to mongodb  
    - **mongoose module** for connecting to mongodb and define a fixed schema 
    - **cookie-parser** for dealing with authentication using cookies
    - **session & session-file-store** for dealing with authentication using sessions
    - **passport & passport-local & passport-local-mongoose** for dealing with authentication using local passport
    - **passport-jwt & jsonwebtoken** for dealing with authentication using json web token instead of sessions & cookies
    - **passport-facebook-token** for dealing with authentication using OAuth
    - **multer** for dealing with uploading images from forms and encryption
    - **openssl** generating certificate for https purposes
    
* Some End points for dealing with server (postman)
    - see end points folder (import end points to postman)

### npm & openssl commands
    * npm i express --save
    * npm install morgan --save
    * npm i body-parser --save
    * npm i express-generator -g
    * express conFusionServer
    * mongod --dbpath=data --bind_ip 127.0.0.1
    * mongo 
    * npm i mongodb --save
    * npm i assert --save
    * npm install mongoose --save
    * npm install mongoose-currency --save
    * npm i cookie-parser --save
    * npm i express-session session-file-store --save
    * npm install passport passport-local passport-local-mongoose --save
    * npm i passport-jwt jsonwebtoken --save
    * openssl req -newkey rsa:2048 -keyout private.key -out cert.csr
    * openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem
    * npm i multer --save
    * npm i cors -save
    * npm i passport-facebook-token --save

### mongodb commands (mongodb shell)
    * db
    * use conFusion
    * db.help()
    * db.dishes.insert({"name":"pizza", "description":"Test"});
    * db.dishes.find().pretty()
    * db.getCollectionNames()
    * db.dishesdb.drop()
    * exit


## How to install

* First intall node js from [here](https://nodejs.org/en/)
* Second install all modules using previous commands
* Third install and config mongodb and follow instruction [here](https://www.mongodb.com/)
* Fourth run mongodb and express server and enjoy :D
