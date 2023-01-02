Steps to run the server

Note : You need to have Node installed

1. Goto the project folder location
2. Open Command Prompt
3. type nodemon and enter  
4. The server will be started at 3000 port

There are 3 Routes

1. /abandoned-checkout (POST):  A webhook to register for sending predefined scheduled messages to user 

2. /order-placed/{abandoned Cart Id} (PATCH): To update the db and stop sending scheduled messages

3. /logs  (GET): To view all the messages sent