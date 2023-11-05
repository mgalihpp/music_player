from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from flask_mysqldb import MySQL
import os
from itsdangerous import URLSafeTimedSerializer
import mysql.connector
from mutagen.mp3 import MP3

app = Flask(__name__)
app.secret_key = "secret123"
CORS(
    app,
)

# koneksi ke database my sql
db = mysql.connector.connect(
    host="localhost", user="root", password="galih451", database="music_streaming"
)

s = URLSafeTimedSerializer("secret123")

mysql = MySQL(app)

# membuat cursor untuk berinteraksi nanti dengan database
cursor = db.cursor()


@app.get("/")
def index():
    return jsonify({"message": "server ok"})


@app.get("/musics")
def get_all_music():
    # mendapat semua file dari database
    cursor.execute("SELECT * FROM musics")
    musics = cursor.fetchall()

    music_list = []
    for music in musics:
        music_info = {
            "id": music[0],
            "musicPath": music[1],
            "musicName": music[2],
            "musicArtist": music[3],
            "musicImage": music[4],
        }
        music_list.append(music_info)

    # Create a JSON response
    response = jsonify({"musics": music_list})

    # Set Cache-Control headers to prevent caching
    # response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    # response.headers["Pragma"] = "no-cache"
    # response.headers["Expires"] = "0"

    return response, 200


# @app.route('/<int:music_id>', methods=['GET'])
# def play_music(music_id):

#     print(music_id)
#     cursor.execute("SELECT music_name, path FROM music_list WHERE id = %s", (music_id,))
#     music = cursor.fetchone()

#     if music is not None:
#         music_path = os.path.normpath(music[1])
#         music_path = music_path.replace("\\", "/")

#         return jsonify({'path': music_path})
#     else:
#         return "Song not found"


@app.post("/upload")
def upload_music():
    # metode untuk mendapatkan file dari form data
    form_data = validate_form_data(request)

    if not form_data:
        return "Invalid form data", 400

    # mendatapatkan file,name dari form data
    music_file, music_name, music_artist, music_image = form_data
    file_path = save_music_to_server(music_file, music_file.filename)
    image_path = save_image_to_server(music_image, music_image.filename)

    # metode untuk menyimpan form data ke dalam database
    insert_music_into_db(file_path, music_name, music_artist, image_path)

    return (
        jsonify(
            {
                "message": "Music uploaded successfully",
                "file_url": "/static/music/" + music_file.filename,
                "file_name": music_name,
                "image_url": "/static/img" + music_image.filename,
            }
        ),
        201,
    )


@app.delete("/delete/<int:music_id>")
def delete_music(music_id):
    try:
        if music_id_exists_in_db(music_id):
            delete_music_from_db(music_id)
            return jsonify({"message": f"Music with ID {music_id} has been deleted"})
        else:
            return jsonify(
                {"message": f"Music with ID {music_id} not found in the database"}, 404
            )
    except Exception as e:
        return (
            jsonify(
                {
                    "message": f"Failed to delete music with ID {music_id}",
                    "error": str(e),
                }
            ),
            500,
        )


@app.post("/playlist/add")
def add_playlist():
    try:
        playlist_name = request.form.get("playlist_name")
        playlist_image = request.files.get("playlist_image")
        if playlist_name and playlist_image is not None:
            image_path = save_playlist_image_to_server(
                playlist_image, playlist_image.filename
            )
            cursor.execute(
                "INSERT INTO playlists (name, image) VALUES (%s, %s)",
                (playlist_name, image_path),
            )
            db.commit()
            return jsonify(
                {
                    "message": "Created Playlist Successfully",
                    "Playlist": playlist_name,
                }
            )
        else:
            return jsonify(
                {"message": "Missing 'playlist_name' or 'playlist_image' in form data"},
                400,
            )
    except Exception as e:
        return (
            jsonify({"message": "Failed to create playlist", "error": str(e)}),
            500,
        )


@app.get("/playlist")
def get_all_playlist():
    try:
        cursor.execute("SELECT * FROM playlists")
        playlists = cursor.fetchall()

        playlist_list = []
        for playlist in playlists:
            playlist_info = {
                "id": playlist[0],
                "playlistName": playlist[1],
                "playlistImage": playlist[2],
            }
            playlist_list.append(playlist_info)

        return jsonify({"playlist": playlist_list}), 200
    except mysql.connector.Error as e:
        return jsonify({"message": "Failed to fetch playlist", "error": str(e)}, 400)


@app.post("/playlist/addmusic/<int:music_id>/<int:playlist_id>")
def add_music_to_playlist(music_id, playlist_id):
    try:
        cursor.execute(
            "INSERT INTO music_playlist (music_id, playlist_id) VALUES (%s, %s)",
            (music_id, playlist_id),
        )
        db.commit()

        return jsonify(
            {
                "message": f"Added music with ID {music_id} to playlist with ID {playlist_id}"
            }
        )

    except mysql.connector.Error as e:
        return jsonify(
            {"message": "Failed to add music to playlist", "error": str(e)},
            500,
        )


@app.get("/playlist/music/<int:playlist_id>")
def get_playlist_music(playlist_id):
    try:
        query = """
        SELECT m.name AS music_name, m.path, m.image, m.artist,p.name AS playlist_name, p.image
        FROM music_playlist AS mp
        JOIN musics AS m ON mp.music_id = m.id
        JOIN playlists AS p ON mp.playlist_id = p.id
        WHERE mp.playlist_id = %s
        """

        cursor.execute(query, (playlist_id,))
        result = cursor.fetchall()

        music_list = []
        for row in result:
            music_info = {
                "musicName": row[0],
                "musicPath": row[1],
                "musicImage": row[2],
                "musicArtist": row[3],
                "playlistName": row[4],
                "playlistImage": row[5],
            }
            music_list.append(music_info)

        for music_info in music_list:
            music_path = music_info["musicPath"]
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

        return jsonify({"playlist": music_list})
    except mysql.connector.Error as e:
        return (
            jsonify({"message": "Failed to retrieve playlist music", "error": str(e)}),
            500,
        )


@app.get("/search/music")
def search_music():
    search_query = request.args.get("n")

    # /search/music?n=janji setia

    if not search_query:
        return jsonify({"message": "Please provide a search query."}), 400

    try:
        cursor.execute(
            "SELECT * FROM musics WHERE name LIKE %s", ("%" + search_query + "%",)
        )
        search_results = cursor.fetchall()

        music_list = []
        for music in search_results:
            music_info = {
                "id": music[0],
                "musicPath": music[1],
                "musicName": music[2],
                "musicArtist": music[3],
                "musicImage": music[4],
            }
            music_list.append(music_info)

        response = jsonify({"results": music_list})
        return response, 201
    except mysql.connector.Error as e:
        return jsonify({"message": "Search failed", "error": str(e)}), 500


# membuat route folder upload file mp3
UPLOAD_FOLDER = "static/files"
UPLOAD_IMG = "static/img"
UPLOAD_PLAYLIST_IMG = "static/img/playlist"


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
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    return file_path


def save_image_to_server(file, image_name):
    # metode untuk menyimpan image ke folder "static/image" di dalam server
    image_path = os.path.join(UPLOAD_IMG, image_name)
    file.save(image_path)
    return image_path


def save_playlist_image_to_server(file, image_name):
    image_path = os.path.join(UPLOAD_PLAYLIST_IMG, image_name)
    file.save(image_path)
    return image_path


def insert_music_into_db(file_path, music_name, music_artist, music_image):
    # TODO : memasukkan form data ke dalam database
    SQL_QUERY = "INSERT INTO musics (path, name, artist, image) VALUES(%s, %s, %s, %s)"
    VALUES = (file_path, music_name, music_artist, music_image)

    # menjalankan sql
    cursor.execute(SQL_QUERY, VALUES)
    db.commit()


def music_id_exists_in_db(music_id):
    cursor.execute("SELECT COUNT(*) FROM musics WHERE id = %s", (music_id,))
    result = cursor.fetchone()
    return result[0] > 0  # If the count is greater than 0, the music_id exists


def delete_music_from_db(music_id):
    cursor.execute("DELETE FROM musics WHERE id = %s", (music_id,))
    db.commit()


if __name__ == "__main__":
    app.run(debug=True)
