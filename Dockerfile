FROM node:7

WORKDIR /app

RUN npm install nodemon -g
RUN npm install bower -g

COPY package.json /app

RUN npm install

COPY bower.json /app
COPY .bowerrc /app

RUN bower install --allow-root

COPY . /app

EXPOSE 3000
