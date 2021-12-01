const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");
const authMiddleware = require("../middleware/auth_middleware");

router.get("/get_user_role", 
  authMiddleware,
  userController.getUserRole
);

router.get("/get_user_projects",
  authMiddleware,
  userController.getUserProjects
);

router.get("/get_user_records",
  authMiddleware,
  userController.getUserRecords
);

router.get("/get_users",
  authMiddleware,
  userController.getUsers
);

router.post("/get_user_salary",
  authMiddleware,
  userController.getUserSalary
);

module.exports = router;