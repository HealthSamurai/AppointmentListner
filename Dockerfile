FROM node
ADD ./app.js /var/
ADD ./node_modules  /var/node_modules
WORKDIR /var
CMD node app.js
