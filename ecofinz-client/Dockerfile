FROM node:20-alpine

# Instalar herramientas de compilación necesarias para compilar tree-sitter-bash u otros módulos nativos
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# En desarrollo, corremos npm run dev
CMD ["npm", "run", "dev"]
