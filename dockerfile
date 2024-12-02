# Etapa 1: Usar uma imagem base oficial do Node.js
FROM node:22

# Etapa 2: Definir o diretório de trabalho dentro do contêiner
WORKDIR /app-fe

# Etapa 3: Copiar o package.json e o package-lock.json (se existir) para o contêiner
COPY package*.json ./

# Etapa 4: Instalar as dependências do projeto
RUN npm install

# Etapa 5: Copiar o restante dos arquivos do projeto para o contêiner
COPY . .

EXPOSE 3000

# Etapa 7: Comando para rodar a aplicação Node.js
CMD ["npm", "start"]
