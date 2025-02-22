const express = require('express');
const {Pool} = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Подключение к базе данных
const pool = new Pool({
    user: process.env.DB_USER, // Ваш пользователь PostgreSQL
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD, // Ваш пароль PostgreSQL
    port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
    } else {
        console.log('Подключение к базе данных успешно!');
    }
});

// Маршрут для регистрации
app.post('/signup', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Проверка на пустые поля
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Все поля обязательны!' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Пароли не совпадают!' });
    }

    // Хеширование пароля (в реальном проекте используйте bcrypt)
    const hashedPassword = password;

    // Вставка данных в базу
    try {
        const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(query, [username, email, hashedPassword]);
        res.status(201).json({ message: 'Пользователь зарегистрирован!', user: result.rows[0] });
    } catch (err) {
        console.error('Ошибка при регистрации:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для авторизации
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Поиск пользователя в базе
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const user = result.rows[0];

        // Проверка пароля (в реальном проекте используйте bcrypt.compare)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Неверный пароль' });
        }

        res.status(200).json({ message: 'Авторизация успешна!', user });
    } catch (err) {
        console.error('Ошибка при авторизации:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Запуск сервера
app.listen(port, '0.0.0.0', () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});