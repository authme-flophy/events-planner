const Event = require("../models/event");

const events_index = async (req, res) => {
  try {
    const events = await Event.find({});

    res.status(200).json({
      events,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error 😥" });
  }
};

const events_details = async (req, res) => {
  const id = req.params.id;

  try {
    const event = await Event.findById(id).populate("creator");
    res.status(200).json({ event });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const event_create = async (req, res) => {
  const { title, description, date, location } = req.body;

  try {
    const event = await Event.create({
      title,
      description,
      date,
      location,
      creator: req.userId,
    });

    res.status(201).json({ event });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "did not create event" });
  }
};

const event_update = async (req, res) => {
  const id = req.userId;
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId).populate("creator");

    if (!(id === event.creator._id.toString())) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, {
      new: true,
    }).populate("creator");

    res.status(201).json({ updatedEvent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "did not update event" });
  }
};

const event_delete = async (req, res) => {
  const id = req.userId;
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId).populate("creator");

    if (!(id === event.creator._id.toString())) {
      return res.status(401).json({ error: "unauthorized" });
    }

    await Event.findByIdAndDelete(eventId);

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "did not delete event" });
  }
};

module.exports = {
  events_index,
  event_create,
  events_details,
  event_update,
  event_delete,
};
