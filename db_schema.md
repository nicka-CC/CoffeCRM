# Схема базы данных

Это описание урезанной схемы базы данных, основанное на диаграмме `db.drawio`.

## Table: User

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор пользователя. Primary Key. |
| email | text | Электронная почта пользователя, используется для входа. Должна быть уникальной. |
| password | text | Хэшированный пароль пользователя. |
| fullName | text | Полное имя пользователя. |
| role | Role | Роль пользователя в системе (ADMIN, READ, EDITE, WRITE). Определяет уровень доступа. |
| phone | text | Номер телефона пользователя. |
| createdAt | timestamp | Дата и время создания записи о пользователе. |
| updatedAt | timestamp | Дата и время последнего обновления записи о пользователе. |
| icon | text | URL или путь к аватару пользователя. |

## Table: Employee

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор сотрудника. Primary Key. |
| userId | integer | Идентификатор связанной записи в таблице `User`. Foreign Key. |
| branchId | integer | Идентификатор связанного филиала, в котором работает сотрудник. Foreign Key к `Branch`. |
| position | text | Должность сотрудника (например, "Бариста", "Менеджер"). |
| salary | double precision | Размер заработной платы сотрудника. |
| hiredAt | timestamp | Дата и время приема сотрудника на работу. |
| createdAt | timestamp | Дата и время создания записи о сотруднике. |
| updatedAt | timestamp | Дата и время последнего обновления записи о сотруднике. |

## Table: Kpi

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор записи KPI. Primary Key. |
| employeeId | integer | Идентификатор сотрудника, к которому относится этот KPI. Foreign Key к `Employee`. |
| metric | text | Название метрики KPI (например, "Продажи за час", "Средний чек"). |
| value | double precision | Значение метрики KPI. |
| date | timestamp | Дата, за которую рассчитан показатель KPI. |
| createdAt | timestamp | Дата и время создания записи. |
| updatedAt | timestamp | Дата и время последнего обновления записи. |

## Table: Branch

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор филиала. Primary Key. |
| name | text | Название филиала. |
| address | text | Полный адрес филиала. |
| createdAt | timestamp | Дата и время создания записи о филиале. |
| icon | text | URL или путь к иконке/логотипу филиала. |
| updatedAt | timestamp | Дата и время последнего обновления записи о филиале. |
| email | text | Контактный email филиала. |
| phone | text | Контактный номер телефона филиала. |
| area | double precision | Площадь филиала в квадратных метрах. |
| capacity | integer | Вместимость филиала (количество посадочных мест). |
| description | text | Описание филиала. |
| isActive | boolean | Флаг, активен ли филиал в данный момент. |
| managerName | text | Имя управляющего филиалом. |
| openTime | text | Время открытия филиала. |
| postalCode | text | Почтовый индекс. |

## Table: Product

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор продукта. Primary Key. |
| categoryId | integer | Идентификатор категории, к которой относится продукт. Foreign Key к `Category`. |
| name | text | Название продукта. |
| price | double precision | Текущая цена продукта. |
| isActive | boolean | `true`, если продукт доступен для продажи. |
| createdAt | timestamp | Дата и время создания продукта. |
| icon | text | URL или путь к иконке продукта. |
| updatedAt | timestamp | Дата и время последнего обновления продукта. |
| cost | double precision | Себестоимость продукта. |
| description | text | Подробное описание продукта. |
| imageUrl | text | URL основного изображения продукта. |
| calories | integer | Количество калорий. |
| carbs | double precision | Количество углеводов. |
| composition | text | Состав продукта. |
| fats | double precision | Количество жиров. |
| images | text[] | Массив URL дополнительных изображений. |
| oldPrice | double precision | Старая цена (для акций и скидок). |
| proteins | double precision | Количество белков. |
| tags | text[] | Теги для фильтрации и поиска. |
| volume | double precision | Объем в миллилитрах. |
| weight | double precision | Вес в граммах. |
| isIngredient | boolean | `true`, если товар является ингредиентом, а не готовым продуктом. |

## Table: Category

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор категории. Primary Key. |
| name | text | Название категории (например, "Кофе", "Десерты"). |
| createdAt | timestamp | Дата и время создания категории. |
| icon | text | URL или путь к иконке категории. |
| updatedAt | timestamp | Дата и время последнего обновления категории. |

## Table: Stock

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор складской записи. Primary Key. |
| branchId | integer | Идентификатор филиала, к которому относится склад. Foreign Key к `Branch`. |
| productId | integer | Идентификатор продукта на складе. Foreign Key к `Product`. |
| quantity | integer | Текущее количество товара на складе. |
| createdAt | timestamp | Дата и время создания записи. |
| updatedAt | timestamp | Дата и время последнего обновления записи. |
| batchNumber | text | Номер партии товара. |
| expiryDate | timestamp | Срок годности партии. |
| lastRestockedAt | timestamp | Дата последнего пополнения товара. |
| location | text | Место хранения товара на складе. |
| maxQuantity | integer | Максимально допустимый остаток товара. |
| minQuantity | integer | Минимально допустимый остаток товара. |
| notes | text | Заметки по складской позиции. |

## Table: StockTransaction

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор транзакции. Primary Key. |
| stockId | integer | Идентификатор складской позиции, с которой связана транзакция. Foreign Key к `Stock`. |
| orderId | integer | Идентификатор заказа, связанного с этой транзакцией. Foreign Key к `Order`. |
| employeeId | integer | Идентификатор сотрудника, который провел операцию. Foreign Key к `Employee`. |
| type | TransactionType | Тип транзакции (INCOME, EXPENSE, WRITE_OFF). |
| quantity | integer | Количество товара в транзакции. |
| date | timestamp | Дата проведения транзакции. |
| createdAt | timestamp | Дата и время создания записи. |
| updatedAt | timestamp | Дата и время последнего обновления записи. |
| expiryDate | timestamp | Срок годности для данной партии. |
| notes | text | Примечания к транзакции. |
| price | double precision | Цена за единицу товара в транзакции. |
| reason | text | Причина транзакции (например, "Продажа", "Списание по сроку годности"). |
| totalPrice | double precision | Общая стоимость товаров в транзакции. |

## Table: Order

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор заказа. Primary Key. |
| branchId | integer | Идентификатор филиала, в котором был сделан заказ. Foreign Key к `Branch`. |
| customerId | integer | Идентификатор клиента, сделавшего заказ. Foreign Key к `Customer`. |
| status | OrderStatus | Текущий статус заказа (NEW, IN_PROGRESS, READY, COMPLETED, CANCELED). |
| total | double precision | Итоговая сумма заказа. |
| createdAt | timestamp | Дата и время создания заказа. |
| updatedAt | timestamp | Дата и время последнего обновления заказа. |
| type | TransactionType | Тип заказа (обычно EXPENSE - продажа). |

## Table: OrderItem

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор позиции в заказе. Primary Key. |
| orderId | integer | Идентификатор заказа, к которому относится позиция. Foreign Key к `Order`. |
| productId | integer | Идентификатор продукта в данной позиции. Foreign Key к `Product`. |
| quantity | integer | Количество единиц продукта. |
| price | double precision | Цена продукта за единицу на момент заказа. |
| createdAt | timestamp | Дата и время создания позиции. |
| updatedAt | timestamp | Дата и время последнего обновления позиции. |

## Table: Customer

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор клиента. Primary Key. |
| userId | integer | Идентификатор связанной записи в таблице `User`. Foreign Key. |
| bonus | integer | Текущий баланс бонусных баллов клиента. |
| createdAt | timestamp | Дата и время регистрации клиента. |
| updatedAt | timestamp | Дата и время последнего обновления данных клиента. |
| birthday | timestamp | Дата рождения клиента для начисления бонусов и поздравлений. |
| discountPercent | double precision | Персональная скидка клиента в процентах. |
| favoriteProduct | text | ID любимого продукта клиента. |
| lastOrderDate | timestamp | Дата последнего заказа клиента. |
| notes | text | Заметки и комментарии о клиенте. |
| tags | text[] | Теги для сегментации клиентов (например, "постоянный", "любит эспрессо"). |
| totalSpent | double precision | Общая сумма, потраченная клиентом за все время. |

## Table: BonusTransaction

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор бонусной транзакции. Primary Key. |
| customerId | integer | Идентификатор клиента, с чьим счетом связана транзакция. Foreign Key к `Customer`. |
| orderId | integer | Идентификатор заказа, за который были начислены/списаны бонусы. Foreign Key к `Order`. |
| type | text | Тип транзакции (EARNED, SPENT, EXPIRED, ADJUSTED - начисление, списание, сгорание, коррекция). |
| amount | integer | Количество бонусов в транзакции (может быть отрицательным). |
| description | text | Описание операции (например, "Бонусы за заказ #123"). |
| expiresAt | timestamp | Дата, когда начисленные бонусы сгорят. |
| createdAt | timestamp | Дата и время проведения транзакции. |
| updatedAt | timestamp | Дата и время последнего обновления транзакции. |

## Table: Booking

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор бронирования. Primary Key. |
| branchId | integer | Идентификатор филиала, где осуществляется бронирование. Foreign Key к `Branch`. |
| customerId | integer | Идентификатор клиента, который делает бронирование. Foreign Key к `Customer`. |
| employeeId | integer | Идентификатор сотрудника, который обслуживает бронирование. Foreign Key к `Employee`. |
| date | timestamp | Дата, на которую сделано бронирование. |
| timeFrom | timestamp | Время начала бронирования. |
| timeTo | timestamp | Время окончания бронирования. |
| status | BookingStatus | Статус бронирования (PENDING, CONFIRMED, COMPLETED, CANCELED, NO_SHOW). |
| createdAt | timestamp | Дата и время создания бронирования. |
| updatedAt | timestamp | Дата и время последнего обновления бронирования. |
| description | text | Подробное описание бронирования. |
| guestsCount | integer | Количество гостей. |
| isConfirmed | boolean | Флаг, подтверждено ли бронирование клиентом. |
| isPaid | boolean | Флаг, оплачено ли бронирование. |

## Table: Report

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор отчета. Primary Key. |
| type | text | Тип генерируемого отчета (например, "SALES_BY_DAY", "STOCK_REMAINS"). |
| period | text | Период, за который сгенерирован отчет (например, "2023-10", "LAST_WEEK"). |
| fileUrl | text | URL для скачивания файла отчета (например, в формате .xlsx или .pdf). |
| createdAt | timestamp | Дата и время генерации отчета. |
| updatedAt | timestamp | Дата и время последнего обновления записи. |

## Table: PaymentSettings

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор настройки платежной системы. Primary Key. |
| provider | text | Название провайдера (SBERBANK, YOOKASSA, TINKOFF). |
| apiKey | text | API ключ для интеграции с провайдером. |
| createdAt | timestamp | Дата и время создания записи. |
| icon | text | URL иконки платежной системы. |
| updatedAt | timestamp | Дата и время последнего обновления записи. |
| commission | double precision | Комиссия платежной системы в процентах. |
| isActive | boolean | `true`, если данный способ оплаты активен. |
| isTest | boolean | `true`, если используется тестовый режим. |
| maxAmount | double precision | Максимальная сумма для проведения платежа. |
| merchantId | text | ID мерчанта в системе провайдера. |
| minAmount | double precision | Минимальная сумма для проведения платежа. |
| name | text | Пользовательское название этой настройки. |
| secretKey | text | Секретный ключ для интеграции. |
| settings | text | Дополнительные настройки в формате JSON. |
| terminalId | text | ID терминала (если применимо). |
| webhookUrl | text | URL для получения уведомлений от платежной системы. |

## Table: Integration

| Поле | Тип | Для чего нужно |
|---|---|---|
| id | integer | Уникальный идентификатор интеграции. Primary Key. |
| name | text | Название интеграции (например, "Интеграция с 1С"). |
| apiKey | text | API ключ для интеграции. |
| createdAt | timestamp | Дата и время создания записи. |
| icon | text | URL иконки интегрированного сервиса. |
| updatedAt | timestamp | Дата и время последнего обновления записи. |
| apiSecret | text | Секретный ключ для интеграции. |
| apiUrl | text | URL API для обращений. |
| errorMessage | text | Сообщение об ошибке, если синхронизация не удалась. |
| isActive | boolean | `true`, если интеграция активна. |
| isTest | boolean | `true`, если используется тестовый режим. |
| lastSyncAt | timestamp | Дата и время последней синхронизации. |
| provider | text | Провайдер сервиса (AMOCRM, 1C). |
| settings | text | Дополнительные настройки в формате JSON. |
| type | text | Тип интеграции (CRM, ACCOUNTING, DELIVERY, SMS, EMAIL). |
| webhookUrl | text | URL для получения уведомлений от сервиса. |
