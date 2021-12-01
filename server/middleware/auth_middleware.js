const jwt = require("jsonwebtoken");
const { Tokens } = require("../db/models");

module.exports = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  if (!accessToken) {
    return res.status(200).json({ error: "Користувач не авторизований!", isAuthorized: false });
  }

  try {
    const tokenFromDb = await Tokens.findOne({ where: { refreshToken } });
    if (!tokenFromDb) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).json({ error: "Сесія закінчилась. Увійдіть знову!", isAuthorized: false });
    }

    let userMetadata = jwt.verify(accessToken, process.env.JWT_ACCESS);
    if (!userMetadata) {
      return res.status(200).json({ error: "Сесія закінчилась. Увійдіть знову! 2", isAuthorized: false });
    }

    const tokensFromDb = await Tokens.findOne({ where: { refreshToken } });
    if (!tokensFromDb) {
      return res.status(200).json({ error: "Сесія закінчилась. Увійдіть знову! 3", isAuthorized: false });
    }

    if (!userMetadata && tokensFromDb) {
      userMetadata = jwt.verify(tokenFromDb.refreshToken, process.env.JWT_REFRESH);
      if (userMetadata) {
        const { newRefreshToken, newAccessToken } = generateTokens({ id: userMetadata.id, email: userMetadata.email, fullName: userMetadata.fullName });
        tokenFromDb.refreshToken = newRefreshToken;
        await tokenFromDb.save();

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000,
          sameSite: "strict"
        });
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict"
        });
      } else {
        return res.status(200).json({ error: "Сесія закінчилась. Увійдіть знову! 4", isAuthorized: false });
      }
    }

    req.user = userMetadata;
    next();
  } catch (e) {
    console.log(e);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ error: "Сесія закінчилась. Увійдіть знову!", isAuthorized: false });
  }
};