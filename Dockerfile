# ── Stage 1: Build (пока статика, но структура готова к расширению) ──
FROM nginx:1.25-alpine

# Метаданные образа
LABEL maintainer="jaryk-dent"
LABEL description="Жарық Дент — dental clinic website"

# Копируем файлы сайта в nginx html-директорию
COPY . /usr/share/nginx/html

# Копируем кастомный nginx конфиг
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 80

# Healthcheck — Docker будет сам проверять живость контейнера
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
