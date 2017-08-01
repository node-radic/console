FROM node:6.9.4

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install git

#RUN git clone git@github.com:node-radic/console /pipeline
COPY scripts/docker-pipelines.sh /docker-pipelines.sh
RUN chmod +x /docker-pipelines.sh

RUN mkdir /pipeline
WORKDIR /pipeline
VOLUME ["/pipeline"]
CMD ["/docker-pipelines.sh"]