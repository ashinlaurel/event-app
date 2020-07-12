const bcrypt = require("bcryptjs");
const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");
const booking = require("../../models/booking");
// const booking = require("../../models/booking");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return {
          ...event._doc,
          _id: event._doc._id.toString(),
          date: new Date(event._doc.date).toISOString(),
          creator: {
            ...event._doc.creator._doc,
            _id: event._doc.creator.id,
          },
        };
      });
    } catch (error) {
      throw error;
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      // console.log(bookings);
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          _id: booking.id,
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (error) {
      throw error;
    }
  },
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5f08b97b96cd557cedf2d906",
    });
    let newevent;
    try {
      const result = await event.save();
      newevent = {
        ...result._doc,
        _id: event._doc._id.toString(),
        date: new Date(event._doc.date).toISOString(),
      };
      const user = await User.findById("5f08b97b96cd557cedf2d906");
      if (!user) {
        throw new Error("No user founds!");
      }
      user.createdEvents.push(event);
      await user.save();
      console.log(newevent);
      return newevent;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  createUser: async (args) => {
    try {
      const curruser = await User.findOne({ email: args.userInput.email });
      if (curruser) {
        throw new Error("User exists already");
      }
      const hashedPass = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPass,
      });
      const result = await user.save();
      return { ...result._doc, _id: result.id, password: null };
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async (args) => {
    try {
      const booking = new Booking({
        // event: "5f09af2d1cc0fa36b692b3e3",
        event: args.bookInput,
        user: "5f08b97b96cd557cedf2d906",
      });
      const result = await booking.save();
      return {
        ...result._doc,
        _id: result.id,
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
      };
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async (args) => {
    try {
      const delbooking = await Booking.findById(args.bookingId).populate(
        "event"
      );
      const event = { ...delbooking._doc.event, _id: delbooking.event.id };
      await Booking.deleteOne({ _id: args.bookingId });
      console.log(event);
      return event._doc;
    } catch (error) {
      throw error;
    }
  },
};
