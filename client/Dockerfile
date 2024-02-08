FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

RUN npm install react-bootstrap bootstrap @emotion/react @emotion/styled @mui/icons-material @mui/base @mui/material react-date-range date-fns

COPY . .

EXPOSE 3000

CMD ["npm", "start"]