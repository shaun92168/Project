# Project
This is our main/live repositry

Dependencies:
1. Install Node
2. Go to the right directory to install node_modules
3. npm install express --save
4. npm install --save handlebars
5. npm install file-system --save
6. npm install mongodb --save
7. npm install -g jsdoc
8. npm install client-sessions

Getting the documentation:
1. navigate to the repository directory
2. jsdoc server.js

Merging the main repository to your local repository:
1. open git bash and move to the correct directory
2. git fetch upstream
3. git merge upstream/master
4. merge any conflicting changes in an editor
5. git push origin master

Unit Testing:
1. We are using "Jest" to test our code
2. npm install --save-dev jest