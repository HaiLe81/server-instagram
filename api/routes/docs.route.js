const router = require("express").Router();
const swaggerUI = require("swagger-ui-express");
const doc = require("../docs/swagger.json");

router.use(swaggerUI.serve);
router.get("/", swaggerUI.setup(doc));

module.exports = router;
