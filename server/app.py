from flask import Flask, jsonify, request, make_response, send_file, Blueprint
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from flask_sqlalchemy import SQLAlchemy
from mutagen.mp3 import MP3
from PIL import Image
from io import BytesIO
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = "22334111"

SQLALCHEMY_DATABASE_URI = (
    "mysql://{username}:{password}@{hostname}/{databasename}".format(
        username="mgpp",
        password="galih451",
        hostname="localhost",
        databasename="musics",
    )
)


app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"pool_recycle": 280}

# membuat route folder upload file mp3
UPLOAD_FOLDER = "static/files"
UPLOAD_IMG = "static/img"
UPLOAD_PLAYLIST_IMG = "static/img/playlist"

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["UPLOAD_IMG"] = UPLOAD_IMG
app.config["UPLOAD_PLAYLIST_IMG"] = UPLOAD_PLAYLIST_IMG

# Helper function to check if the file extension is allowed

ALLOWED_EXTENSIONS = {"mp3"}
ALLOWED_EXTENSIONS_IMG = {"png", "jpg", "jpeg", "svg", "webp"}

api_v1 = Blueprint("api_v1", __name__)

db = SQLAlchemy()
db.init_app(app)


class Musics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(255))
    name = db.Column(db.String(255))
    artist = db.Column(db.String(255))
    image = db.Column(db.String(255))
    playlists = db.relationship(
        "Playlists", secondary="music_playlist", back_populates="musics"
    )


class Playlists(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    image = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user = db.relationship("Users", back_populates="playlists")
    musics = db.relationship(
        "Musics", secondary="music_playlist", back_populates="playlists"
    )


class MusicPlaylist(db.Model):
    __tablename__ = "music_playlist"
    id = db.Column(db.Integer, primary_key=True)
    music_id = db.Column(db.Integer, db.ForeignKey("musics.id"), nullable=False)
    playlist_id = db.Column(db.Integer, db.ForeignKey("playlists.id"), nullable=False)


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    music_category = db.relationship("MusicCategory", backref="category", lazy=True)


class MusicCategory(db.Model):
    __tablename__ = "music_category"
    id = db.Column(db.Integer, primary_key=True)
    music_id = db.Column(db.Integer, db.ForeignKey("musics.id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=False)
    musics = db.relationship("Musics", backref="music_category", lazy=True)


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    playlists = db.relationship("Playlists", back_populates="user")


@app.get("/stream_audio/<audio_filename>")
def stream_audio(audio_filename):
    audio_path = os.path.join(
        app.root_path, app.config["UPLOAD_FOLDER"], audio_filename
    )

    if os.path.exists(audio_path):
        file_size = os.path.getsize(audio_path)
        start = 0
        end = file_size - 1

        # Check if "Range" header is present in the request
        if "Range" in request.headers:
            range_header = request.headers.get("Range")
            parts = range_header.replace("bytes=", "").split("-")
            if len(parts) == 2:
                start = int(parts[0])
                end = int(parts[1]) if parts[1] else file_size - 1
            elif parts[0]:
                start = int(parts[0])

        content_length = end - start + 1

        with open(audio_path, "rb") as audio:
            audio.seek(start)
            data = audio.read(content_length)

        response = make_response(data)
        response.headers["Cache-Control"] = "public, max-age=7200"  # Cache for 2 hour
        response.headers["Expires"] = (datetime.now() + timedelta(hours=2)).strftime(
            "%a, %d %b %Y %H:%M:%S GMT"
        )
        response.headers["Accept-Ranges"] = "bytes"
        response.headers["Content-Range"] = f"bytes {start}-{end}/{file_size}"
        response.headers["Content-Length"] = content_length
        response.headers["Content-Type"] = "audio/mp3"
        return response, 206  # Partial Content status code
    else:
        return make_response(jsonify("File not found"), 404)


@app.get("/")
def index():
    return make_response(jsonify("Hello World!")), 200


@app.route("/img/<image_filename>")
def stream_compressed_image(image_filename):
    image_path = os.path.join(app.root_path, app.config["UPLOAD_IMG"], image_filename)

    if os.path.exists(image_path):
        # Open the original image
        original_image = Image.open(image_path)

        # Create an in-memory buffer to save the compressed image
        compressed_image_buffer = BytesIO()

        # Compress the image with the desired quality (JPEG) or optimize (PNG)
        if original_image.format == "PNG":
            original_image.save(compressed_image_buffer, format="PNG", optimize=True)
        else:
            original_image.save(compressed_image_buffer, format="JPEG", quality=50)

        # Set the buffer position to the beginning
        compressed_image_buffer.seek(0)

        # Stream the compressed image
        response = make_response(
            send_file(
                compressed_image_buffer,
                as_attachment=False,
                mimetype=f"image/{original_image.format.lower()}",
            )
        )
        # Set cache headers
        response.headers["Cache-Control"] = "public, max-age=3600"  # Cache for 1 hour
        response.headers["Expires"] = (datetime.now() + timedelta(hours=1)).strftime(
            "%a, %d %b %Y %H:%M:%S GMT"
        )

        return response, 200
    else:
        return make_response(jsonify("File not found"), 404)


@app.get("/playlist/img/<image_filename>")
def stream_playlist_image(image_filename):
    image_path = os.path.join(
        app.root_path, app.config["UPLOAD_PLAYLIST_IMG"], image_filename
    )

    if os.path.exists(image_path):
        # Open the original image
        original_image = Image.open(image_path)

        # Create an in-memory buffer to save the compressed image
        compressed_image_buffer = BytesIO()

        # Compress the image with the desired quality (JPEG) or optimize (PNG)
        if original_image.format == "PNG":
            original_image.save(compressed_image_buffer, format="PNG", optimize=True)
        else:
            original_image.save(compressed_image_buffer, format="JPEG", quality=50)

        # Set the buffer position to the beginning
        compressed_image_buffer.seek(0)

        # Stream the compressed image
        response = make_response(
            send_file(
                compressed_image_buffer,
                as_attachment=False,
                mimetype=f"image/{original_image.format.lower()}",
            )
        )
        # Set cache headers
        response.headers["Cache-Control"] = "public, max-age=3600"  # Cache for 1 hour
        response.headers["Expires"] = (datetime.now() + timedelta(hours=1)).strftime(
            "%a, %d %b %Y %H:%M:%S GMT"
        )

        return response, 200
    else:
        return make_response(jsonify("File not found"), 404)


@api_v1.delete("/delete/<int:music_id>")
def delete_music(music_id):
    try:
        music = Musics.query.get(music_id)

        if music:
            # Delete the music record
            db.session.delete(music)
            db.session.commit()

            return (
                make_response(
                    jsonify({"message": f"Music with ID {music_id} has been deleted"})
                ),
                202,
            )
        else:
            return (
                make_response(
                    jsonify(
                        {
                            "message": f"Music with ID {music_id} not found in the database"
                        },
                    )
                ),
                404,
            )
    except Exception as e:
        # Handle any errors that might occur during the database operation
        db.session.rollback()
        return (
            make_response(
                jsonify(
                    {
                        "message": f"Failed to delete music with ID {music_id}",
                        "error": str(e),
                    }
                ),
            )
        ), 500


@api_v1.post("/upload")
def upload_music():
    # Method to get file from form data
    form_data = validate_form_data(request)

    if not form_data:
        return make_response(jsonify({"Invalid form data"})), 400

    # Get file and name from form data
    music_file, music_name, music_artist, music_image = form_data

    if (
        music_file
        and allowed_file(music_file.filename)
        and allowed_image(music_image.filename)
    ):
        try:
            # Secure the filename to prevent directory traversal
            audio = secure_filename(music_file.filename)
            image = secure_filename(music_image.filename)

            # Save music file and image to the server
            save_music_to_server(music_file, audio)
            save_image_to_server(music_image, image)

            # Create a new Music object
            new_music = Musics(
                path=audio,
                name=music_name,
                artist=music_artist,
                image=image,
            )

            # Add the new music record to the database
            db.session.add(new_music)
            db.session.commit()

            return (
                make_response(jsonify({"message": "Music uploaded successfully"})),
                201,
            )

        except Exception as e:
            # Handle any errors that might occur during the database operation
            db.session.rollback()
            return (
                make_response(
                    jsonify({"message": f"Failed to upload music. Error: {str(e)}"})
                ),
                500,
            )

    return make_response(jsonify({"message": "Invalid file format"})), 400


@api_v1.post("/playlist/add")
def add_playlist():
    try:
        playlist_name = request.form.get("playlist_name")
        playlist_image = request.files.get("playlist_image")
        current_user_id = request.form.get("user_id")

        if playlist_name and allowed_image(playlist_image.filename):
            image = secure_filename(playlist_image.filename)
            save_playlist_image_to_server(playlist_image, image)

            # Create a new Playlist object
            new_playlist = Playlists(
                name=playlist_name, image=image, user_id=current_user_id
            )

            # Add the new playlist record to the database
            db.session.add(new_playlist)
            db.session.commit()

            return (
                make_response(
                    jsonify(
                        {
                            "message": "Created Playlist Successfully",
                            "Playlist": {
                                "id": new_playlist.id,
                                "name": new_playlist.name,
                                "image": new_playlist.image,
                            },
                        }
                    )
                ),
                200,
            )
        else:
            return make_response(
                jsonify(
                    {
                        "message": "Missing 'playlist_name' or 'playlist_image' in form data"
                    }
                ),
                400,
            )
    except Exception as e:
        # Handle any errors that might occur during the database operation
        db.session.rollback()
        return (
            make_response(
                jsonify({"message": "Failed to create playlist", "error": str(e)})
            ),
            500,
        )


@api_v1.get("/playlist")
def get_user_playlists():
    try:
        # Get the 'user_id' from the query parameters
        user_id_param = request.args.get("JGAREsaeyudvg6rdxlmkopfesdzJVNrKGDIOSK")

        # Convert 'user_id' to an integer
        current_user_id = int(user_id_param)

        # Fetch playlists for the current user
        user_playlists = Playlists.query.filter_by(user_id=current_user_id).all()

        # Create a list to store the results
        playlist_list = []

        # Iterate over the query result and create a dictionary for each record
        for playlist in user_playlists:
            playlist_info = {
                "id": playlist.id,
                "playlistName": playlist.name,
                "playlistImage": playlist.image,
            }
            playlist_list.append(playlist_info)

        # Create a JSON response
        response = make_response(jsonify({"playlist": playlist_list}))
        response.headers["Cache-Control"] = "public, max-age=0"  # Cache for 1 hour

        return response, 200
    except Exception as e:
        return make_response(
            jsonify({"message": "Failed to fetch playlists", "error": str(e)}), 500
        )


@api_v1.post("/playlist/addmusic/<int:music_id>/<int:playlist_id>")
def add_music_to_playlist(music_id, playlist_id):
    try:
        # Retrieve the music and playlist objects
        music = Musics.query.get(music_id)
        playlist = Playlists.query.get(playlist_id)

        if music and playlist:
            # Create a new association record
            music_playlist = MusicPlaylist(music_id=music_id, playlist_id=playlist_id)

            # Add the association record to the database
            db.session.add(music_playlist)
            db.session.commit()

            return make_response(
                jsonify(
                    {
                        "message": f"Added music with ID {music_id} to playlist with ID {playlist_id}"
                    }
                ),
                200,
            )
        else:
            return jsonify({"message": "Music or playlist not found"}, 404)

    except Exception as e:
        # Handle any errors that might occur during the database operation
        db.session.rollback()
        return (
            make_response(
                jsonify({"message": "Failed to add music to playlist", "error": str(e)})
            ),
            500,
        )


@api_v1.get("/playlist/music")
def get_playlist_music():
    try:
        # Get the 'playlist_id' from the query parameters
        playlist_id_params = request.args.get("GOSSondaAKovmVkjrodankkiwS")
        # Convert 'playlist_id' to an integer
        playlist_id = int(playlist_id_params)
        playlist = Playlists.query.get(playlist_id)

        if playlist:
            music_list = []
            playlist_name = playlist.name
            playlist_image = playlist.image
            for music in playlist.musics:
                music_info = {
                    "musicName": music.name,
                    "musicPath": music.path,
                    "musicImage": music.image,
                    "musicArtist": music.artist,
                }
                music_list.append(music_info)

                # Add duration information (assuming you have a function to calculate duration)
            for music_info in music_list:
                music_path = os.path.join(
                    app.root_path, app.config["UPLOAD_FOLDER"], music_info["musicPath"]
                )
                audio = MP3(music_path)
                # Get the duration in seconds
                duration_in_seconds = audio.info.length
                # Calculate minutes and seconds
                minutes = int(duration_in_seconds // 60)
                seconds = int(duration_in_seconds % 60)
                # Format as a string
                formatted_duration = f"{minutes:02}:{seconds:02}"
                # Add the formatted duration to the music_info dictionary
                music_info["duration"] = formatted_duration

            response = {
                "playlist": {
                    "playlistName": playlist_name,
                    "playlistImage": playlist_image,
                    "musics": music_list,
                },
            }

            return make_response(jsonify(response)), 200
        else:
            return make_response(
                jsonify(
                    {
                        "message": f"Playlist with ID {playlist_id} not found in the database"
                    }
                ),
                404,
            )
    except Exception as e:
        return (
            make_response(
                jsonify(
                    {"message": f"Failed to retrieve playlist music", "error": str(e)}
                )
            ),
            500,
        )


@api_v1.delete("/playlist/<int:playlist_id>")
def delete_playlist(playlist_id):
    try:
        # Retrieve the playlist object by ID
        playlist = Playlists.query.get(playlist_id)

        if playlist:
            # Remove all music items from the playlist
            playlist.musics = []

            # Delete the playlist
            db.session.delete(playlist)
            db.session.commit()

            return make_response(
                jsonify(
                    {
                        "message": f"Playlist with ID {playlist_id} and all its music has been deleted"
                    }
                ),
                200,
            )
        else:
            return make_response(
                jsonify({"message": f"Playlist with ID {playlist_id} not found"}),
                404,
            )
    except Exception as e:
        # Handle any errors that might occur during the database operation
        db.session.rollback()
        return make_response(
            jsonify({"message": f"Failed to delete the playlist", "error": str(e)}),
            500,
        )


@api_v1.get("/category")
def get_all_category():
    # Fetch all records from the Music table
    all_cat = Category.query.all()

    # Create a list to store the results
    cat_list = []

    # Iterate over the query result and create a dictionary for each record
    for cat in all_cat:
        cat_info = {
            "id": cat.id,
            "name": cat.name,
        }
        cat_list.append(cat_info)

    # Create a JSON response
    response = make_response(jsonify({"cat": cat_list}))

    return response, 200


@api_v1.get("/category/<name>")
def get_category_music(name):
    try:
        category = Category.query.filter_by(name=name).first()

        if category:
            music_list = []
            for music_category in category.music_category:
                music = music_category.musics
                music_info = {
                    "id": music.id,
                    "name": category.name,
                    "musicName": music.name,
                    "musicPath": music.path,
                    "musicImage": music.image,
                    "musicArtist": music.artist,
                }
                music_list.append(music_info)

            return make_response(jsonify({"cat": music_list})), 200
        else:
            return (
                make_response(
                    jsonify({"message": f"No category found for year {name}"})
                ),
                404,
            )
    except Exception as e:
        return (
            make_response(
                jsonify(
                    {"message": "Failed to retrieve category music", "error": str(e)}
                )
            ),
            500,
        )


@api_v1.get("/musics")
def get_musics():
    search_query = request.args.get("n")
    print(f"Received search query: {search_query}")

    if search_query is None:
        return get_all_music()
    else:
        try:
            search_results = Musics.query.filter(
                Musics.name.ilike(f"%{search_query}%")
            ).all()

            music_list = []
            for music in search_results:
                music_info = {
                    "id": music.id,
                    "musicPath": music.path,
                    "musicName": music.name,
                    "musicArtist": music.artist,
                    "musicImage": music.image,
                }
                music_list.append(music_info)

            response = make_response(jsonify({"results": music_list}))
            return response, 201

        except Exception as e:
            return (
                make_response(jsonify({"message": "Search failed", "error": str(e)})),
                500,
            )


@api_v1.post("/auth/login")
def login():
    username = request.form.get("username")
    password = request.form.get("password")

    user = Users.query.filter_by(username=username, password=password).first()

    if user:
        # Authentication successful
        response_data = {
            "message": "Login successful",
            "user_id": user.id,  # Include the user ID in the response
        }
        return make_response(jsonify(response_data)), 200
    else:
        # Authentication failed
        return make_response(jsonify({"message": "Invalid credentials"})), 401


@api_v1.post("/auth/register")
def register():
    username = request.form.get("username")
    password = request.form.get("password")

    existing_user = Users.query.filter_by(username=username).first()

    if existing_user:
        # User with this username already exists
        return make_response(jsonify({"message": "Username is taken"})), 400

    # Create a new user
    new_user = Users(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    response_data = {
        "message": "Registration successful",
        "user_id": new_user.id,  # Include the user ID in the response
    }

    return make_response(jsonify(response_data)), 201


def get_all_music():
    # Fetch all records from the Music table
    all_music = Musics.query.all()

    # Create a list to store the results
    music_list = []

    # Iterate over the query result and create a dictionary for each record
    for music in all_music:
        music_info = {
            "id": music.id,
            "musicPath": music.path,
            "musicName": music.name,
            "musicArtist": music.artist,
            "musicImage": music.image,
        }
        music_list.append(music_info)

    # Create a JSON response
    response = make_response(jsonify({"musics": music_list}))
    response.headers["Cache-Control"] = "public, max-age=0"
    return response, 200


# membuat handler untuk upload file
def validate_form_data(request):
    music_file = request.files.get("music_file")
    music_image = request.files.get("music_image")
    music_name = request.form.get("music_name")
    music_artist = request.form.get("music_artist")

    if not (music_file and music_name and music_artist and music_image):
        return None  # data tidak valid

    return music_file, music_name, music_artist, music_image


def save_music_to_server(file, filename):
    # metode untuk menyimpan file music ke folder "static/file" di dalam server
    file_path = os.path.join(app.root_path, app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)
    return file_path


def save_image_to_server(file, image_name):
    # metode untuk menyimpan image ke folder "static/image" di dalam server
    image_path = os.path.join(app.root_path, app.config["UPLOAD_IMG"], image_name)
    file.save(image_path)
    return image_path


def save_playlist_image_to_server(file, image_name):
    image_path = os.path.join(
        app.root_path, app.config["UPLOAD_PLAYLIST_IMG"], image_name
    )
    file.save(image_path)
    return image_path


# def insert_music_into_db(file_path, music_name, music_artist, music_image):
#     # TODO : memasukkan form data ke dalam database
#     SQL_QUERY = "INSERT INTO musics (path, name, artist, image) VALUES(%s, %s, %s, %s)"
#     VALUES = (file_path, music_name, music_artist, music_image)

#     # menjalankan sql
#     cursor.execute(SQL_QUERY, VALUES)
#     db.commit()


# def music_id_exists_in_db(music_id):
#     cursor.execute("SELECT COUNT(*) FROM musics WHERE id = %s", (music_id,))
#     result = cursor.fetchone()
#     return result[0] > 0  # If the count is greater than 0, the music_id exists


# def delete_music_from_db(music_id):
#     cursor.execute("DELETE FROM musics WHERE id = %s", (music_id,))
#     db.commit()


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def allowed_image(filename):
    return (
        "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS_IMG
    )


app.register_blueprint(api_v1, url_prefix="/api/v1")
if __name__ == "__main__":
    app.run()
