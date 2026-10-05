FROM docker.io/library/node:24-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM docker.io/library/node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN adduser -D -H -u 65532 partovio
COPY --from=build /src/.next/standalone ./
COPY --from=build /src/.next/static ./.next/static
USER 65532:65532
EXPOSE 3000
CMD ["node", "server.js"]
