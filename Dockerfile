# Only serve built files with Nginx
FROM nginx:alpine

# Copy built static files
COPY dist /usr/share/nginx/html

# Copy your custom nginx config if you have one
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# 