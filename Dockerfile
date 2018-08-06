FROM node:8.11.3-alpine

WORKDIR /workdir

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

# Bundle app source
COPY . .

CMD [ "yarn", "start" ]
