FROM node:16 as BUILD_IMAGE
RUN mkdir -p /user/dist
WORKDIR /user/dist

COPY  . .
# RUN npm install

# Here we will use alpine; alpine is a lean docker iamge with
# minimum packages but enough to run node applications.
# By using alpine the image size dropped to 200M from 1G
FROM node:16-alpine
RUN mkdir -p /user/dist
WORKDIR /user/dist

# COPY --from=BUILD_IMAGE $TARGET_PATH ./
# COPY --from=BUILD_IMAGE $TARGET_PATH/node_modules ./node_modules

EXPOSE 8888

# RUN the app

CMD ["node", "./index.js"]