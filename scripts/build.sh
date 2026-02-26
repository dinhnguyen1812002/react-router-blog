#!/bin/bash

# Build script for Docker
set -e

echo "🧹 Cleaning previous builds..."
rm -rf build dist .react-router

echo "📦 Installing dependencies..."
bun install --frozen-lockfile

echo "🏗️ Building application..."
NODE_ENV=production NODE_OPTIONS="--max-old-space-size=4096" bun run build

echo "✅ Build completed successfully!"