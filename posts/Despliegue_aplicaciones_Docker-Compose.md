---
title: "Despliegue de aplicaciones con Docker-Compose v2"
date: "2022-07-14"
tags: ["docker", "nodejs", "sw"]
summary: "Desplegar proyectos en contenedores Docker de manera sencilla y rápida, utilizando docker-compose."
draft: false
---

En este tutorial vamos a aprender a desplegar nuestros proyectos en contenedores Docker de manera sencilla y rápida, utilizando docker-compose.

## 0. Características del entorno
- Ubuntu 20.04
- Docker 20.10.12
- Docker-compose 1.29.2
- Node.js v18.12.1
- NPM 8.19.2

## 1. ¿Qué es docker-compose?
Docker Compose es una herramienta de Docker que orquesta contenedores en un mismo cliente. Consiste en un archivo de texto en formato YAML, que define de forma declarativa los contenedores que se van a desplegar, así como las dependencias entre ellos.

Al utilizar el paradigma declarativo, en este documento sólo se especifican las características de los contenedores deseados, y no cómo se despliegan. Para el despliegue, se basa en la definición de servicios, que referencian imágenes Docker de un registro y las características de los contenedores que se desean desplegar.

Este archivo normalmente tiene el nombre `docker-compose.yml` pero puede tener cualquier otro nombre, siempre que se especifique al ejecutar el comando `docker-compose` con el argumento `-f`. La utilidad más habitual para esta herramienta es el despliegue de aplicaciones en entornos locales, para el desarrollo y pruebas. Sin embargo, también puede utilizarse para desplegar aplicaciones en entornos de producción, aunque en este caso se recomienda utilizar herramientas de orquestación como `Kubernetes`.

### 1.1. Instalación
Para instalar docker-compose, primero necesitamos tener instalada la herramienta Docker en nuestro sistema. Después, en Ubuntu, ejecutamos el siguiente comando:

```bash 
sudo apt install docker-compose
```

En el caso de Mac, podemos utilizar `Homebrew` de la siguiente manera:

```bash
brew install docker-compose
```

Y en el caso de Windows, podemos descargar el instalador de Docker Desktop de la [página oficial](https://docs.docker.com/compose/install/) y seguir las instrucciones, aunque recomendamos el uso de sistemas Linux o Mac.

## 2. Servicios y recursos
Dentro del archivo docker-compose.yml podemos definir diferentes recursos que desplegar. A la hora de desplegar nuestras aplicaciones, lo primero es definir los servicios que vamos a desplegar.
### 2.1. Servicios
Estos servicios son los que conforman nuestra aplicación y, normalmente, cada uno despliega un contenedor, asociado a una imagen Docker. Dentro de cada servicio podemos definir las características de cada contenedor, como el nombre, la imagen, los puertos que expone, volúmenes y redes a las que se conecta, etc.

Para definir un servicio en el archivo `docker-compose.yml`, debemos definir un bloque con el nombre del servicio, y dentro una serie de propiedades que definen las características del contenedor:

- `image`: Nombre de la imagen Docker usada para desplegar el contenedor.
- `[container_name]`: Nombre del contenedor a desplegar.
- `[build]`: Ruta al directorio donde se encuentra el Dockerfile para construir la imagen, si no está construida.
- `[command]`: Comandos que ejecutar al iniciar el contenedor.
- `[ports]`: Puertos que exponer al exterior del contenedor. Tienen el formato puerto_host:puerto_contenedor, donde, como host, podremos acceder al servicio desde localhost:puerto_host.
- `[volumes]`: Volúmenes que montar en el contenedor.
- `[environment]`: Variables de entorno que definir en el contenedor. Es recomendable configurar nuestros contenedores con variables de entorno y no valores fijos, para poder cambiar la configuración de los servicios sin tener que reconstruir las imágenes.
- `[depends_on]`: Servicios que deben desplegarse antes que este.
- `[networks]`: Redes a las que pertenece el contenedor.
- `[restart]`: Política de reinicio del contenedor. Puede tomar los valores no, always, on-failure, unless-stopped, por defecto no.

Todas las propiedades entre corchetes son opcionales, y si no se especifican, se toman valores por defecto. Es decir, sólo con definir la propiedad image ya se peude desplegar un contenedor con la imagen especificada.

### 2.2. Volúmenes
Cuando hablamos de volúmen nos referimos a los volúmenes de Docker, el mecanismo que tienen los contenedores para persistir y compartir datos. Para ello, consumen o generan ficheros en un directorio del sistema de ficheros del host.

Para definir un volumen en el archivo `docker-compose.yml`, debemos definir un bloque con el nombre del volumen, y luego referenciarlo en los servicios que lo necesiten. Dentro de este bloque podemos definir las siguientes propiedades:

- `[driver]`: Driver del volumen. Por defecto, local.
- `[driver_opts]`: Opciones del driver del volumen.
    - `type`: Tipo de volumen. Puede ser none, bind, volume o tmpfs.
    - `device`: Ruta al directorio del host que se va a montar.
    - `o`: Opciones de montaje del volumen. Puede tomar valores bind, private, ro, rw y shared, entre otros.
- `[external]`: Indica si el volumen es externo o no. Por defecto, false.
- `[labels]`: Etiquetas del volumen.
- `[name]`: Nombre del volumen.
- `[scope]`: Alcance del volumen. Por defecto, local.

Como podemos ver, todas las propiedades son opcionales, pero es recomendable definir al menos un nombre y la ruta en el sistema de archivos del host. Un ejemplo de volumen con estas propiedades sería:

```yaml
volumes:
  my-volume:
    driver: local
    driver_opts:
      type: none
      device: /path/to/my-volume
      o: bind
    external: false
    labels:
      - "com.example.description=Volume for my service"
    name: my-volume
    scope: local
```

Referenciado en el servicio como:

```yaml
services:
  my-service:
    image: my-image
    volumes:
      - my-volume:/path/in/container
```

Recuerda que la ruta que definas en la propiedad `device` del bloque `volumes` debe existir en el sistema de archivos del host. No importa si es una ruta absoluta `/path/to/my-volume` o relativa `../path/to/my-volume`, siempre que exista.

### 2.3. Redes
Cuando desplegamos aplicaciones con múltiples módulos, por ejemplo, una aplicación web con un servidor web y una base de datos, las alojamos en contenedores separados. Para que estos contenedores puedan comunicarse entre sí, necesitamos definir una red en común, siguiendo el modelo `Container Network Model`:
- `SandBox`: Aisla el contenedor del resto del sistema, limitando el acceso a esta red al tráfico que llega por los `endpoints`.
- `Endpoints`: Puntos de comunicación entre las redes aisladas de los contenedores y la network que los conecta con el resto del sistema.
- `Network`: Red que comunica las sandbox de los diferentes contenedores por medio de los endpoints.

Siguiendo este modelo existen varias implementaciones en Docker:

| Nombre	| Alcance	| Descripción |
| :--: | :--: | :--: |
| bridge | Local | Red por defecto de Docker. Crea una red virtual en el host, que conecta los contenedores por medio de un bridge virtual |
| host	| Local	| Deshabilita el aislamiento entre los contenedores y el host, no hace falta exponer puertos |
| overlay | Global | Permite conectar múltiples demonios Docker entre sí y habilitar la comunicación entre servicios distribuidos. |
| ipvlan | Global |El usuario obtiene el control total del direccionamiento IPv4 e IPv6 de la red. |
| macvlan | Global | Permite asignarle una dirección MAC a un contenedor, haciendo que aparezca como un dispositivo físico en la red. El tráfico se direcciona por MAC. |
| none | Local | Dehabilita toda la gestión de red, normalmente usado en conjunto con un driver de red propio. |

Estas implementaciones se definen en el campo driver de la sección networks del archivo `docker-compose.yml`. Por defecto, si no se especifica, se utiliza la red bridge.

Entonces, para definir una red común entre contenedores, debemos definirla en la sección `networks` y referenciarla en los servicios que la necesiten. Recuerda que cada red, según su driver, se puede definir con diferentes opciones.

#### 2.3.1. Ejemplo
Vamos a crear un ejemplo sencillo, que consiste en un servicio web que utiliza una base de datos. Para ello, el archivo docker-compose.yml quedaría de la siguiente manera:

```yaml
version: '3.7' # Versión de docker-compose, depende de Docker
services:
  web:
    image: nginx
    ports:
      - 80:80
    volumes:
      - web_data:/usr/share/nginx/html
    networks:
      - web_net
  db:
    image: postgres
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - web_net
volumes:
    web_data:
    db_data:
networks:
    web_net:
        driver: bridge
```

En el ejemplo podemos observar dos servicios: `web`, que despliega un contenedor nginx exponiendo el puerto 80, y `db`, que despliega un contenedor postgresql, sólo accesible desde la red que comparten ambos contenedores, `web_net`. Esta red está declarada en la sección networks como una red de tipo bridge. Por otro lado, cada contenedor tiene asociado un volumen, definido en la sección volumes, y referenciado en el servicio.

### 2.4. Dependencias entre servicios
Ahora que ya sabemos cómo definir los servicios de nuestra aplicación y sus recursos asociados, vamos a ver cómo podemos definir las dependencias entre ellos. Un servicio depende de otro cuando necesita que el segundo esté desplegado antes de poder desplegarse. Por ejemplo, si tenemos un servicio que despliega una API REST conectada a una base de datos, necesitamos que la base de datos esté desplegada antes de desplegar el servicio que la utiliza.

Para definir estas dependencias en el fichero docker-compose.yml podemos utilizar el campo `depends_on` en los servicios de la sección services. Este campo es un array de cadenas, donde cada cadena es el nombre del servicio del que depende el servicio actual.

Veamos el ejemplo anterior, pero esta vez definiendo las dependencias entre web y db:

```yaml
version: '3.7' # Versión de docker-compose, depende de Docker
services:
  web:
    image: nginx
    ports:
      - 80:80
    volumes:
      - web_data:/usr/share/nginx/html
    networks:
      - web_net
    depends_on: # Ahora web depende de db
      - db
  db:
    image: postgres
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - web_net
volumes:
    web_data:
    db_data:
networks:
    web_net:
        driver: bridge
```

De manera que, al desplegar la aplicación con docker-compose, primero se desplegará el servicio db y, si ha tenido éxito, se desplegará el servicio web.

### 2.5. Comandos de docker-compose
Una vez definido el fichero `docker-compose.yml`, los siguientes comandos son útiles para gestionar el despliegue de nuestra aplicación y sus recursos asociados.

> NOTA: Todos los comandos siguientes están siendo ejecutados desde el directorio donde se encuentra el fichero docker-compose.yml, de lo contrario, hay que especificar la ruta completa al fichero con el parámetro -f.

#### 2.5.1. docker-compose up
Sirve para desplegar la aplicación. Si no se especifica ningún servicio, se desplegarán todos los servicios definidos en el fichero docker-compose.yml. Si se especifica un servicio, se desplegará sólo ese servicio y sus dependencias.

```bash
docker-compose up
```

Con el parámetro -d el despliegue se hará en segundo plano.

#### 2.5.2. docker-compose down
Aunque no hayamos utilizado el parámetro `-d` en el comando docker-compose up, para detener la ejecución de los contenedores correctamente debemos ejecutar el comando:

```bash
docker-compose down
```

#### 2.5.3. docker-compose ps
Sirve para listar los servicios desplegados, y sus contenedores asociados, y ver su estado actual junto con los puertos que tienen expuestos. Es muy útil para comprobar si el despliegue definido en el fichero docker-compose.yml es el esperado:

```bash
docker-compose ps
```

#### 2.5.4. docker-compose logs
Sirve para ver los logs de los contenedores desplegados. Si no se especifica ningún nombre de servicio, se mostrarán los logs de todos los contenedores. Si se especifica un servicio, se mostrarán los logs de los contenedores asociados a ese servicio.

Es muy útil si un servicio ha fallado al desplegarse o simplemente para monitorizar el funcionamiento de dicho servicio.

```bash
docker-compose logs
```

#### 2.5.5. docker-compose exec
Sirve para ejecutar un comando en un contenedor desplegado. Es muy útil si queremos conectarnos al contenedor de un servicio para depurar algún tipo de errores. Por ejemplo, si queremos obtener una shell en el servicio web:

```bash
docker-compose exec web bash
```

#### 2.5.6. docker-compose build o docker-compose pull
`build` sirve para reconstruir las imágenes de los servicios definidos en el fichero docker-compose.yml. Es muy útil si hemos modificado el fichero Dockerfile de algún servicio y queremos reconstruir la imagen asociada a dicho servicio.

```bash
docker-compose build
```

Por otro lado, si nuestras imágenes vienen de un registro, `pull` sirve para descargar las imágenes de los servicios definidos en el fichero docker-compose.yml desde el registro.

```bash
docker-compose pull
```

### 2.6. Comandos docker
Como docker-compose es una herramienta de Docker, podemos inspeccionar todos los contenedores con el comando:

```bash
docker container inspect {container_id}
```

De la misma forma podemos inspeccionar y modificar `imágenes`, `volumenes` y `redes` con los comandos:

```bash
docker image inspect {image_id}
docker volume inspect {volume_id}
docker network inspect {network_id}
```

Sin embargo, es recomendable utilizar los comandos de docker-compose para gestionar los recursos de nuestra aplicación, ya que docker-compose gestiona los recursos de forma automática y nos evita tener que conocer los identificadores de los recursos.

## 3. Ejemplo práctico
Ahora que ya somos expertos en docker-compose y tenemos una chuleta de comandos que podemos utilizar, vamos a desplegar una aplicación de ejemplo para poner a prueba nuestros nuevos conocimientos.

### 3.1. Aplicaciones de ejemplo
Para este ejemplo vamos a utilizar dos aplicaciones de ejemplo:

- `Servidor web`: Una API REST, en nodejs, que nos permite consultar el estado de una base de datos de coches.
- `Base de datos`: Una base de datos MySQL que contiene la tabla con información sobre coches.

En un proyecto real programaréis vuestro propio servicio web, pero en este caso vamos a clonar la apliación del siguiente repositorio. Para ello, ejecutamos el siguiente comando:

```bash
# Podemos clonar por https
git clone https://github.com/nicolaemolnar/dockerizeNode.git
# o clonar por ssh
git clone git@github.com:nicolaemolnar/dockerizeNode.git
```

Una vez clonado el repositorio, tendremos el directorio `dockerizeNode` con un servidor en express que maneja la base de datos mencionada. La implementación de este servidor no es importante, lo que sí es importante es el uso de variables de entorno en lugar de variables fijas:

```nodejs
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'cars'
});
```

El nombre de estas variables de entorno es importante ya que deben coincidir en la definición del parámetro environment del fichero, en el fichero docker-compose.yml.

<br>

Por otro lado, tenemos un contenedor de base de datos MySQL que debe contener una base de datos cars y una tabla `cars` con los siguientes campos:

- `id`: Clave primaria de tipo entero
- `name`: Nombre del coche
- `model`: Modelo del coche
- `price`: Precio del coche

Para ello, al dockerizar la aplicación necesitaremos un fichero SQL que sirva de entrypoint. Este fichero contendrá la creación de la base de la tabla coches y la configuración inicial de la BBDD:

```sql
-- Creación de base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS cars;
USE cars;

-- Creación de la tabla cars
CREATE TABLE IF NOT EXISTS cars (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  PRIMARY KEY (id)
);

-- Carga inicial de la aplicación
INSERT INTO cars (name, model, price) VALUES
('Audi', 'A4', 30000),
('BMW', 'X5', 50000),
('Mercedes', 'C200', 40000);
```

Si no seguir el proceso de creación de imágenes docker podéis utilizar la imágen pública `nicolaemolnar/dockerize-node` para el servidor web y `mysql:5.7` para la base de datos, y pasar directamente al paso 4.

### 3.2. Contenerización con Docker
Ahora que ya tenemos la aplicación lista para desplegar, necesitamos crear las imágenes que contengan, por separado, el servicio web y la base de datos. Para ello, vamos a crear un fichero Dockerfile para cada servicio.

Para dockerizar el servicio web, creamos un fichero `Dockerfile` en el directorio dockerizeNode con el siguiente contenido:

```docker
FROM node:12.18.3-alpine3.9
WORKDIR /app
COPY src/ /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Con el que copiaremos el código fuente de la carpeta src al contenedor, instalaremos sus depencias y ejecutaremos el servicio web. Ya tenemos listo el Dockerfile, ahora sólo necesitamos crear la imagen con el comando:

```bash
docker build -t dockerize-node .
```

Donde el parámetro -t define el tag de la imagen, que nos sirve a nosotros y a otros contenedores para identificar la imagen que hemos creado. En el ejemplo, el . se refiere a la ruta actual, si quisieramos utilizar algún otro directorio, deberíamos indicar su ruta.

Podemos comprobar que la imagen se ha creado correctamente con el comando:

```bash
docker images
```

Por otro lado, para dockerizar la base de datos, no es necesaria una imagen Docker personalizada, ya que con la imagen `mysql:5.7` podemos desplegar la base de datos, definiendo las variables de entorno necesarias. Esto lo haremos en el paso 4.

### 3.3. Subir imagenes a un registro
Ahora que ya tenemos creada la imagen en nuestro equipo, necesitamos subirla a un registro para poder desplegarla en un servidor. Para ello, vamos a utilizar el registro de Docker Hub, que es un registro público de imágenes Docker.

Necesitamos crear una cuenta en Docker Hub y crear un repositorio público en la sección Repositories con el nombre `dockerize-node`.

Una vez creado el repositorio, podemos subir la imagen a Docker Hub con el comando:

```bash
docker tag dockerize-node {username}/dockerize-node
docker push {username}/dockerize-node
```

Donde `{username}` corresponde a vuestro nombre de usuario de DockerHub o el registro utilizado. Sin embargo, antes de ejecutar el comando `docker push`, necesitamos iniciar sesión en Docker Hub con el comando:

```bash
docker login
```

Que nos solicitará el nombre de usuario y contraseña con los que nos hemos registrado en la plataforma. Una vez logados, en mi caso, ejecuto:

```bash
docker tag dockerize-node nicolaemolnar/dockerize-node
docker push nicolaemolnar/dockerize-node
```

Y ya tenemos la imagen subida a Docker Hub. Si no especificamos ninguna etiqueta en los comandos anteriores, se establece la etiqueta latest, pero podemos versionar nuestras imágenes con los comandos:

```bash
docker tag dockerize-node {username}/dockerize-node:{version}
docker push {username}/dockerize-node:{version}
```

### 3.4. Fichero de despliegue
Llegados a este punto tenemos todas las imágenes necesarias en el registro y podemos desplegarlas con docker-compose. Para ello, vamos a crear un fichero `docker-compose.yml` en el directorio `dockerizeNode` con el siguiente contenido:

```yaml
version: '3.7'
services:
  web:
    image: nicolaemolnar/dockerize-node
    ports:
      - 3000:3000
    environment:
      DB_HOST: db
      DB_USER: admin
      DB_PASSWORD: 1234
      DB_NAME: cars
    networks:
      - backend
  db:
    image: mysql:5.7
    ports:
      - 3306:3306
    environment:
      MYSQL_ROOT_PASSWORD: 1234
      MYSQL_DATABASE: cars
      MYSQL_USER: admin
      MYSQL_PASSWORD: 1234
    volumes:
      - ./db/entrypoint.sql:/docker-entrypoint-initdb.d/entrypoint.sql
    networks:
      - backend
networks:
  backend:
    driver: bridge
```

Este fichero define dos servicios, uno para el servicio web y otro para la base de datos. En el servicio web, definimos la imagen que vamos a utilizar, las variables de entorno necesarias para la conexión con la base de datos y el puerto que va a exponer al host.

Por otro lado, en el servicio de la base de datos, definimos la imagen que vamos a utilizar, las variables de entorno necesarias para la creación de la base de datos y el puerto que va a utilizar. Además, definimos un volumen que contiene el fichero entrypoint.sql que creamos en el paso 1. Este fichero se ejecutará automáticamente al iniciar el contenedor de la base de datos y creará la base de datos y la tabla necesarias.

Por último, definimos una red interna para que los contenedores puedan comunicarse entre ellos. Observa que la variable de entorno `DB_HOST` del servicio web tiene un nombre y no una dirección IP. Esto se debe a que Docker crea un DNS interno para que los contenedores puedan comunicarse entre ellos utilizando los nombres de los servicios definidos en el fichero `docker-compose.yml`, evitando tener que ir cambiando las direcciones IP cada vez que se crea un nuevo contenedor.


### 3.5. Despliegue
Para desplegar la aplicación, sólo necesitamos ejecutar el comando:

```bash
docker-compose up -d
```

> NOTA: Si la imagen mysql:5.7 no existe en nuestro equipo este comando tardará más de lo normal ya que tiene que descargar la imagen del registro.

Y si todo ha ido bien, ya podemos acceder a la aplicación en el `puerto 3000` de nuestro servidor. Para comprobar que todo funciona correctamente, podemos ejecutar el comando:

```bash
docker-compose ps
```

Que nos mostrará los contenedores que se han creado y su estado.

Para utilizar nuestra nueva aplicación podemos utilizar el comando `curl` o `Postman`. Por ejemplo, podemos usar curl para enumerar todos los coches:

```bash
curl localhost:3000/api/cars
```

Obtener sólo uno:

```bash
curl localhost:3000/api/cars/1
```

Y crear uno nuevo por el verbo POST:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"Ford","model":"Focus","price":15000}' localhost:3000/api/cars
```` 
Por último, para finalizar el despliegue, ejecutamos el comando:

```bash
docker-compose down
```

## 4. Conclusiones
Como hemos visto, desplegar aplicaciones en contenedores con Docker y docker-compose es muy sencillo. La definición de servicios es intuitiva y docker nos ofrece un servicio de DNS que nos evita tener que configurar IPs a mano. Por eso, es importante programar nuestras aplicaciones con valores definidos en variables de entorno para que podamos cambiarlos fácilmente en el momento de desplegar la aplicación, en lugar de crear otra imagen Docker distinta.

Además, hemos aprendido a crear nuestra propia imagen Docker a partir de una aplicación, por medio de Dockerfile, y a subirla a un registro para que pueda ser utilizada por otros usuarios.

## 5. Bibliografía
- [DevOps: La guía completa](https://www.autentia.com/libros-y-guias/)
- [Docker](https://www.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Documentación de Docker](https://docs.docker.com/engine/reference/builder/)
- [Documentación de docker-compose](https://docs.docker.com/compose/)
- [Especificación docker-compose](https://docs.docker.com/compose/compose-file/)
- [API Rest con Express](https://bravedeveloper.com/2021/03/22/crear-un-api-rest-con-nodejs-y-express-nunca-fue-tan-provechoso-y-sencillo/)
- [Integración MySQL con Express](https://expressjs.com/en/guide/database-integration.html#mysql)