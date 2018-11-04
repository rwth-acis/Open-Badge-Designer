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
[TBA changes to the PSQL database]

## PSQL XAPI Tracker
This Java application is used to track notifications from a PSQL database and build xAPI statements from them.
The statements are then transferred to a specified Learning Record Store.
As part of the Thesis, we use a [Learning Locker](https://learninglocker.net) instance reachable from within the [university network](http://cloud18.dbis.rwth-aachen.de).
Specifically, it is designed to work with an altered version of the Gamification-Frameworks PSQL database (see Gamification-Framework DB),
although any other PSQL database would work, provided it creates notifications in a suitable format.

[TBA describe format]

