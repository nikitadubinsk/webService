const express = require('express');
const PORT = 3000;
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())

const CONFIG = {
  DB: "std_704",
  USERNAME: "std_704",
  PASSWORD: "12345678",
  DIALECT: "mysql",
  HOST: "std-mysql.ist.mospolytech.ru"
}

const Sequelize = require("sequelize");
const sequelize = new Sequelize(CONFIG.DB, CONFIG.USERNAME, CONFIG.PASSWORD, {
  dialect: CONFIG.DIALECT,
  host: CONFIG.HOST,
});

const Users = sequelize.define("Users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  login: {
    type: Sequelize.STRING,
    allowNull: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

const Contacts = sequelize.define("Contacts", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  telephone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

app.post("/api/user", async (req, res) => {
  try {
    let result = await Users.count({
      where: { login: req.body.login }
    });
    if (result === 0) {
      try {
        result = await Users.create({
          login: req.body.login,
          password: req.body.password
        });
        res.send(result)
      } catch (e) {
        console.error(e);
        res.status(500).send({
          message: "Ошибка при создании нового пользователя"
        })
      }
    } else {
      res.status(500).send({
        message: "Данный пользователь уже существует"
      })
    }
  } catch (e) {
    res.status(500).send({
      message: "Произошла ошибка во время регистрации нового пользователя"
    })
  }
})

app.post("/api/contact", async (req, res) => {
  try {
    let result = await Contacts.create({
      name: req.body.name,
      telephone: req.body.telephone,
      email: req.body.email,
      user_id: req.body.user_id,
    });
    res.send(result)
  }
  catch (e) {
    console.error(e);
    res.status(500).send({
      message: "Ошибка при создании нового контакта"
    })
  }
})

app.post("/api/auth", async (req, res) => {
  try {
    let result = await Users.findAll({
      where: { login: req.body.login, password: req.body.password }
    });
    if (result === []) {
      result = await Users.count({
        where: { login: req.body.login }
      });
      if (result === 0) {
        res.status(500).send({
          message: "Данный пользователь не найден"
        });
      } else {
        res.status(500).send({
          message: "Неверный пароль"
        });
      }
    } else {
      res.send(result);
    }
  }
  catch (e) {
    console.error(e);
    res.status(500).send({
      message: "Ошибка во время авторизации"
    })
  }
})

app.get("/api/contacts/:id", async (req, res) => {
  try {
    let result = await Contacts.findAll({
      where: { user_id: req.params.id }
    });
    res.send(result)
  }
  catch (e) {
    console.error(e);
    res.status(500).send({
      message: "Ошибка пполучении всех контактов пользователя"
    })
  }
})

app.get("/api/users", async (req, res) => {
  try {
    let result = await Users.findAll();
    res.send(result)
  }
  catch (e) {
    console.error(e);
    res.status(500).send({
      message: "Ошибка получении всех пользователей"
    })
  }
})

app.put("/api/edit/contact", async (req, res) => {
  try {
    let result = await Contacts.update({
      name: req.body.name,
      telephone: req.body.telephone,
      email: req.body.email
    }, {
      where: {
        id: req.body.id,
      }
    });
    res.send(result)
  }
  catch (e) {
    console.error(e);
    res.status(500).send({
      message: "Ошибка при редактировании пользователя"
    })
  }
})

app.delete("/api/delete/contact/:id", async (req, res) => {
  try {
    let result = await Contacts.destroy({
      where: {
        id: req.params.id,
      }
    });
    res.send(result.status)
  }
  catch (e) {
    console.error(e);
    res.status(500).send({
      message: "Ошибка при удалении пользователя"
    })
  }
})

sequelize
  //.sync({ force: true })
  .sync()
  .then(result=>{
    console.log("Вы успешно подключились к БД");
  })
  .catch(err=> console.log(err));

app.listen(PORT, () => {
  console.log(`Сервер запущен по адресу http://localhost:${PORT}`)
})