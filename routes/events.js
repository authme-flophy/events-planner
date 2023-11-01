const express = require("express");
const isAuth = require("../middleware/is-auth");
const eventsController = require("../controllers/eventControllers");

const router = express.Router();

router.get("/", eventsController.events_index);
router.get("/:id", isAuth, eventsController.events_details);
router.post("/", isAuth, eventsController.event_create);
router.put("/:id", isAuth, eventsController.event_update);
router.delete("/:id", isAuth, eventsController.event_delete);

module.exports = router;
