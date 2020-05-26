FROM  node:12.16.3-alpine

LABEL maintainer="Dave Snyder <dave.snyder@overops.com>"

WORKDIR /opp

COPY package-lock.json .
COPY package.json .

RUN npm install

COPY index.js .
RUN mkdir resources
COPY resources/. resources/.

EXPOSE 3000

ENTRYPOINT [ "node" ]
CMD ["index.js"]
