const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/auth_controller");
const authMiddleware = require("../middleware/auth_middleware");

router.post("/login", 
  check("email", "Невірний формат поштової скриньки.").isEmail(),
  check("password", "Мінімальна довжина пароля має бути 8 символів і має містити: мінімум 1 велику літеру, мінімум 1 маленьку літеру і мінімум 1 цифру.").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1, 
    minNumbers: 1,
    minSymbols: 0
  }),
  authController.login
);

router.post("/register",
  check("email", "Невірний формат поштової скриньки.").isEmail(),
  check("password", "Мінімальна довжина пароля має бути 8 символів і має містити: мінімум 1 велику літеру, мінімум 1 маленьку літеру і мінімум 1 цифру.").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1, 
    minNumbers: 1,
    minSymbols: 0
  }),
  authMiddleware,
  authController.register
);

router.get("/isAuthorized",
  authMiddleware,
  authController.isAuthorized
);

router.get("/logout",
  authController.logout
);

module.exports = router;
