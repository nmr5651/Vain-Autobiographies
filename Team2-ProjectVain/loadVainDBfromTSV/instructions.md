To run:
  * In order to run this application successfully on linux you must first set a password for the “Student” user in POSTGRESQL.  Or, if you have your own user defined, 
  you can update the name an pw in the creds.js file before running the script
  * To update the student password, open a terminal and run the following commands: 
	```
	   sudo -u postgres psql
       ALTER USER student with encrypted password 'student';
	   ALTER USER student CREATEDB;
	```

  * once this is done, you can now download the vaindbnode file and run the vaininstall.js script with node
  * before running open the creds.js file and change user/password if needed and save the updated file
  * with user/password being correct, open a terminal, navigate to where ever the downloaded file is and run this command:    
	```	
	  npm install
      node vaininstall.js
	```  
  * this install script will create a new database ‘vain_db’ on the postgres server and place all teh tables in teh 'public' schema.
  * you will now see the new schema and all of its data loaded in postgresql.
