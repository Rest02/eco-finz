FROM node:20-alpine

# Instalar openssl, pg_isready y dependencias de compilación para bcrypt/native modules
RUN apk add --no-cache openssl postgresql-client python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Variable de entorno temporal para pasar la validación durante la compilación del cliente Prisma
ENV DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/dummy"

# El directorio src/generated/prisma puede quedar obsoleto del build anterior,
# se elimina para que Prisma lo regenere limpio desde el schema actual.
RUN rm -rf src/generated/prisma && npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
