const express = require("express");
const router = express.Router();
const functionalController = require("../controllers/functional_controller");
const authMiddleware = require("../middleware/auth_middleware");

router.post("/add_record", 
  authMiddleware,
  functionalController.addRecord
);

router.post("/delete_record",
  authMiddleware,
  functionalController.deleteRecord
);

router.post("/change_record",
  authMiddleware,
  functionalController.changeRecord
);

router.post("/get_record_data",
  authMiddleware,
  functionalController.getRecordData
);

router.get("/get_projects",
  authMiddleware,
  functionalController.getProjects
);

router.post("/register_project",
  authMiddleware,
  functionalController.registerProject
);

module.exports = router;