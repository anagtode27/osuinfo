# osu!Info

Web application that displays information about the rhythm game osu!, using their osu!api-v1.

---

### Link to the deployed app: <no link yet>

### Alternatively, set up the app locally.
---
Note: These instructions have been written to work well with Linux.

#### Prerequisites: 

- Node.js (and npm) installed
- An osu! account with a registered API key


1) Clone the repository and move into it.

```console
~$ git clone https://github.com/anagtode27/osuinfo.git
~$ cd osuinfo
```
2) Set up the required ```.env``` file. Replace ```YOUR_API_KEY_HERE``` with your own key.

```console
~/osuinfo$ echo "API_KEY=YOUR_API_KEY_HERE" > .env
```

3) Install all node dependencies for the application.

```console
~/osuinfo$ npm install
```
4) Start the server. You should get the following output.

```console
~/osuinfo$ node server.js
The server is now listening on port 3000
```
5) Open a web browser and go to ```localhost:3000```. When finished, close the server in the terminal with Ctrl+C.
----

   