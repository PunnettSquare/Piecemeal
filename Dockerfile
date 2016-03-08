FROM node
RUN mkdir app

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

WORKDIR app

ADD . /app/

EXPOSE 8080

CMD ["npm", "start"]
