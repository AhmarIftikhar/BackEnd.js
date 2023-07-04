const express = require("express");
const auth = require("../controllers/auth");

const router = express.Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);
router.get("/tabledata", auth.getTableData);
router.get("/tabledata/:id", auth.getTableDataById);
router.post("/createtabledata", auth.createTableData);
router.put("/edittabledata/:id", auth.editTableData);
router.delete("/deletetable/:id", auth.deleteTableData);
module.exports = router;
