In order to run this application successfully on linux you must first set a password for the “Student” user in POSTGRESQL.
To do this, open a terminal and run the following commands: 
sudo -u postgres psql
alter user student with encrypted password 'student';

once this is done, you can now download the vaindbnode file and run the vaininstall.js script with node
to do this, open a terminal, navigate to where ever the downloaded file is and run this command:
node vaininstall.js
this install script will create a new schema ‘vain_db’ in the postgres database.
 you will now see the new schema and all of its data loaded in postgresql.
