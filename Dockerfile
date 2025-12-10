# Run Playwright tests in a container
# Uses the official Playwright image with browsers preinstalled
FROM mcr.microsoft.com/playwright:v1.55.0-jammy

WORKDIR /app

# Install system dependencies required for Chromium to run properly in Docker
RUN apt-get update && apt-get install -y \
    dbus \
    dbus-x11 \
    libgbm1 \
    libxss1 \
    libnss3 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Install deps first to leverage Docker layer caching
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy the rest of the repo
COPY . .

# Ensure images folder is included in the image
COPY images ./images

# Allow overriding baseURL at runtime (useful when the AUT runs outside the container)
# Example: docker run -e BASE_URL=http://host.docker.internal:3000 ...
ENV NODE_ENV=production

# Default command runs the tests
CMD ["npx", "playwright", "test"]