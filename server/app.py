from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_mysqldb import MySQL
import os
from itsdangerous import URLSafeTimedSerializer
import mysql.connector

app = Flask(__name__)
app.secret_key = 'secret21'
CORS(app, origins=['http://localhost:5173'])

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
    return jsonify({'message': 'ok'})

#membuat route upload file mp3
UPLOAD_FOLDER = 'static/files'

#membuat handler untuk upload file 
def validate_form_data(request):
    music_file = request.files.get('music_file')
    music_name = request.form.get('music_name')
    music_artist = request.form.get('music_artist')

    if not (music_file and music_name and music_artist):
        return None  # data tidak valid

    return music_file, music_name, music_artist

def save_music_to_server(file, filename):
    #metode untuk menyimpan file ke folder "static/file" di dalam server
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    return file_path

def insert_music_into_db(file_path, music_name, music_artist):
    #TODO : memasukkan form data ke dalam database 
    SQL_QUERY = 'INSERT INTO music_list (path, music_name) VALUES(%s, %s)'
    VALUES = (file_path, music_name)
    
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
    music_file, music_name, music_artist = form_data
    file_path = save_music_to_server(music_file, music_file.filename)

    #metode untuk menyimpan form data ke dalam database
    insert_music_into_db(file_path, music_name, music_artist)

    return jsonify({'message': 'Music uploaded successfully', 'file_url': '/static/music/' + music_file.filename}), 201

@app.route('/music', methods=['GET'])
def get_all_music():

    #mendapat semua file dari database 
    cursor.execute("SELECT * FROM music_list")
    musics = cursor.fetchall()
    return musics


if __name__ == "__main__":
    app.run(debug=True)