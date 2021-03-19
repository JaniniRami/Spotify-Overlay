# Spotify Music Overlay
Cross platform Spottily music overlay app build with Electron and Flask.

![Spotify-Overlay Design.](https://github.com/JaniniRami/Spotify-Overlay/blob/main/Design%20Files/design.png?raw=true)

# Requirements
* Python3
* npm
* Electron.js

# Installation and Setup
- Donwloading spotify-overlay:<br>
```git clone https://github.com/JaniniRami/Spotify-Overlay```
- Downloading npm packages:<br>
```npm install```
- Downloading python libraries:<br>
```python3 -m pip install -r requirements.txt```
- Making a spotify app:<br>
1) Head to https://developer.spotify.com/dashboard and log in with your spotify account.
2) Create new app:<br>
![Create spotify app.](https://github.com/JaniniRami/Spotify-Overlay/blob/main/imgs/1.png?raw=true)
3) Click on edit settings and add ```http://localhost:8080/```  as a redirect URL:<br>
![Create spotify app.](https://github.com/JaniniRami/Spotify-Overlay/blob/main/imgs/2.png?raw=true)
4) Save the new settings then add the client ID and Secret to your enviroment variables:<br>
![Create spotify app.](https://github.com/JaniniRami/Spotify-Overlay/blob/main/imgs/3.png?raw=true)
 - ```Control Panel --> System and Security --> System --> Advanced system settings --> enviroment variables```
 - Under system variables add two new variables:
   - ```SPOTIFY_CLIENT_ID``` (containing your spotify client id.)
   - ```SPOTIFY_CLIENT_SECRET``` (containing your spotify secret key.)
 5) Run spotify-overlay:<br>
 ```npm start```
 6) You can run ```npm run make```, to generate an exe file of spotify-overlay.
 
 # To-do
 * Add custom close button.
 * Add song time duration.
 
