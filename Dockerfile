FROM node
RUN mkdir app

WORKDIR app

ADD package.json /app/
RUN npm install

ADD . /app/

EXPOSE 8080

CMD ["npm", "start"]
