# ReactJS JWT Authentication
JWT Authentication using ReactJS.

Overall flow of JWT authentication:
1. When a client login, the server returns two tokens to the client (*Access token* and *Refresh token*)
2. The *Access token* has a shorter expiry time than the *Refresh token*.
3. The client stores the *Access token* in memory, and the *Refresh token* in a cookie.
4. The client uses the *Access token* for calling API in the server.
5. When the *Access token* expires, the client uses the *Refresh token* to request a new token pair.
6. When the *Refresh token* expires, the client will be forced to logout.

## Setup
Install yarn packages
```bash
yarn install
```
Start backend server
```bash
cd backend
go build server.go
./server
```
Start React app in another terminal
```bash
yarn start
```
The webpage should be running on [http://localhost:3000](http://localhost:3000).

Use FireFox Browser. Chrome does not support CORS cookies for localhost.
