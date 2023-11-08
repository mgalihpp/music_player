from flask import Flask, jsonify, make_response, request, Response, send_file
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from flask_cors import CORS
from bson import ObjectId
from mutagen.mp3 import MP3
import os

app = Flask(__name__)
CORS(app, origins="*")

client = MongoClient("mongodb+srv://mgpp:mgpp123@cluster0.vtkcthg.mongodb.net/")
db = client["music_streaming"]
music_collection = db["musics"]
playlist_collection = db["playlists"]
category_collection = db["category"]

# cred = credentials.Certificate("./serviceAccount.json")
# firebase_admin.initialize_app(cred)


# config = {
#     "apiKey": "AIzaSyBFLmyuxO4wf9s0Cd2Dcbq0Fs5G0ppuT6c",
#     "authDomain": "phrasal-alpha-372913.firebaseapp.com",
#     "projectId": "phrasal-alpha-372913",
#     "storageBucket": "phrasal-alpha-372913.appspot.com",
#     "messagingSenderId": "659218835319",
#     "appId": "1:659218835319:web:1a40d8db35cb11d1452372",
#     "measurementId": "G-TRNMW996YQ",
#     "serviceAccount": "./serviceAccount.json",
#     "databaseURL": "https://phrasal-alpha-372913-default-rtdb.asia-southeast1.firebasedatabase.app/",
# }

# firebase = pyrebase.initialize_app(config)
# storage = firebase.storage()


@app.route("/")
def index():
    return "ok"


@app.get("/stream_audio/<audio_filename>")
def stream_audio(audio_filename):
    audio_path = os.path.join(UPLOAD_FOLDER, audio_filename)

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
        response.headers["Accept-Ranges"] = "bytes"
        response.headers["Content-Range"] = f"bytes {start}-{end}/{file_size}"
        response.headers["Content-Length"] = content_length
        response.headers["Content-Type"] = "audio/mp3"
        return response, 206  # Partial Content status code
    else:
        return make_response(jsonify("File not found"), 404)


@app.get("/img/<image_filename>")
def stream_image(image_filename):
    image_path = os.path.join(UPLOAD_IMG, image_filename)

    if os.path.exists(image_path):
        return (
            send_file(
                image_path, as_attachment=False, mimetype="image/jpeg", max_age=300
            ),
            200,
        )
    else:
        return make_response(jsonify("File not found")), 404


@app.get("/playlist/img/<image_filename>")
def stream_playlist_image(image_filename):
    image_path = os.path.join(UPLOAD_PLAYLIST_IMG, image_filename)

    if os.path.exists(image_path):
        return (
            send_file(
                image_path,
                as_attachment=False,
                mimetype="image/jpeg",
            ),
            200,
        )
    else:
        return make_response(jsonify("File not found")), 404


@app.get("/musics")
def get_all_music():
    # Use the find method to retrieve all documents in the collection
    music_data = music_collection.find(
        {},
        {"_id": 1, "musicName": 1, "musicImage": 1, "musicPath": 1, "musicArtist": 1},
    )  # Exclude the '_id' field from the results

    # Convert the cursor to a list of dictionaries
    music_list = list(music_data)

    for music in music_list:
        music["_id"] = str(music["_id"])

    # Return the music data as JSON
    return make_response(jsonify({"musics": music_list})), 200


@app.post("/upload")
def upload_music():
    # Check if the POST request has the file part
    if "music_file" not in request.files:
        return make_response(jsonify({"error": "No file part"})), 400

    file = request.files["music_file"]
    image = request.files["music_image"]
    music_name = request.form.get("music_name")
    music_artist = request.form.get("music_artist")

    # Validate the uploaded file
    if file.filename == "":
        return make_response(jsonify({"error": "No selected file"})), 400

    if image.filename == "":
        return make_response(jsonify({"error": "No selected image"})), 400

    if file and allowed_file(file.filename) and allowed_image(image.filename):
        # Secure the filename to prevent directory traversal
        filename = secure_filename(file.filename)
        imagefile = secure_filename(image.filename)
        save_music_to_server(file, filename)
        save_image_to_server(image, imagefile)

        # Add the music data to the MongoDB collection
        music_data = {
            "musicName": music_name,
            "musicArtist": music_artist,
            "musicPath": filename,
            "musicImage": imagefile,
        }

        # Insert music data into the MongoDB collection
        music_collection.insert_one(music_data)

        return make_response(jsonify({"message": "Music uploaded successfully"})), 201

    return make_response(jsonify({"error": "Invalid file format"})), 401


# @app.delete("/delete/<string:music_id>")
# def delete_music(music_id):
#     try:
#         music_id = ObjectId(music_id)

#         # Find the music document in the collection
#         music_document = music_collection.find_one({"_id": music_id})
#         if music_document:
#             # Check if the music document exists in the collection
#             image_path = music_document.get("musicImage")
#             music_path = music_document.get("musicPath")

#             # If the image file path exists, delete the image file
#             # if image_path and music_path:
#             #     # Delete the files from Firebase Storage
#             #     storage_bucket = storage.bucket()
#             #     image_blob = storage_bucket.blob(image_path)
#             #     music_blob = storage_bucket.blob(music_path)

#             #     # Delete the files in Firebase Storage
#             #     image_blob.delete()
#             #     music_blob.delete()

#             # Use the delete_one method to delete the music document
#             result = music_collection.delete_one({"_id": music_id})

#             if result.deleted_count == 1:
#                 return make_response(
#                     jsonify({"message": f"Music with ID {music_id} has been deleted"}),
#                     204,
#                 )
#             else:
#                 return (
#                     make_response(jsonify({"message": "Failed to delete music"})),
#                     500,
#                 )
#         else:
#             return make_response(
#                 jsonify(
#                     {"message": f"Music with ID {music_id} not found in the database"}
#                 ),
#                 404,
#             )
#     except Exception as e:
#         return (
#             make_response(
#                 jsonify(
#                     {
#                         "message": f"Failed to delete music with ID {music_id}",
#                         "error": str(e),
#                     }
#                 )
#             ),
#             500,
#         )


@app.post("/playlist/add")
def add_playlist():
    try:
        playlist_name = request.form.get("playlist_name")
        playlist_image = request.files.get("playlist_image")

        if playlist_name:
            if playlist_image:
                imagefile = secure_filename(playlist_image.filename)
                save_playlist_image_to_server(playlist_image, imagefile)
            else:
                # Provide a default image path if no image is uploaded
                return make_response(jsonify({"no image selected"}))

            # Create a playlist document to insert into MongoDB
            playlist_data = {
                "playlistName": playlist_name,
                "playlistImage": imagefile,
            }

            # Insert the playlist document into the MongoDB collection
            playlist_collection.insert_one(playlist_data)

            return make_response(
                jsonify(
                    {
                        "message": "Created Playlist Successfully",
                        "Playlist": playlist_name,
                    }
                ),
                204,
            )
        else:
            return make_response(
                jsonify({"message": "Missing 'playlist_name' in form data"}),
                400,
            )
    except Exception as e:
        return (
            make_response(
                jsonify({"message": "Failed to create playlist", "error": str(e)})
            ),
            500,
        )


@app.post("/playlist/addmusic/<string:music_id>/<string:playlist_id>")
def add_music_to_playlist(music_id, playlist_id):
    try:
        music_id = ObjectId(music_id)
        playlist_id = ObjectId(playlist_id)

        # Find the music document and playlist document in the collection
        music_document = music_collection.find_one({"_id": music_id})
        playlist_document = playlist_collection.find_one({"_id": playlist_id})

        # Check if both the music and playlist documents exist
        if music_document and playlist_document:
            # Get the IDs of the music and playlist documents
            music_id = music_document["_id"]
            playlist_id = playlist_document["_id"]

            # Update the playlist document to add the music ID to the playlist
            playlist_collection.update_one(
                {"_id": playlist_id},
                {"$push": {"musics": music_id}},
            )

            return make_response(
                jsonify(
                    {
                        "message": f"Added music with ID {music_id} to playlist with ID {playlist_id}"
                    }
                ),
                200,
            )

        else:
            return make_response(
                jsonify({"message": "Music or playlist not found in the database"}),
                404,
            )
    except Exception as e:
        return make_response(
            jsonify({"message": "Failed to add music to playlist", "error": str(e)}),
            500,
        )


@app.get("/playlist")
def get_all_playlist():
    try:
        # Assuming you have already established a MongoDB connection
        playlist_data = playlist_collection.find(
            {}, {"_id": 1, "playlistName": 1, "playlistImage": 1}
        )

        # Convert ObjectId to string and format the result as a JSON list
        playlist_list = list(playlist_data)

        # Convert ObjectId to string
        for playlist in playlist_list:
            playlist["_id"] = str(playlist["_id"])

        return make_response(jsonify({"playlist": playlist_list})), 200
    except Exception as e:
        return make_response(
            jsonify({"message": "Failed to fetch playlist", "error": str(e)}), 400
        )


@app.get("/playlist/music/<string:playlist_id>")
def get_playlist_music(playlist_id):
    try:
        playlist_id = ObjectId(playlist_id)

        # Find the playlist document by its ID
        playlist_document = playlist_collection.find_one({"_id": playlist_id})

        if not playlist_document:
            return make_response(
                jsonify({"message": "Playlist not found in the database"}),
                404,
            )

        # Retrieve the music IDs from the playlist document
        music_ids = playlist_document.get("musics", [])

        # Find the music documents that match the retrieved music IDs
        music_documents = music_collection.find({"_id": {"$in": music_ids}})
        music_list = []
        for music_document in music_documents:
            music_info = {
                "playlistName": playlist_document.get("playlistName"),
                "playlistImage": playlist_document.get("playlistImage"),
                "_id": str(music_document.get("_id")),
                "musicPath": music_document.get("musicPath"),
                "musicName": music_document.get("musicName"),
                "musicImage": music_document.get("musicImage"),
                "musicArtist": music_document.get("musicArtist"),
            }
            # Add the music document to the music_list
            music_list.append(music_info)

            for music_info in music_list:
                music = music_info["musicPath"]
                music_path = os.path.join(UPLOAD_FOLDER, music)
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

        return make_response(jsonify({"playlist": music_list}), 200)
    except Exception as e:
        return make_response(
            jsonify({"message": "Failed to retrieve playlist music", "error": str(e)}),
            500,
        )


@app.get("/category/<string:year>")
def get_category_music(year):
    try:
        cat_document = category_collection.find_one({"year": year})

        if not cat_document:
            return make_response(
                jsonify({"message": "category not found in the database"}),
                404,
            )
        music_ids = cat_document.get("musics", [])
        music_documents = music_collection.find({"_id": {"$in": music_ids}})

        music_list = []
        for music_document in music_documents:
            music_info = {
                "cat_id": str(cat_document.get("_id")),
                "year": cat_document.get("year"),
                "_id": str(music_document.get("_id")),
                "musicPath": str(music_document.get("musicPath")),
                "musicName": music_document.get("musicName"),
                "musicImage": music_document.get("musicImage"),
                "musicArtist": music_document.get("musicArtist"),
            }
            # Add the music document to the music_list
            music_list.append(music_info)

        return make_response(jsonify({"cat": music_list}), 200)

    except Exception as e:
        return make_response(
            jsonify({"message": "Failed to retrieve playlist music", "error": str(e)}),
            500,
        )


@app.get("/search/music")
def search_music():
    search_query = request.args.get("n")

    if not search_query:
        return (
            make_response(jsonify({"message": "Please provide a search query."})),
            400,
        )

    try:
        # Use the $regex operator for a case-insensitive search
        search_results = music_collection.find(
            {
                "musicName": {
                    "$regex": search_query,
                    "$options": "i",  # "i" for case-insensitive
                }
            },
            {"_id": 0},
        )

        music_list = list(search_results)

        response = make_response(jsonify({"results": music_list}))
        return response, 201
    except Exception as e:
        return (
            make_response(jsonify({"message": "Search failed", "error": str(e)})),
            500,
        )


# Configure file upload settings
UPLOAD_FOLDER = "static/files"
UPLOAD_IMG = "static/img"
UPLOAD_PLAYLIST_IMG = "static/img/playlist"
ALLOWED_EXTENSIONS = {"mp3"}
ALLOWED_EXTENSIONS_IMG = {"png", "jpg", "jpeg", "svg"}


app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["UPLOAD_IMG"] = UPLOAD_IMG
app.config["UPLOAD_PLAYLIST_IMG"] = UPLOAD_PLAYLIST_IMG


def save_music_to_server(file, filename):
    # metode untuk menyimpan file music ke folder "static/file" di dalam server
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)


def save_image_to_server(file, image_name):
    # metode untuk menyimpan image ke folder "static/image" di dalam server
    image_path = os.path.join(UPLOAD_IMG, image_name)
    file.save(image_path)


def save_playlist_image_to_server(file, image_name):
    image_path = os.path.join(UPLOAD_PLAYLIST_IMG, image_name)
    file.save(image_path)


# Helper function to check if the file extension is allowed
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def allowed_image(filename):
    return (
        "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS_IMG
    )


if __name__ == "__main__":
    app.run(debug=True)
