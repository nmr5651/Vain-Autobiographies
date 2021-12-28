An easier way to run this is to cd in the Team2-ProjectVain folder (or whatever it's called on your system) and then run 'npm install' to install the package required and then run 'npm run start'.  It will start both the server and the client at the same time, but will display a lot of output.  This is ok as long as no errors are present.  You may need to cd into the vain-backend and vain-client folders and run 'npm install' in both of them before running 'npm run start' if you run into any issues.

To run for development purposes:
- should have vain_db created
- in vain-backend folder open cmd window
-- run npm install
-- run npm run serve
-- should display 'running on port 5000' or some similar message
-- check http://localhost:5000/books and the books data should be displayed (as gross non-formatted json)

- while vain-backend is still running
- in vain-client folder open new cmd window
-- run npm install again
-- run npm run serve
-- should display 'app running at localhost:8080'
-- go to http://localhost:8080/ to verify that the add a book form is displayed and the table w/all of the book data is also

*note if your login information for postgres is different than user=postgres and password=student you will need to go into index.js in the vain-backend folder to reflect that (lines 11-18)*
