FROM nginx:alpine

# Nginx-Konfiguration kopieren
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Statische Dateien kopieren
COPY src/ /usr/share/nginx/html/

EXPOSE 80
