@echo off
REM Set variables
set PGUSER=postgres
set PGPASSWORD=SUMadhusha17458
set PGHOST=localhost
set PGPORT=5432
set NEWUSER=madhusha
set NEWUSERPASSWORD=SUMadhusha
set NEWDATABASE=labsync_desktop
set DUMPFILE=%~dp0database-dump\labsync_desktop_backup.sql

REM Create new user
echo Creating new user...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d postgres -c "CREATE USER %NEWUSER% WITH PASSWORD '%NEWUSERPASSWORD%';"

REM Create new database
echo Creating new database...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d postgres -c "CREATE DATABASE %NEWDATABASE%;"

REM Grant privileges to the new user
echo Granting privileges to new user...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE %NEWDATABASE% TO %NEWUSER%;"

REM Import dump file into the new database
echo Importing dump file...
pg_restore -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %NEWDATABASE% %DUMPFILE%

echo Database setup and import complete.
pause