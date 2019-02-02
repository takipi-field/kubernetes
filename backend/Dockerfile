FROM centos:6

# install OpenJDK 8
RUN yum install -y java-1.8.0-openjdk-devel

# environmental variables
ENV JAVA_HOME /etc/alternatives/jre

ENV HOST_URL overops-server
ENV FRONTEND_URL overops.example.com

ENV DB_TYPE mysql
ENV DB_URL database_server_url
ENV DB_USER database_user
ENV DB_PASS database_password

# install into the /opt directory
WORKDIR /opt

# download and install the backend
RUN curl -sL https://s3.amazonaws.com/app-takipi-com/deploy/takipi-server/takipi-server-java.tar.gz | tar -xvzf -

# use mount to make .properties files available
RUN mkdir private \
 && mv /opt/takipi-server/conf/tomcat-original/my.server.properties private/my.server.properties \
 && mv /opt/takipi-server/conf/tomcat-original/smtp.properties private/smtp.properties \
 && mv /opt/takipi-server/conf/tomcat-original/smtpserver.properties private/smtpserver.properties \
 && mkdir -p /opt/takipi-server/conf/tomcat/shared \
 && ln -s /opt/private/my.server.properties /opt/takipi-server/conf/tomcat/shared/my.server.properties \
 && ln -s /opt/private/smtp.properties /opt/takipi-server/conf/tomcat/shared/smtp.properties \
 && ln -s /opt/private/smtpserver.properties /opt/takipi-server/conf/tomcat/shared/smtpserver.properties
VOLUME ["/opt/private"]

# alternately, copy .properties files into the image
# COPY my.server.properties /opt/takipi-server/conf/tomcat-original
# COPY smtp.properties /opt/takipi-server/conf/tomcat-original
# COPY smtpserver.properties /opt/takipi-server/conf/tomcat-original

# use a volume to store data
VOLUME ["/opt/takipi-server/storage"]

# create a run script
RUN echo "#!/bin/bash" > run.sh \
 && echo "cat /opt/takipi-server/VERSION" >> run.sh \
 && echo "/opt/takipi-server/bin/takipi-server.sh -u \${HOST_URL} --frontend-url \${FRONTEND_URL} --db-type \${DB_TYPE} --db-url \${DB_URL} --db-user \${DB_USER} --db-password \${DB_PASS} start" >> run.sh \
 && echo "/bin/sleep 10" >> run.sh \
 && echo "/usr/bin/tail -f /opt/takipi-server/log/tomcat/stdout -f /opt/takipi-server/log/tomcat/stderr -f -f /opt/takipi-server/log/tomcat/tomcat/catalina.log" >> run.sh \
 && chmod +x run.sh

EXPOSE 8080

# run the service, printing logs to stdout
CMD ["./run.sh"]