# Base image with Python and Node.js
FROM mcr.microsoft.com/devcontainers/python:3.12

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /tmp/requirements.txt
RUN pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt

# Install Node.js (for Vercel CLI and frontend development)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install Vercel CLI globally
RUN npm install -g vercel

# Set work directory
WORKDIR /workspace

# Copy the install script
COPY .devcontainer/install.sh /usr/local/bin/install.sh
RUN chmod +x /usr/local/bin/install.sh

# Run install script
RUN /usr/local/bin/install.sh
