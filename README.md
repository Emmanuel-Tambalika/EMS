// Following is my Project Setup flow 
// Using VITE  For the front end Application. 'Dont create a frontEnd folder just yet '
npm create vite@latest 

project name ...> frontend
select react
select javascript 
cd frontend 
type in  ->   npm i
  
//Add More Packages .
npm i react-router-dom axios react-cookie notistack react-icons recoil date-fns framer-motion zustand socket.io-client react-hot-toast lucide-react

Folder Setup 

For the BackEnd Application.
npm init -y (Inside My  Folder )
type-> clear in command Line .
inside json file insert: "type":"module" below description.

// next install express and nodemon .
npm i express nodemon bcryptjs cors jsonwebtoken mongoose cookie-parser cron dotenv socket.io

    Main :"backend/index.js"
inside json file  under Script remove the following:
 "test": "echo \"Error: no test specified\" && exit 1"
 and insert the following .
           (Needs Update for Deployment)
         "dev":  " nodemon backend/index.js",
		"start": " node backend/index.js",

npm install --save @stripe/stripe-js @stripe/react-stripe-js
