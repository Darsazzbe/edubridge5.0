const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Подключение к MongoDB Atlas
// Замените <username> и <password> на ваши учетные данные из MongoDB Atlas
// Имя базы данных: First_project
const mongoURI = "mongodb+srv://sazonovad79_db_user:x7z08nnP9c69WypZ@edubridge.8rq6zbr.mongodb.net/";

// Добавьте IP 5.34.112.245/32 в Network Access в настройках MongoDB Atlas
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Atlas подключена ✅"))
.catch(err => console.error("Ошибка подключения к MongoDB Atlas:", err));

// Схема пользователя (поля остаются неизменными)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
  question: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Точка приёма заявок с формы
app.post("/api/contact", async (req, res) => {
  const { name, email, course, question } = req.body;

  if (!name || !email || !course || !question) {
    return res.status(400).json({ success: false, message: "Заполните все поля" });
  }

  try {
    const newUser = new User({ name, email, course, question });
    await newUser.save();

    console.log("Новая заявка сохранена в MongoDB:");
    console.log("Имя:", name);
    console.log("Email:", email);
    console.log("Курс:", course);
    console.log("Вопрос:", question);

    res.json({ success: true, message: "Заявка успешно получена и сохранена!" });
  } catch (err) {
    console.error("Ошибка при сохранении заявки:", err);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

// Тестовый маршрут
app.get("/", (req, res) => {
  res.send("Сервер работает! 🚀");
});

// Запуск
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});