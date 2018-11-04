# Open-Badge-Designer
Repository for Thesis work
'Automatic for the People - Open Badge based Learning Assessment'

## Deployed Version
[TBA]

## Front-end Setup
For a simple setup with no changes, the existing index.html can be used with the
frontend.js script.

To add the Frontend.js to an existing HTML page, the frontend.js script can simply
be added to the header. A DIV labeled "frontendUI" is required to place the UI.

In either case, the libraries jQuery and Chart.js are required (loaded via cdn in the example).
To use the [las2peer FileService](https://github.com/rwth-acis/las2peer-FileService), the [LearningLayer OIDC Button](https://github.com/learning-layers/openid-connect-button)
is needed.
With the given folder structure, the required files oidc-button.js and jws-2.0.js can be included
in a ./js folder:
- frontend/
- - index.html
- - frontend.js
- - logo.png
- - js/
- - - jws-2.0.js
- - - oidc-button.js

See the [documentation](https://github.com/learning-layers/openid-connect-button/blob/master/README.md) of the
OIDC button for information on how to register a page.
The data-scopes should be set to at least:
```
data-scope="openid email profile"
```

Due to an SSL incompatibility, badges stored via the FileService instance hosted as part of the
[Seed Network](https://las2peer.org/seed-network/) may not work with the [Mozilla badge bakery](http://bakery.openbadges.org/).
Badges hosted via a FileService instance without HTTP are fully functional, however.

## Back-end Setup
The back-end is made with JavaEE and can be built with [maven](https://maven.apache.org/) using the included pom.xml via:
```
mvn clean install
```
This results in a WAR file which can be added to any compatible [Tomcat](http://tomcat.apache.org/) instance.

## Gamification-Framework DB
The psql folder in this repository contains an example implementation of the new database changes to the 
[Gamification-Framework](https://github.com/rwth-acis/Gamification-Framework).
Setting up a new project with the framework, these files can be used in stead of the ones included in the
frameworks repository.

To implement the changes on a running instance of the Gamification-Framework, the new features can be run separately
instead.

### adding the new output function in PSQL
For this, just execute the following code on your database: 
(can be used via the console, or using a separate sql file.)
```
CREATE OR REPLACE FUNCTION PUBLIC.NOTIFY(output text) RETURNS void AS
$BODY$
BEGIN
    PERFORM pg_notify('xapilistener', output);
END
$BODY$
LANGUAGE plpgsql VOLATILE;
```

### updating relevant parts of the database to include the new output method
For this, you will need to ```CREATE OR REPLACE``` any existing functions you wish to send notifications, replacing them
with a version containing the new additions.

At any point, specifically within functions executed by triggers, to allow tracking updates to the game-state, you can use
a line like the following to send a notification whenever the code is executed:
```
PERFORM PUBLIC.NOTIFY('game:' || game_id || ',user:' || member_id || ',action:' || 'YOUR_ACTION_NAME' || ',key:' || 'YOUR_KEY' || ',value:' || YOUR_VALUE);
```
For this, the game_id of a given game and member_id of the interacting member should be known within the specific function,
as xAPI statements require an agent and an object. 
The last 2 parts of the string, key and value, are an optional addition which can be used to attach a score or similar value to an
xAPI statement.

## PSQL XAPI Tracker
This Java application is used to track notifications from a PSQL database and build xAPI statements from them.
The statements are then transferred to a specified Learning Record Store.
As part of the Thesis, we use a [Learning Locker](https://learninglocker.net) instance reachable from within the [university network](http://cloud18.dbis.rwth-aachen.de).
Specifically, it is designed to work with an altered version of the Gamification-Frameworks PSQL database (see Gamification-Framework DB),
although any other PSQL database would work, provided it creates notifications in a suitable format.

To change the database, access information, or listening channel, you can edit 
the constants defined at the beginning of the App class.

By default, the tracker listens on the channel ```xapilistener```, waiting for
notifications following the format of a String containing comma-separated 
key:value pairs.
Accepted keys are ```game user action key value``` where key and value are optional
and allow to add an extension to an xAPI statement.

An example notification:
```
game:exampleGame,user:exampleUser,action:exampleAction,key:exampleExtension,value:777
```
would result in an xAPI statement akin to:
```
{
  "actor":
  {
    "mbox": "mailto:exampleUser@example.com",
    "name": "exampleUser"
  },
  "verb":
  {
    "id": "http://example.com/exampleAction",
    "display": {"en-US": "exampleAction"}
  },
  "object":
  {
    "id": "http://example.com/exampleGame",
    "display": {"name": {"en-US": "exampleGame"}}
  },
  "result":
  {
    "completion": true,
    "success": true,
    "extensions":
    {
      "http://example.com/exampleExtension": 777
    }
  }
}
```
uploaded to the pre-set Learning Record Store.
