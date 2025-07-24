FROM node:21

# Enable and prepare pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy lockfiles and package.json from root
COPY pnpm-lock.yaml package.json ./

# Copy the rest of the monorepo
COPY . .

# Install all dependencies for the monorepo
RUN pnpm install --frozen-lockfile

RUN pnpm run build

# Expose API port
EXPOSE 3000

# Run the API in production mode
CMD ["pnpm", "--filter", "api", "run", "start"]