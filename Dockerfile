# Usar la imagen oficial de Node.js 18 en Alpine Linux como base
FROM node:18-alpine

# Crear un directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el package.json y package-lock.json (si existe) a la imagen
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto en el que se ejecutará la aplicación Express
EXPOSE 3000

# Comando para ejecutar la aplicación cuando el contenedor se inicie
CMD [ "node", "app.js" ]