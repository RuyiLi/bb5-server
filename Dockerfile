ARG NODE_VERSION=12.16.1
# Use Alpine Linux as parent image
FROM node:${NODE_VERSION}

WORKDIR /server

# Copy our project files into the image's working directory
COPY . .

# Install our dependencies
RUN npm i

# Install typescript
RUN npm i -D typescript

# Compile typescript files
RUN ./node_modules/.bin/tsc

# Execute start script
CMD [ "npm", "start" ]
