const fs = require('fs');
const path = require('path');

// Файлы для комментирования
const files = [
    'src/app/product/product/category_service.ts',
    'src/app/shops/shops/shops_service.ts',
    'src/app/ForKeeping/forKeeping/forKeeping_service.ts',
    'src/app/history/history/history_service.ts'
];

files.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        console.log(`Обработка: ${filePath}`);
        
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Находим все методы класса и комментируем их
        const methodRegex = /(\s+async\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\n\s+\})/g;
        
        content = content.replace(methodRegex, (match) => {
            return `\n  // ЗАКОММЕНТИРОВАНО - метод обращается к несуществующим таблицам Prisma\n  /*\n${match}\n  */`;
        });
        
        fs.writeFileSync(fullPath, content);
        console.log(`✓ Обработан: ${filePath}`);
    } else {
        console.log(`✗ Файл не найден: ${filePath}`);
    }
});

console.log('Готово! Все методы закомментированы.');


