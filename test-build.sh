#!/bin/bash

echo "🔧 Testing build process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run build
echo "🏗️ Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Output directory contents:"
    ls -la out/
    
    echo "🔍 Checking for critical files..."
    if [ -f "out/index.html" ]; then
        echo "✅ index.html found"
    else
        echo "❌ index.html missing"
    fi
    
    if [ -d "out/_next" ]; then
        echo "✅ _next directory found"
    else
        echo "❌ _next directory missing"
    fi
    
    echo "🎉 Build test completed successfully!"
else
    echo "❌ Build failed!"
    exit 1
fi
