#!/bin/bash

echo "Starting Vercel build for demo..."

# Ensure public directory exists
if [ ! -d "public" ]; then
  echo "Creating public directory..."
  mkdir -p public
fi

# Copy favicon and logos if they don't exist
if [ ! -f "public/favicon.ico" ]; then
  echo "Copying favicon..."
  cp favicon.ico public/ 2>/dev/null || echo "favicon.ico not found, skipping"
fi

if [ ! -f "public/logo.png" ]; then
  echo "Copying logo.png..."
  cp src/images/logo.png public/ 2>/dev/null || echo "logo.png not found, skipping"
fi

if [ ! -f "public/logo_white.png" ]; then
  echo "Copying logo_white.png..."
  cp src/images/logo_white.png public/ 2>/dev/null || echo "logo_white.png not found, skipping"
fi

# Run the build
echo "Running demo build..."
npm run build:demo

# Verify output
if [ -d "dist-demo" ]; then
  echo "Build successful! Contents of dist-demo:"
  ls -la dist-demo/
else
  echo "ERROR: dist-demo directory not found!"
  exit 1
fi