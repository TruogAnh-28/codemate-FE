FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies using npm
RUN npm install

# Copy project files
COPY . .

EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]