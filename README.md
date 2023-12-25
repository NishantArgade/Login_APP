Login App Project SETUP:

Frontend SetUP:

Go to Client Folder:
```
cd client
```
Install Dependencies:
```
npm i
```
Run Frontend:
```
npm run dev
```
Add .env File:
```
VITE_REACT_APP_SERVER_DOMAIN= <backend-server-base-url>
```

---------------------------------------------------------------
Server SetUP:

Go to Server Folder:
```
cd server
```
Install Dependencies:
```
npm i
```
Run Frontend:
```
npm run start
```

Add config.js file at root in the server folder :
```
export default {
  JWT_SECRET: <your-jwt-secret>,
  MAIL: <your-mail-address>,
  PASSWORD: <your-mail-password>,
  ATLAS_DB_URL: <your-mongodb-url>
};
```
