FROM node:16
WORKDIR /be-interviewee-code-test
ADD ./init/init.sql /docker-entrypoint-initdb.d
RUN chmod -R 775 /docker-entrypoint-initdb.d
COPY . .
RUN npm install
EXPOSE 6868
CMD npm run start



