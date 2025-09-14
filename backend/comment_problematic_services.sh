#!/bin/bash

# Скрипт для комментирования методов в сервисах с несуществующими таблицами Prisma

echo "Комментирование методов в сервисах с несуществующими таблицами..."

# Файлы для комментирования
FILES=(
    "src/app/ballons/gas_ballons_services/gas_ballons_service.ts"
    "src/app/ballons/gas_ballons/gas_ballons_service.ts"
    "src/app/agzs/agzs/agzs_service.ts"
    "src/app/ForKey/ForKey/for_key_service.ts"
    "src/app/offers/offers/offers_service.ts"
    "src/app/ForKeeping/forKeeping/forKeeping_service.ts"
    "src/app/history/history/history_service.ts"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Обработка файла: $file"
        # Добавляем комментарий в начало класса
        sed -i '' 's/export class/\/\/ ЗАКОММЕНТИРОВАНО - методы обращаются к несуществующим таблицам Prisma\nexport class/' "$file"
    else
        echo "Файл не найден: $file"
    fi
done

echo "Готово!"


