# iSpend
iSpend is the user friendly personal application for keeping track of spendings setting the budget.

![Screenshots](https://github.com/katieseo1/iSpend/blob/master/screenShot/responsive.png)
![Screenshots](https://github.com/katieseo1/iSpend/blob/master/screenShot/iSpendDemo.gif)

##Summary
Always running out of money before payday? Let's take control of your personal finances with iSpend.
This responsive app can help you keep track of spending and set budget. You can easily see if you are
actually keeping to your budget.  

##Live Site
You can access iSpend at http://ispend.org/

##Technical
* The front-end is built using HTML5, CSS3 and the back-end uses Node.js with Express as
the web server and mySql as the database.
* Extensive form validation is demonstrated throughout the app.
* Libraries such as D3 chart, Bootstrap, datatTables and Passport.js is also used for
data visualization, advanced css element, sortable column and user authentication.
* The app is fully responsive for mobile and desktop.
* The app is fully unit tested on the front and backend with Mocha.
* The app is deployed on the AWS EC2 Cloud.

## Setting up a project
* Create tables in the database : follow database schemas `example/database.js`
* Clone this repository: `git clone https://github.com/katieseo1/iSpend.git`
* Move into the project directory
* Install the dependencies: `npm install`
* Build the app : `webpack`
* Set up environment variables : create .env file such as `example/envSample.js`

## Running the project
* Move into the project directory
* Starts a server running at http://localhost:80

## Test the project
* Seed data : `mysql -u username –-password=your_password database_name <  test/seedData.sql`
* To run the test : 'npm test'
* Demo/Login password : `test`, `123456`
