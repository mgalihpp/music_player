from flask import (
    Flask,
    jsonify,
    make_response,
    request,
)
from werkzeug.utils import secure_filename
from pymongo import MongoClient
import os
from flask_cors import CORS
from bson import ObjectId
from mutagen.mp3 import MP3

app = Flask(__name__)
CORS(app, origins="*")

client = MongoClient("mongodb+srv://mgpp:mgpp123@cluster0.vtkcthg.mongodb.net/")
db = client["music_streaming"]
music_collection = db["musics"]
playlist_collection = db["playlists"]


@app.route("/")
def index():
    return "ok"


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
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
        image.save(os.path.join(app.config["UPLOAD_IMG"], imagefile))

        # Add the music data to the MongoDB collection
        music_data = {
            "musicName": music_name,
            "musicArtist": music_artist,
            "musicPath": os.path.join(app.config["UPLOAD_FOLDER"], filename),
            "musicImage": os.path.join(app.config["UPLOAD_IMG"], imagefile),
        }

        # Insert music data into the MongoDB collection
        music_collection.insert_one(music_data)

        return make_response(jsonify({"message": "Music uploaded successfully"})), 201

    return make_response(jsonify({"error": "Invalid file format"})), 401


@app.delete("/delete/<string:music_id>")
def delete_music(music_id):
    try:
        music_id = ObjectId(music_id)

        # Find the music document in the collection
        music_document = music_collection.find_one({"_id": music_id})
        if music_document:
            # Check if the music document exists in the collection
            image_path = music_document.get("musicImage")
            music_path = music_document.get("musicPath")

            # If the image file path exists, delete the image file
            if image_path and music_path:
                if os.path.exists(image_path) or os.path.exists(music_path):
                    os.remove(image_path)
                    os.remove(music_path)
                else:
                    print(f"Image file not found: {image_path}")

            # Use the delete_one method to delete the music document
            result = music_collection.delete_one({"_id": music_id})

            if result.deleted_count == 1:
                return make_response(
                    jsonify({"message": f"Music with ID {music_id} has been deleted"}),
                    204,
                )
            else:
                return (
                    make_response(jsonify({"message": "Failed to delete music"})),
                    500,
                )
        else:
            return make_response(
                jsonify(
                    {"message": f"Music with ID {music_id} not found in the database"}
                ),
                404,
            )
    except Exception as e:
        return (
            make_response(
                jsonify(
                    {
                        "message": f"Failed to delete music with ID {music_id}",
                        "error": str(e),
                    }
                )
            ),
            500,
        )


@app.post("/playlist/add")
def add_playlist():
    try:
        playlist_name = request.form.get("playlist_name")
        playlist_image = request.files.get("playlist_image")

        if playlist_name:
            if playlist_image:
                imagefile = secure_filename(playlist_image.filename)
                playlist_image.save(
                    os.path.join(app.config["UPLOAD_PLAYLIST_IMG"], imagefile)
                )
            else:
                # Provide a default image path if no image is uploaded
                return make_response(jsonify({"no image selected"}))

            # Create a playlist document to insert into MongoDB
            playlist_data = {
                "playlistName": playlist_name,
                "playlistImage": os.path.join(
                    app.config["UPLOAD_PLAYLIST_IMG"], imagefile
                ),
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
                "musicName": music_document.get("musicName"),
                "musicPath": music_document.get("musicPath"),
                "musicImage": music_document.get("musicImage"),
                "musicArtist": music_document.get("musicArtist"),
            }
            # Add the music document to the music_list
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

        return make_response(jsonify({"playlist": music_list}), 200)
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


# Helper function to check if the file extension is allowed
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def allowed_image(filename):
    return (
        "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS_IMG
    )


if __name__ == "__main__":
    app.run(debug=True)
