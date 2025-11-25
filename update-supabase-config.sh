#!/bin/bash

# Script to update Supabase configuration
# Based on your project: zgwcqyfeixtzriyujvdf

echo "🔧 Setting up Supabase configuration..."
echo ""

# Project reference from your dashboard
PROJECT_REF="zgwcqyfeixtzriyujvdf"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"

echo "📋 Your Supabase URL: ${SUPABASE_URL}"
echo ""
echo "⚠️  You still need to get your anon key:"
echo "   1. Go to: https://supabase.com/dashboard/project/${PROJECT_REF}/settings/api"
echo "   2. Find 'anon' or 'public' key under 'Project API keys'"
echo "   3. Copy the key (it's a long JWT token)"
echo ""
read -p "Enter your anon key (or press Enter to skip): " ANON_KEY

if [ -z "$ANON_KEY" ]; then
    echo ""
    echo "⚠️  No key provided. Creating template .env.local file..."
    cat > .env.local << EOF
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
EOF
    echo "✅ Created .env.local with URL. Please add your anon key manually."
else
    cat > .env.local << EOF
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${ANON_KEY}
EOF
    echo "✅ Updated .env.local with your credentials!"
fi

echo ""
echo "📝 Next steps:"
echo "   1. If you didn't add the key, edit .env.local and add it"
echo "   2. Restart your dev server: npm run dev"
echo "   3. Test the login!"

