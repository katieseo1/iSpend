# iSpend
iSpend is a user friendly personal financial application to track of daily spending and budget by category.

![Screenshots](https://github.com/katieseo1/iSpend/blob/master/screenShot/responsive.png)

![Screenshots](https://github.com/katieseo1/iSpend/blob/master/screenShot/iSpendDemo.gif)

## Summary
Always running out of money before payday? Let's take control of your personal finances with iSpend. This responsive app can help you keep track of your spending and set the budget. You can easily see what your actual spending is and compare it with your budget. By tracking your spending behavior, you can find ways to save money.

## Live Site
You can access iSpend at http://ispend.org/

## Technical
* The front-end is built using HTML5, CSS3 and the back-end uses Node.js with Express as
the web server and MySQL as the database.
* Extensive input data validation is demonstrated throughout the app.
* Libraries such as D3 chart, Bootstrap, dataTables and Passport.js are used for
data visualization, advanced css element, sortable column and user authentication.
* The web application is fully responsive for both mobile and desktop.
* Using Mocha and Chai javaScript test framework, the app is fully unit tested on the front and backend.
* The app is deployed on the Amazon EC2 instances.

## Setting up a project
* Create tables in the database : follow database schemas `example/database.js`
* Clone this repository: `git clone https://github.com/katieseo1/iSpend.git`
* Move into the project directory
* Install the dependencies: `npm install`
* Build the app : `webpack`
* Set up environment variables : create .env file such as `example/envSample.js`

## Running the project
* Move into the project directory
* Starts a server running at http://localhost:3000

## Test the project
* Seed data : `mysql -u username –-password=your_password database_name <  test/seedData.sql`
* To run the test : 'npm test'
* Demo/Login password : `test`, `123456`
