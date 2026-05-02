# Руководство по листингу кода для функциональных модулей CoffeCRM

Этот документ содержит ссылки на ключевые файлы и участки кода для основных функциональных модулей CoffeCRM. Предназначен для быстрой навигации и понимания структуры проекта.

## 3.1. Разработка модуля авторизации

### 3.1.1. Backend
-   **Файл:** `backend/src/jwt-auth.guard.ts`
    -   **Назначение:** Реализация JWT Guard для защиты маршрутов.
    -   **Листинг кода:** Строки 6-36 (class JwtAuthGuard...)
-   **Файл:** `backend/src/app/user/user/user.controller.ts`
    -   **Назначение:** Контроллер для управления пользователями и связанными с ними действиями (получение информации, обновление, удаление).
    -   **Листинг кода:**
        -   Строки 17-156 (class UserController...)
        -   Строки 25-28 (метод getMe)
        -   Строки 30-58 (метод getAllUsers)
        -   Строки 60-84 (метод updateMe)
        -   Строки 86-89 (метод deleteMe)
        -   Строки 91-94 (метод getUserById)
        -   Строки 96-120 (метод updateUser)
        -   Строки 122-125 (метод deleteUser)
-   **Файл:** `backend/src/app/user/user/user_service.ts`
    -   **Назначение:** Сервис, содержащий бизнес-логику для операций с пользователями, включая взаимодействие с базой данных.
    -   **Листинг кода:**
        -   Строки 5-115 (class UserService...)
        -   Строки 9-33 (метод getUserInfo)
        -   Строки 35-50 (метод updateUser)
        -   Строки 52-57 (метод deleteUser)
        -   Строки 59-113 (метод getAllUsers)
-   **Файл:** `backend/src/dto/login.dto.ts`
    -   **Назначение:** DTO (Data Transfer Object) для данных входа пользователя.
    -   **Листинг кода:** Строки 5-14 (class LoginDto...)
-   **Файл:** `backend/src/dto/register.dto.ts`
    -   **Назначение:** DTO для данных регистрации нового пользователя.
    -   **Листинг кода:** Строки 3-29 (class RegisterDto...)

### 3.1.2. Frontend
-   **Файл:** `frontend/coffecrm/app/login/page.tsx`
    -   **Назначение:** Страница авторизации пользователя.
    -   **Листинг кода:** Строки 9-50 (function LoginPage()...)

## 3.2. Разработка модуля управления каталогом продуктов и услуг

### 3.2.1. Backend
-   **Файл:** `backend/src/app/category/category.controller.ts`
    -   **Назначение:** API-контроллер для управления категориями продуктов.
    -   **Листинг кода:** Строки 6-49 (class CategoryController...)
-   **Файл:** `backend/src/app/category/category.service.ts`
    -   **Назначение:** Сервис, реализующий бизнес-логику для операций с категориями.
    -   **Листинг кода:** Строки 5-47 (class CategoryService...)
-   **Файл:** `backend/src/dto/category.dto.ts`
    -   **Назначение:** DTO для создания и обновления категорий.
    -   **Листинг кода:** Строки 3-17 (class CreateCategoryDto, class UpdateCategoryDto...)
-   **Файл:** `backend/src/app/product/product/product.controller.ts`
    -   **Назначение:** API-контроллер для управления продуктами.
    -   **Листинг кода:** Строки 13-83 (class ProductController...)
-   **Файл:** `backend/src/app/product/product/product_service.ts`
    -   **Назначение:** Сервис, реализующий бизнес-логику для операций с продуктами, включая загрузку изображений.
    -   **Листинг кода:** Строки 8-360 (class ProductService...)
-   **Файл:** `backend/src/dto/product.dto.ts`
    -   **Назначение:** DTO для создания и обновления продуктов.
    -   **Листинг кода:** Строки 3-120 (class CreateProductDto, class UpdateProductDto...)

### 3.2.2. Frontend
-   **Файл:** `frontend/coffecrm/app/products/page.tsx`
    -   **Назначение:** Страница управления списком продуктов.
    -   **Листинг кода:** Строки 14-177 (const ProductsPage: React.FC ...)
-   **Файл:** `frontend/coffecrm/app/categories/page.tsx`
    -   **Назначение:** Страница управления списком категорий продуктов.
    -   **Листинг кода:** Строки 14-142 (const CategoriesPage: React.FC ...)

## 3.3. Разработка модуля учета и обработки заказов

### 3.3.1. Backend
-   **Файл:** `backend/src/app/orders/orders.controller.ts`
    -   **Назначение:** API-контроллер для управления заказами.
    -   **Листинг кода:** Строки 4-33 (class OrdersController...)
-   **Файл:** `backend/src/app/orders/orders.service.ts`
    -   **Назначение:** Сервис, реализующий бизнес-логику для операций с заказами, включая корректировку склада.
    -   **Листинг кода:** Строки 8-274 (class OrdersService...)
-   **Файл:** `backend/src/dto/order.dto.ts`
    -   **Назначение:** DTO для создания и обновления заказов.
    -   **Листинг кода:** Строки 6-70 (class CreateOrderDto, class UpdateOrderDto...)
-   **Файл:** `backend/src/dto/order-item.dto.ts`
    -   **Назначение:** DTO для элементов заказа.
    -   **Листинг кода:** Строки 3-21 (class CreateOrderItemDto, class UpdateOrderItemDto...)

### 3.3.2. Frontend
-   **Файл:** `frontend/coffecrm/app/orders/page.tsx`
    -   **Назначение:** Страница управления списком заказов.
    -   **Листинг кода:** Строки 20-221 (const OrdersPage: React.FC ...)

## 3.5. Разработка модуля аналитики продаж и финансовой отчетности

### 3.5.1. Backend
-   **Файл:** `backend/src/app/analytics/analytics.controller.ts`
    -   **Назначение:** API-контроллер для получения аналитических данных и экспорта отчетов.
    -   **Листинг кода:** Строки 6-82 (class AnalyticsController...)
-   **Файл:** `backend/src/app/analytics/analytics.service.ts`
    -   **Назначение:** Сервис, содержащий логику для сбора, обработки и агрегации аналитических данных.
    -   **Листинг кода:** Строки 14-307 (class AnalyticsService...)
-   **Файл:** `backend/src/app/dashboard/dashboard.controller.ts`
    -   **Назначение:** API-контроллер для получения сводных данных дашборда.
    -   **Листинг кода:** Строки 5-15 (class DashboardController...)
-   **Файл:** `backend/src/app/dashboard/dashboard.service.ts`
    -   **Назначение:** Сервис, содержащий логику для формирования данных дашборда и KPI.
    -   **Листинг кода:** Строки 8-275 (class DashboardService...)
-   **Файл:** `backend/src/dto/report.dto.ts`
    -   **Назначение:** DTO для данных отчетов.
    -   **Листинг кода:** Строки 1-9 (class CreateReportDto, class UpdateReportDto...)

### 3.5.2. Frontend
-   **Файл:** `frontend/coffecrm/app/analytics/page.tsx`
    -   **Назначение:** Страница отображения аналитических отчетов.
    -   **Листинг кода:** Строки 26-304 (const AnalyticsPage: React.FC ...)
-   **Файл:** `frontend/coffecrm/app/page.tsx`
    -   **Назначение:** Главная страница приложения, отображающая дашборд с основными метриками и графиками.
    -   **Листинг кода:** Строки 16-200 (function Home()...)

## 3.6. Разработка пользовательского интерфейса на Next.js

### 3.6.1. Frontend
-   **Файл:** `frontend/coffecrm/app/layout.tsx`
    -   **Назначение:** Корневой компонент макета Next.js, определяющий общую структуру страницы (HTML, Body, провайдеры контекста).
    -   **Листинг кода:** Строки 15-32 (function RootLayout...)
-   **Файл:** `frontend/coffecrm/components/Layout/Sidebar.tsx`
    -   **Назначение:** Компонент боковой панели навигации приложения.
    -   **Листинг кода:** Строки 31-409 (const Sidebar: React.FC<SidebarProps>...)
