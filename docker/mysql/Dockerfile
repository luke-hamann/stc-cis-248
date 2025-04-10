FROM mysql
COPY ./src/sql/build.sql /docker-entrypoint-initdb.d/build.sql
COPY ./src/sql/sample.sql /docker-entrypoint-initdb.d/sample.sql
EXPOSE 3306
