
# Тестовое задание «Комментарии»

Тестовое задание для Frontend-разработчика: SPA со списком комментариев на **Vue 2** + **Vuex**.

Пользователь может добавлять, удалять и просматривать комментарии, сортировать их по ID или дате, переключать направление сортировки и листать страницы.

## Стек технологий

- **Vue 2** — JavaScript-фреймворк
- **Vuex 3** — централизованное хранилище состояния
- **Axios** — HTTP-запросы к API
- **vue2-datepicker** — выбор даты
- **Laravel Mix (Webpack)** — сборка frontend
- **Laravel** — готовый backend и REST API для комментариев
- **Docker** — окружение для запуска проекта

## Функционал

- ✅ Загрузка списка комментариев через AJAX
- ✅ Добавление комментария без перезагрузки страницы
- ✅ Удаление комментария без перезагрузки страницы
- ✅ Пагинация — 3 комментария на страницу
- ✅ Выбор конкретной страницы
- ✅ Сортировка по ID и дате
- ✅ Сортировка по возрастанию и убыванию
- ✅ Валидация формы: имя, дата и текст комментария
- ✅ Выбор даты через datepicker
- ✅ Адаптивная вёрстка
- ✅ Хранение состояния в Vuex

## Запуск проекта

### Требования

- [Docker](https://www.docker.com/)
- Docker Compose
- Для Windows — WSL 2

Инструкция по установке WSL 2:  
https://learn.microsoft.com/ru-ru/windows/wsl/install

#### 1. Склонировать репозиторий

```bash
git clone <URL_РЕПОЗИТОРИЯ>
cd frontend-test
```

#### 2. Собрать и запустить контейнеры

```bash
docker-compose up -d
```

#### 3. Зайти внутрь контейнера `app`

```bash
docker-compose exec app bash
```

#### 4. Инициализировать проект

```bash
sed -i 's/\r$//' init.sh
bash ./init.sh
```

#### 5. Собрать frontend

```bash
yarn dev
```

#### 6. Открыть проект в браузере

http://localhost

## Если Docker выдаёт ошибку 403 Forbidden

Docker Hub может блокировать IP-адрес или возникать проблема с доступом к Docker Registry. В таком случае можно настроить зеркало Docker Hub.

### Файл конфигурации

**Linux:**

```text
/etc/docker/daemon.json
```

**Windows:**

```text
C:\ProgramData\docker\config\daemon.json
```

### Содержимое файла

```json
{
  "registry-mirrors": [
    "https://dockerhub.timeweb.cloud"
  ]
}
```

После изменения конфигурации перезапустите Docker.

**Linux:**

```bash
sudo systemctl restart docker
```

**Windows:**

Перезапустите Docker Desktop.

## Структура проекта

Frontend-код расположен в директории `resources/js/`:

```text
resources/js/
├── app.js                        # точка входа
├── bootstrap.js                  # инициализация (axios и т.п.)
├── store/
│   └── index.js                  # Vuex store
└── views/
    ├── app.vue                   # корневой компонент
    └── components/
        ├── CommentList.vue       # список, сортировка и пагинация
        ├── CommentItem.vue       # один комментарий
        └── CommentForm.vue       # форма добавления
```

## API

| Метод | Адрес | Описание |
| :--- | :--- | :--- |
| GET | `/api/comments` | Получить все комментарии |
| GET | `/api/comments/{id}` | Получить комментарий по ID |
| POST | `/api/comments` | Создать комментарий |
| PATCH | `/api/comments/{id}` | Обновить комментарий |
| DELETE | `/api/comments/{id}` | Удалить комментарий |