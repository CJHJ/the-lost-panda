# The Lost Panda

## Description

A simple endless running game built for a particular school assignment in 2015. The backend server is developed over Node.js (modified over the OpenShift sample application, hence the weird comments), and the game itself is a CreateJS-based JavaScript game. The website is a Single Page Application, using AngularJS modal dialogs for navigations.

## Requirements

```
node 10.0.0 and above
express 3.11.0 and above
body-parser 1.19.0 and above
compression 1.7.4 and above
MongoDB 4.2 and above
MongoDB Client 3.3.5 and above
```

## Installing and Running

Start the MongoDB ```mongod``` server and then run ```npm install``` at project root directory. Every dependencies will be installed, and after that run the server by executing ```npm start```. Don't forget the credentials of your MongoDB database to properly connect your app to your MongoDB server. Create a file named ```db_cred.json```, and populate it with a json specified below.
```
{
    "mongoHost": "<host>",
    "mongoPort": "<port>",
    "mongoDatabase": "thelostpanda",
    "mongoUser": "<username>",
    "mongoPass": "<password>"
}
```
<> inidicates parts that is needed to be populated with your MongoDB credentials.

## Disclaimer

As this project is no longer being maintained (except some fixes to comply with current deprecation standard) since its conceivement in 2015, you might find some coding style (and comments) that will not adhere to current standards (read: not clean at all, inconsistent commenting style, and others). 

## Authors

Calvin Janitra Halim  
Shunsuke Ochi  
Hayate Nakayama


