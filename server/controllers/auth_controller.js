const jwt = require("jsonwebtoken");
const md5 = require("md5");
const { Tokens, Users, Roles } = require("../db/models");
const { validationResult } = require("express-validator");

const saveRefreshToken = async (userId, refreshToken) => {
  const tokenFromDb = await Tokens.findOne({ where: { userId } });

  if (tokenFromDb) {
    tokenFromDb.refreshToken = refreshToken;
    return await tokenFromDb.save();
  }

  return await Tokens.create({
    userId, refreshToken
  });
};

const generateTokens = user => {
  const accessToken = jwt.sign(user, process.env.JWT_ACCESS, { expiresIn: "1h" });
  const refreshToken = jwt.sign(user, process.env.JWT_REFRESH, { expiresIn: "30d" });

  return {
    accessToken,
    refreshToken
  }
};

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ error: errors.array().map(e => e.msg) });
    }

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({ error: "Такого користувача не існує!" });
    }

    const isPasswordTrue = md5(password + "960ab9a87") === user.password;
    if (!isPasswordTrue) {
      return res.status(200).json({ error: "Невірний пароль!" });
    }

    const { accessToken, refreshToken } = generateTokens({ id: user.id, email: user.email, fullName: user.fullName });
    await saveRefreshToken(user.id, refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "strict"
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict"
    });

    return res.status(200).json({ id: user.id, role: (await Roles.findOne({ where: { id: user.roleId } })).roleName, accessToken, refreshToken, message: "Авторизація пройшла успішно." });
  }

  async register(req, res) {
    const { email, password, fullName, roleId, projectId, isAccountant } = req.body;
    const currentUser = await Users.findOne({ where: { id: req.user.id } });
    if (!currentUser) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).json({ error: "Невірна сесія. Авторизуйтесь знову." });
    }

    const currentUserRole = await Roles.findOne({ where: { id: currentUser.roleId } });
    if ((currentUserRole.roleName !== "admin") && (currentUserRole.roleName !== "accountant")) {
      return res.status(200).json({ error: "Недостатньо прав." });
    } 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ error: errors.array().map(e => e.msg) });
    }

    const candidate = await Users.findOne({ where: { email } });
    if (candidate) {
      return res.status(200).json({ error: "Такий користувач вже існує." });
    }

    const _roleId = currentUserRole.roleName === "admin" ? roleId : (await Roles.findOne({ where: { roleName: "user" } })).id;
    const accountantRole = await Roles.findOne({
      where: {
        roleName: "accountant"
      }
    });

    const user = await Users.create({
      email, password: md5(password + "960ab9a87"), fullName, roleId: !isAccountant ? _roleId : accountantRole.id, projectId
    });

    if (!user) {
      return res.status(200).json({ error: "Сталась помилка. Спробуйте знову." });
    }

    return res.status(200).json({ message: "Користувач зареєстрований." });
  }

  async isAuthorized(req, res) {
    return res.status(200).json({ isAuthorized: true });
  }

  async logout(req, res) {
    const { refreshToken } = req.cookies;

    await Tokens.destroy({
      where: {
        refreshToken
      }
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "Ви вийшли з вашого облікового запису." });
  }
}

module.exports = new AuthController;