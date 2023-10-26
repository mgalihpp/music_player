from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from flask_mysqldb import MySQL
import os
from itsdangerous import URLSafeTimedSerializer
import mysql.connector

app = Flask(__name__)
app.secret_key = "secret123"
CORS(
    app,
    resources={
        r"/musics": {"origins": "*", "methods": ["GET"]},
        r"/search/music": {"origins": "*", "methods": ["GET"]},
        r"/upload": {"origins": "*", "methods": ["POST"]},
    },
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


# membuat route folder upload file mp3
UPLOAD_FOLDER = "static/files"
UPLOAD_IMG = "static/img"


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


def insert_music_into_db(file_path, music_name, music_artist, music_image):
    # TODO : memasukkan form data ke dalam database
    SQL_QUERY = "INSERT INTO musics (path, name, artist, image) VALUES(%s, %s, %s, %s)"
    VALUES = (file_path, music_name, music_artist, music_image)

    # menjalankan sql
    cursor.execute(SQL_QUERY, VALUES)
    db.commit()


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
    response = make_response(jsonify({"musics": music_list}))

    # Set Cache-Control headers to prevent caching
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

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


@app.delete("/delete/<int:music_id>")
def delete_music(music_id):
    # return print(music_id)
    cursor.execute("DELETE FROM musics WHERE id = %s", (music_id,))

    db.commit()

    return jsonify({"message": str(music_id) + " " + "has been deleted"})


# membuat route untuk membuat playlist baru
@app.route("/playlist/add", methods=["POST"])
def add_playlist():
    if request.method == "POST":
        name = request.form.get("playlist_name")
        if name is not None:
            cursor.execute("INSERT INTO playlists (name) VALUES (%s)", (name,))
            db.commit()
            return jsonify(
                {"message": "Created Playlist Successfully", "Playlist": name}
            )
        else:
            return jsonify({"message": "Missing 'playlist_name' in form data"}, 400)


# membuat route menambah music ke playlist
@app.route("/playlist/addmusic/<int:music_id>/<int:playlist_id>", methods=["POST"])
def add_music_to_playlist(music_id, playlist_id):
    # music_id = request.form.get('music_id')
    # playlist_id = request.form.get('playlist_id')
    # # Insert the association into the music_playlist table
    cursor.execute(
        "INSERT INTO music_playlist (music_id, playlist_id) VALUES (%s, %s)",
        (music_id, playlist_id),
    )
    db.commit()
    return jsonify(
        {
            "message": "Adding music with ID "
            + str(music_id)
            + "to playlist with ID "
            + str(playlist_id)
        }
    )


# membuat route mendapatkan semua playlist dan music diplaylist
@app.route("/playlist/music/<int:playlist_id>", methods=["GET"])
def get_playlist_music(playlist_id):
    query = """
    SELECT m.name AS music_name, m.path, m.image, p.name AS playlist_name
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
            "music_name": row[0],  # Access the first column (music_name)
            "path": row[1],  # Access the second column (path)
            "image": row[2],  # Access the third column (image)
            "playlist_name": row[3],  # Access the fourth column (playlist_name)
        }
        music_list.append(music_info)

    return jsonify({"playlist": music_list})


@app.get("/search/music")
def search_music():
    search_query = request.args.get(
        "n"
    )  # mendapatkan pencarian query dari the URL query parameter "q"

    if not search_query:
        return jsonify({"message": "Please provide a search query."}), 400

    # Perform a search in the database based on the search_query
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

    response = make_response(jsonify({"results": music_list}))

    return response, 201


if __name__ == "__main__":
    app.run(debug=True)
