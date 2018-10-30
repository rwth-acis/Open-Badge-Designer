-- database: gamification_obd
-- user: gamification (needs sufficient permissions. using superuser in testing)

DROP DATABASE IF EXISTS gamification_obd;

CREATE DATABASE gamification_obd;

GRANT CONNECT, TEMPORARY ON DATABASE gamification_obd TO gamification;
GRANT ALL ON DATABASE gamification_obd TO gamification;
