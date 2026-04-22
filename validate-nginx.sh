#!/bin/bash
# Nginx Configuration Validation Script

echo "Validating nginx.conf structure..."

CONFIG_FILE="frontend/nginx.conf"

# Check if file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Error: $CONFIG_FILE not found"
    exit 1
fi

echo "✓ File exists"

# Check for server-level add_header directives (should not exist)
SERVER_HEADERS=$(grep -A 50 "server {" "$CONFIG_FILE" | grep -B 50 "location" | grep "add_header" | grep -v "location" || true)

if [ -n "$SERVER_HEADERS" ]; then
    echo "❌ Error: Found add_header directives at server level (will be overridden)"
    echo "$SERVER_HEADERS"
    exit 1
fi

echo "✓ No server-level add_header directives found"

# Check that all location blocks with add_header have all security headers
LOCATIONS=$(grep -n "location" "$CONFIG_FILE" | grep -v "#" | cut -d: -f1)

for line in $LOCATIONS; do
    LOCATION_NAME=$(sed -n "${line}p" "$CONFIG_FILE")
    BLOCK_END=$(awk "NR>$line && /}/ {print NR; exit}" "$CONFIG_FILE")
    
    if [ -z "$BLOCK_END" ]; then
        continue
    fi
    
    BLOCK_CONTENT=$(sed -n "${line},${BLOCK_END}p" "$CONFIG_FILE")
    
    # If location has any add_header, check for security headers
    if echo "$BLOCK_CONTENT" | grep -q "add_header"; then
        echo "Checking location: $LOCATION_NAME"
        
        if echo "$BLOCK_CONTENT" | grep -q "add_header.*X-Frame-Options"; then
            echo "  ✓ X-Frame-Options present"
        else
            echo "  ⚠ X-Frame-Options missing"
        fi
        
        if echo "$BLOCK_CONTENT" | grep -q "add_header.*X-Content-Type-Options"; then
            echo "  ✓ X-Content-Type-Options present"
        else
            echo "  ⚠ X-Content-Type-Options missing"
        fi
        
        if echo "$BLOCK_CONTENT" | grep -q "add_header.*X-XSS-Protection"; then
            echo "  ✓ X-XSS-Protection present"
        else
            echo "  ⚠ X-XSS-Protection missing"
        fi
        
        if echo "$BLOCK_CONTENT" | grep -q "add_header.*Referrer-Policy"; then
            echo "  ✓ Referrer-Policy present"
        else
            echo "  ⚠ Referrer-Policy missing"
        fi
    fi
done

echo ""
echo "✅ Nginx configuration validation complete"
