# Open-Badge-Designer
Repository for Thesis work
'Automatic for the People - Open Badge based Learning Assessment'

## Deployed Version
A deployed front-end instance can be found at http://ginkgo.informatik.rwth-aachen.de/badges/index.html as part of this thesis.

The corresponding back-end instance, available from within the university network, can be found on http://cloud17.dbis.rwth-aachen.de:8081/OpenBadgeDesigner/ and the connection can be checked from the browser via this request: http://cloud17.dbis.rwth-aachen.de:8081/OpenBadgeDesigner/checkconnection

Step by Step Tutorial (/example workflow):
- Navigate to http://ginkgo.informatik.rwth-aachen.de/badges/index.html
- To gain access to the las2peer FileSerivce, click the logo in the upper left corner and log into Learning Layers (register if you have no account, email must be spelled lowercase)
- After the app is authorized and you return to the front-end UI, enter Assisted Badge Design Mode
    - Backend:
        In a real use-case, different Back-end instances (with varying access rights) could exist. Right now, the only one is located at: http://cloud17.dbis.rwth-aachen.de:8081/OpenBadgeDesigner , you can enter this and click 'Set Backend Connection' to set the connection details and check if a connection can be established.
    - Learning Record Store:
        Again, one or several communities of learners could have various Learning Record Stores. For evaluation, the following one was used:
        http://cloud18.dbis.rwth-aachen.de
        with Authorization (also selects a specific store at the hosted location):
        ```Basic ZjlkYWJlZDg2MTgzNTNiYTAxOWIzMGEyZDlhYWY4ODM4NTRmZWYxZDo4NjlmMDc4NzYyNjc0MTc5MDZlMjkwNDRlYzhiNDE4ZGJiOWQxZmI0```
        
        After entering this information, you can click 'Set LRS Connection' to confirm the input and check if everything is working.
    - Declarations:
        This section allows to specify which information should be considered. 
        Options for this could be looked up manually within an LRS or provided by the LRS administrator.
        For evaluation, the following data should work:
        - Possible Statement Keys: (recommended: hour)
            ```hour```,```timestamp```,```day```,```month```, ```http://example.com/customData```
        - Possible Verbs: (currently only one is used in the dataset)
            ```http://example.com/verbs/exampleVerb```
        - Possible Activities (objects): (currently only one is used in the dataset)
            ```http://example.com/activities/exampleActivity```
        - You may leave the optional constraints field empty. 
            Adding additional constraints allows to look only at specific agents or otherwise restrict the LRS search
        - You may leave the timestamps empty for default, or enter a timeframe.
            Due to uploading data manually for evaluation instead of having data generated naturally as user 
            activity comes in, the timestamps do not properly match up. As a result, restricting the timeframe to
            reduce the number of displayed statements does not work as intended on the given data set.
            Defaults:
            - Since: ```2001-01-01T00:00:00.000Z```
            - Until: ```2019-01-01T00:00:00.000Z```
        You can click Analyse to send a request to the back-end, creating a visualisation of the data set and generating badge recommendations.
    - Analytics:
        At this point a bar chart should appear in the upper right-hand side of the UI, visualising the data.
        For the example of the 'hour' key, it should show which daytimes had the most user interactions in the generated data set.
        In the future, this could contain various other views and numbers on the requested LRS fields, since [Analytics](https://en.wikipedia.org/wiki/Analytics) entails the
        discovery and communications of patterns, particularly in big data, this section title should become more appropriate as additional information is being shown in future additions.
    - Recommendations:
        Recommendations generated by the back-end should be shown below the analytics section.
        A recommendation can be removed by clicking the 'X' button, or applied to the Open Badge Survey (see below) via the 'Apply' button.
    - Open Badge Survey:
    
        This section allows to generate any files necessary to create a functional Open Badge and uploads them to the
        FileService. Additionally, the user can download any files to host them manually elsewhere.
        For the survey, you may go through all fields in order and edit them as you please.
        If recommendations are used, some of the fields will be filled in with presets automatically.
        Additionally, the URLs part of the BadgeClass will be filled in automatically when uploading files to the FileService.
        For manual hosting, the URLs must match with the hosted location to link the various files and make baking possible.
        
- Manual Badge Design Mode:
    This mode contains all the same fields needed to create a functional Open Badge, without the use of the back-end.
    No recommendations or visualisation here. Just a simplified UI in case you already know exactly what badge you want to make.
    
- Data Comparison Mode:
    The same data as for the Assisted mode can be used here to display the LRS data at two separate time-frames.
    This allows to compare how user-interaction in a system changed after the introduction of a new badge, or
    other improvements.
    With only one data-set uploaded for evaluation, the charts will look the same here, as different timeframes do not really exist.
    When using naturally generated data from real user interaction, varying timestamps will be included automatically, however.
        

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
The used FileService instance can be set using the respective constant in the frontend.js file.

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
