FROM node:22

WORKDIR /app

# Use the built-in "node" user (uid/gid 1000 = your WSL user) and make sure
# /app, node_modules and .next exist and are owned by it, so the anonymous
# volumes in docker-compose inherit that ownership.
RUN mkdir -p /app/node_modules /app/.next && chown -R node:node /app
USER node

COPY --chown=node:node package*.json ./
RUN npm install

COPY --chown=node:node . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
