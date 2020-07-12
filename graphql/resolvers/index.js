const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");

module.exports = {
  events: () => {
    return Event.find()
      .then((events) => {
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
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  createEvent: (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5f08b97b96cd557cedf2d906",
    });
    let newevent;
    return event
      .save()
      .then((result) => {
        newevent = {
          ...result._doc,
          _id: event._doc._id.toString(),
          date: new Date(event._doc.date).toISOString(),
        };
        return User.findById("5f08b97b96cd557cedf2d906");
      })
      .then((user) => {
        if (!user) {
          throw new Error("No user founds!");
        }
        user.createdEvents.push(event);
        return user.save();
      })
      .then((result) => {
        console.log(newevent);
        return newevent;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  createUser: (args) => {
    return User.findOne({ email: args.userInput.email })
      .then((user) => {
        if (user) {
          throw new Error("User exists already");
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then((hashedPass) => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPass,
        });
        return user.save();
      })
      .then((result) => {
        return { ...result._doc, _di: result.id, password: null };
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
};
