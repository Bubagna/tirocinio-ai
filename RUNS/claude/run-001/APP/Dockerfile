FROM node:20-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./
COPY server/package.json server/
COPY web/package.json web/

RUN npm ci

# Copy source
COPY server/ server/
COPY web/ web/

# Build frontend
RUN npm run build -w web

EXPOSE 3000

CMD ["npm", "start", "-w", "server"]
