import os
from flask import Flask, jsonify
from spotipy import *
from spotipy.oauth2 import *

app = Flask(__name__)

checkpoint = False
SPOTIFY_CLIENT_ID = os.environ['SPOTIFY_CLIENT_ID']
SPOTIFY_CLIENT_SECRET = os.environ['SPOTIFY_CLIENT_SECRET']
auth_manager = SpotifyOAuth(scope="user-read-currently-playing",
                            client_id=SPOTIFY_CLIENT_ID, client_secret=SPOTIFY_CLIENT_SECRET, redirect_uri="http://localhost:8080/")
spotifyObject = Spotify(auth_manager=auth_manager)


@app.route('/config')
def config():
    global checkpoint
    current_song = spotifyObject.currently_playing()
    checkpoint = True
    return jsonify({'success':True})

@app.route('/update')
def update():
    global checkpoint
    if checkpoint:
        current_song = spotifyObject.currently_playing()
        return jsonify(current_song)
    else:
        return jsonify({'success':False})


if __name__ == '__main__':
    app.run(port=7777)
