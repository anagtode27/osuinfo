# osu!Info

## Website that displays information about the rhythm game, osu!, using their osu!api-v1.

### Installation:

1) From any directory, clone the repository and move into it.

```console
~$ git clone git@github.com:anagtode27/osuinfo.git
~$ cd osuinfo
```

2) Run ```npm install``` to install all node dependencies for the application.

```console
~/osuinfo$ npm install
```
3) Run ```node server.js``` to start the server, and you should get the following output (To close the server, press Ctrl+C in the same terminal).

```console
~/osuinfo$ node server.js
The server is now listening on port 3000
```
4) Open your a web browser and go to ```localhost:3000```.






















For myself:

Tasks (no order, choose between):

    -Find website logo (ask some AI model to make it?) (easy)

    -Style things better (medium)
    -Work on extending functionality for beatmap and multiplayer(medium)
    -Work on implementing enum reader for mod (medium)
    
    -Implement server-side try-catch on API and send back to client, learn how to process that (hard) 
     
Potential Future Improvements, if revisiting project:

    -Make website mobile-responsive
    -Consider adding chatGPT functionality, maybe to give extended summaries of players
    -Consider redoing this project with the updated osu!api-v2 and a better website design
    