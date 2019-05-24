# production
# rebornpvm/bot:latest
FROM rebornpvm/pm2 as production

LABEL author="Jurien Hamaker <jurien@kings-dev.io> (https://kings-dev.io)"
LABEL description="Dockerfile for Gnome child osrs Bot."

WORKDIR /opt/app

ADD . /opt/app


# development
FROM production as development

ENV NODE_ENV development

COPY ./docker/start /start
RUN chmod 775 /start

ENTRYPOINT ["/start"]