FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum* ./
RUN go mod download || true

COPY . .
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o server .

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/server .
COPY --from=builder /app/images ./images

EXPOSE 8080

CMD ["./server"]
