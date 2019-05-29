# production
# rebornpvm/bot:latest
FROM node:11 as production

LABEL author="Jurien Hamaker <jurien@kings-dev.io> (https://kings-dev.io)"
LABEL description="Dockerfile for Gnome child osrs Bot."

WORKDIR /opt/app

ADD dist /opt/app/dist
ADD node_modules /opt/app/node_modules
ADD package.json /opt/app/

ENTRYPOINT [ "npm" ]

# development
FROM production as development

ENV NODE_ENV development

COPY ./docker/start /start
RUN chmod 775 /start

ENTRYPOINT ["/start"]