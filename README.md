osu!Info

Site will have:

1) User stats 
    -/get_user, pfp endpoint, and /get_user_recent (need to get beatmap endpoint done for the recent scores), also add copy id for the IDS to use in beatmap

2) Compare two users
    -/get_user, pfp endpoint, and /get_user_best

3) Beatmap search (DONE, data has been generated)
    -/get_beatmaps, cover img endpoint

4) Multiplayer information
    -/get_match


Current task:
    -Make the getUserData function send out all 3 api calls for the User stats, while combining each call's data into a consolidated object


Todo:
    -Add try catch for all api calls. In the catch block, set up dummy text/imgs like in prev. project



