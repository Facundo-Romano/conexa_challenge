# Conexa_challenge
## API de peliculas de Star Wars, construida con NestJs
[enlace al deploy](https://conexachallenge-production.up.railway.app/)

## Instrucciones para levantar la app:
-Clonar repositorio.
-Crear .env según el .env.example y completar las variables con sus respectivos valores.
-Instalar dependencias.
-Buildear la app.
-Correr la app.
Comandos:
```bash
  git clone https://github.com/Facundo-Romano/conexa_challenge.git
  //Linux/Mac
  touch .env
  //Windows
  echo. > .env
  //Dentro del repo
  npm install
  npm run build
  npm run start
```
## Endpoints de la app:
-Register (POST https://conexachallenge-production.up.railway.app/auth/register):
Endpoint para crear nuevos usuarios.
Curl de ejemplo: 
```bash
  curl --location 'https://conexachallenge-production.up.railway.app/auth/register' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "firstName": "firstName",
      "lastName": "lastName",
      "email": "email@email.com",
      "password": "Password*123"
  }'
```

-Login (POST https://conexachallenge-production.up.railway.app/auth/login):
Endpoint para loguearte y obtener un jwt.
Curl de ejemplo: 
```bash
  curl --location 'https://conexachallenge-production.up.railway.app/auth/login' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "email": "email@email.com",
      "password": "Password*123"
  }'
```

-Get Movie By Id (GET https://conexachallenge-production.up.railway.app/movies/:id):
Endpoint para obtener el detalle de una pelicula, se requiere el header Authorization con le jwt obtenido del logueo para acceder. También es necesario pasar el id de la pelicula.
Curl de ejemplo: 
```bash
  curl --location 'https://conexachallenge-production.up.railway.app/movies/1' \
  --header 'Authorization: Bearer jwt'
```

-Get All Movies (GET https://conexachallenge-production.up.railway.app/movies):
Endpoint para obtener todas las peliculas.
Curl de ejemplo: 
```bash curl --location 'https://conexachallenge-production.up.railway.app/movies' ```

-Create Movie (POST https://conexachallenge-production.up.railway.app/movies/create):
Endpoint para crear una nueva pelicula, se requiere el header Authorization con le jwt obtenido del logueo para acceder y que el usuario tenga permisos de administrador.
Curl de ejemplo: 
```bash
  curl --location 'https://conexachallenge-production.up.railway.app/movies/create' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer jwt' \
  --data '{
      "title": "title", 
      "episodeId": 1, 
      "openingCrawl": "openingCrawl", 
      "director": "director", 
      "producer": "producer", 
      "releaseDate": "releaseDate",
      "characters": [
          "https://swapi.dev/api/people/14/"
      ], 
      "planets": [
          "https://swapi.dev/api/planets/14/"
      ], 
      "starships": [
          "https://swapi.dev/api/starships/13/"
      ], 
      "vehicles": [
          "https://swapi.dev/api/vehicles/14/"
      ], 
      "species": [
          "https://swapi.dev/api/species/13/"
      ]
  }'
```

-Update Movie (PUT https://conexachallenge-production.up.railway.app/movies/:id):
Endpoint para obtener modificar una pelicula, se requiere el header Authorization con le jwt obtenido del logueo para acceder y que el usuario tenga permisos de administrador.
Curl de ejemplo: 
```bash
  curl --location --request PUT 'https://conexachallenge-production.up.railway.app/movies/1' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer jwt' \
  --data '{
      "title": "title", 
      "episodeId": 1, 
      "openingCrawl": "openingCrawl", 
      "director": "director", 
      "producer": "producer", 
      "releaseDate": "releaseDate",
      "characters": [
          "https://swapi.dev/api/people/14/"
      ], 
      "planets": [
          "https://swapi.dev/api/planets/14/"
      ], 
      "starships": [
          "https://swapi.dev/api/starships/13/"
      ], 
      "vehicles": [
          "https://swapi.dev/api/vehicles/14/"
      ], 
      "species": [
          "https://swapi.dev/api/species/13/"
      ]
  }'
```

-Delete Movie (DELETE https://conexachallenge-production.up.railway.app/movies):
Endpoint para eliminar una lista de peliculas, se requiere el header Authorization con le jwt obtenido del logueo para acceder y que el usuario tenga permisos de administrador.
Curl de ejemplo: 
```bash
  curl --location --request PUT 'https://conexachallenge-production.up.railway.app/movies/1' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer jwt' \
  --data '{
      "title": "title", 
      "episodeId": 1, 
      "openingCrawl": "openingCrawl", 
      "director": "director", 
      "producer": "producer", 
      "releaseDate": "releaseDate",
      "characters": [
          "https://swapi.dev/api/people/14/"
      ], 
      "planets": [
          "https://swapi.dev/api/planets/14/"
      ], 
      "starships": [
          "https://swapi.dev/api/starships/13/"
      ], 
      "vehicles": [
          "https://swapi.dev/api/vehicles/14/"
      ], 
      "species": [
          "https://swapi.dev/api/species/13/"
      ]
  }'
```
