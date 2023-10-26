# PREVIEW

<p align='center'>
    <img src='./docs/preview5.png' alt='preview'>
</p>

## Stack
![React JS](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FLASK](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)

## Installation

1. Install Python and node js
```txt
python ver. 3.9
node -v

```

2. Clone the repository to your local machine:
```
git clone https://github.com/mgalihpp/music_player.git
```

3. Create Virtual Enviroment for Python:
```
cd server
Python -m venv .venv
.venv\Scripts\activate
```

4. Install required dependecies:
```
pip install -r requirements.txt
```

5. Create a MYSQL Database:
```
CREATE DATABASE music_streaming

use music_streaming

CREATE TABLE musics (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(1000) DEFAULT NULL,
  `name` varchar(1000) DEFAULT NULL,
  `artist` varchar(3000) DEFAULT NULL,
  `image` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
```

6. Run application:
```
flask --app app run
```

7. Run Client Application
```
cd client
```

8. Install dependecies and Run Application:
```
npm i
npm run dev
```
