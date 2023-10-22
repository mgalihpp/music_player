from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from flask_mysqldb import MySQL
import os
from itsdangerous import URLSafeTimedSerializer
import mysql.connector

app = Flask(__name__)
app.secret_key = 'secret21'
CORS(app, resources={r"/music": {"origins": "http://127.0.0.1:5173", "methods": ["GET"]}, r"/upload": {"origins": "http://127.0.0.1:5173", "methods": ["POST"]}})

#koneksi ke database my sql
db = mysql.connector.connect(
    host='localhost',
    user='root',
    password='galih451',
    database='music_streaming'
)

s=URLSafeTimedSerializer('secret123')

mysql=MySQL(app)

#membuat cursor untuk berinteraksi nanti dengan database
cursor= db.cursor()

@app.route('/')
def index():
    return jsonify({'message': 'server ok'})

#membuat route folder upload file mp3
UPLOAD_FOLDER = 'static/files'
UPLOAD_IMG = 'static/img'

#membuat handler untuk upload file 
def validate_form_data(request):
    music_file = request.files.get('music_file')
    music_image = request.files.get('music_image')
    music_name = request.form.get('music_name')
    music_artist = request.form.get('music_artist')

    if not (music_file and music_name and music_artist and music_image):
        return None  # data tidak valid

    return music_file, music_name, music_artist, music_image

def save_music_to_server(file, filename):
    #metode untuk menyimpan file music ke folder "static/file" di dalam server
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    return file_path

def save_image_to_server(file, image_name):
    #metode untuk menyimpan image ke folder "static/image" di dalam server
    image_path = os.path.join(UPLOAD_IMG, image_name)
    file.save(image_path)
    return image_path


def insert_music_into_db(file_path, music_name, music_artist, music_image):
    #TODO : memasukkan form data ke dalam database 
    SQL_QUERY = 'INSERT INTO musics (path, name, artist, image) VALUES(%s, %s, %s, %s)'
    VALUES = (file_path, music_name, music_artist, music_image)
    
    #menjalankan sql
    cursor.execute(SQL_QUERY, VALUES)
    db.commit()

@app.route('/upload', methods=['POST'])
def upload_music():
    #metode untuk mendapatkan file dari form data
    form_data = validate_form_data(request)

    if not form_data:
        return 'Invalid form data', 400
    
    #mendatapatkan file,name dari form data
    music_file, music_name, music_artist, music_image = form_data
    file_path = save_music_to_server(music_file, music_file.filename)
    image_path = save_image_to_server(music_image, music_image.filename)

    #metode untuk menyimpan form data ke dalam database
    insert_music_into_db(file_path, music_name, music_artist, image_path)

    return jsonify({'message': 'Music uploaded successfully', 'file_url': '/static/music/' + music_file.filename, 'file_name': music_name, 'image_url': '/static/img' + music_image.filename }), 201

@app.route('/music', methods=['GET'])
def get_all_music():

    #mendapat semua file dari database 
    cursor.execute("SELECT * FROM musics")
    musics = cursor.fetchall()
    # Create a JSON response
    response = make_response(jsonify(musics))

    # Set Cache-Control headers to prevent caching
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    return response

@app.route('/<int:music_id>', methods=['GET'])
def play_music(music_id):

    print(music_id)
    cursor.execute("SELECT music_name, path FROM music_list WHERE id = %s", (music_id,))
    music = cursor.fetchone()

    if music is not None:
        music_path = os.path.normpath(music[1])
        music_path = music_path.replace("\\", "/")

        return jsonify({'path': music_path})
    else:
        return "Song not found"
    
@app.route('/searchq?=<int:music_id>')
def search_music(music_id):
    print()

if __name__ == "__main__":
    app.run(debug=True)