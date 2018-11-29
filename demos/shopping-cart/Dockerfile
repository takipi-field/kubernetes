FROM centos:6

RUN yum install -y java-1.8.0-openjdk java-1.8.0-openjdk-devel git
RUN yum install -y yum-utils \
 && yum-config-manager --add-repo http://repos.fedorapeople.org/repos/dchen/apache-maven/epel-apache-maven.repo \
 && yum-config-manager --enable epel-apache-maven \
 && yum install -y apache-maven

ENV JAVA_HOME /etc/alternatives/jre

WORKDIR /opt/demo

# use the shopping cart demo app
RUN git clone https://github.com/takipi-field/ShoppingCart.git . \
 && mvn install:install-file -Dfile=takipi-sdk-0.2.0.jar -DgroupId=com.takipi -DartifactId=takipi-sdk -Dversion=0.2.0 -Dpackaging=jar -DgeneratePom=true \
 && mvn clean compile package

CMD ["java", "-Xms1G", "-Xmx1G", "-Dtakipi.name=ShoppingCartApplication", "-Dtakipi.deployment.name=v1.0", "-jar", "/opt/demo/target/shopping-cart-demo-1.0.jar", "run_mode=ALL_WORKFLOWS", "no_of_threads=10", "no_of_iterations=100000"]
