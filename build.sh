#!/bin/bash

# Определяем директории исходников и вывода
SRC_DIR="./src"
OUT_DIR="./dist"

# Создаем директорию вывода, если она не существует
mkdir -p "$OUT_DIR"

# Функция для компиляции файлов TypeScript
compile() {
    echo "Компиляция файлов TypeScript из $SRC_DIR в $OUT_DIR..."
    tsc --project tsconfig.json --outDir "$OUT_DIR" --target ESNext

    # Проверяем, успешна ли компиляция
    if [ $? -eq 0 ]; then
        echo "Компиляция завершена успешно."
    else
        echo "Компиляция завершилась неудачно."
        exit 1
    fi
}

# Функция для запуска скомпилированных JavaScript файлов
run() {
    # Запускаем сервер
    if [ -f "$OUT_DIR/server.js" ]; then
        echo "Запуск сервера..."
        node "$OUT_DIR/server.js" &
        SERVER_PID=$! # Сохраняем PID сервера
        echo "Сервер запущен с PID $SERVER_PID."

        # Ожидаем некоторое время, чтобы убедиться, что сервер запущен
        sleep 2 # Задержка в 2 секунды

        # Ожидаем завершения работы сервера
        wait $SERVER_PID
    else
        echo "Ошибка: файл $OUT_DIR/server.js не найден."
        exit 1
    fi
}

# Функция для остановки сервера
stop() {
    if [ -n "$SERVER_PID" ]; then
        echo "Остановка сервера с PID $SERVER_PID..."
        kill $SERVER_PID
        echo "Сервер остановлен."
    else
        echo "Сервер не запущен."
    fi
}

# Проверяем наличие аргумента --run
if [ "$1" == "--run" ]; then
    compile
    run
elif [ "$1" == "--stop" ]; then
    stop
else
    compile
fi
