# Schedule Management System

## _Description_

The project is on a meeting scheduling management system. There can be multiple users trying to book a meeting on a specific day in a specific time slot. There is a fixed number of rooms (five by default). We can change the number as we please. A host user can add multiple guest users to a meeting. In the event of any overlap between the the users, rooms and the timeslot, there are proper error responses. You can see all the meetings a room has and a user has (as a guest or host) in a timely sorted order on specified endpoints.


## Installation

#### 1) Clone the repository:
    git clone <>
#### 2) Install all the dependencies:
On the project root folder, run:
    
    npm install
#### 3) Add a config.env file:
We have used mongoDB as our database. So, in order to connect to the local database, we'll need 3 values, and we've kept it in **config.env** in tha path-  **/config**:
    
- Create a file named **config.env** inside the folder, **/config**.
- Add 3 env variables eg:
    ```
    MONGOHOST=localhost
    MONGOPORT=27017
    DATABASENAME=<Your DB name>
    ```
#### 4) Start the project:
From the root folder, start the project by running:
   
    npm start
    
## Features and endpoints

In case you have Postman installed, you can import the endpoints **with documentation** inside
`Docs/Schedule management system.postman_collection.json`
or click [here]() <>.

Otherwise I'm adding the endpoints with brief description.

##### 1) /api/v1/users [Method: POST]
###### Description:
Creates a user, in a sequencial order. Eg: U1, U2, U3.
###### Body:
*Empty*
###### Query-params:
*Empty*
****
##### 2) /api/v1/users [Method: GET]
###### Description:
Lists all the users. We can view all the userIds.
###### Body:
*Empty*
###### Query-params:
*Empty*
****
##### 3) /api/v1/schedule [Method: POST]
###### Description:
Create a schedule meeting.
###### Body:
_**userId**_: The userId of the **Host user**,
_**roomId**_: The roomId. Must be one of **["R1", "R2", "R3", "R4", "R5"]**, We can add more room in **/utils/RoomList.js**.
_**guestUsers**_: An **array** of the userIds of the **guests(userId)**.
_**meetingDate**_: Date of the meeting in **YYYY-MM-DD** format
_**startTime**_: Start time of the meeting in **HH:MM** format.
_**endTime**_: End time of the meeting in **HH:MM** format.
###### Query-params:
*Empty*
****
##### 4) /api/v1/schedule/byUser [Method: GET]
###### Description:
List all the meeting a user has, in a **timely sorted** order.
###### Body:
*Empty*
###### Query-params:
_**userId**_: The userId of the of the user we want to view meetings of.
****
##### 5) /api/v1/schedule/byRoom [Method: GET]
###### Description:
List all the meeting a room has, in a **timely sorted** order.
###### Body:
*Empty*
###### Query-params:
_**roomId**_: The roomId. Must be one of **["R1", "R2", "R3", "R4", "R5"]**, We can add more room in **/utils/RoomList.js**.
****

## Tech Stack

Our schedule management system backend has the following tech stack.

- [node.js](https://nodejs.org/en/) - For backend runtime.
- [Express.js](https://expressjs.com) - For easily creating the REST API.
- [MongoDB](https://www.mongodb.com) - As the Database. **mongoose** for object modeling in node.
- [Git](https://git-scm.com) - For source control.

## Docs
To view the doc where we've elaborated on the design pattern and features, you can go to **/Docs/description** <> or click [here]()<>

## Conclusion
For perfectly saving the date/time irrespective of the timezone inside the DB (mongoDB), we've followed, 
` https://www.mongodb.com/docs/v3.2/tutorial/model-time-data/`

As MongoDB saved all the time in UTC format, we've converted to the runtime(node.js) timezone while data retrieval for a better user experience.
We can change the timezone from the runtime to specific user/clients also, the code is flexible enough.


#### Thanks for checking it out. Have a great day.