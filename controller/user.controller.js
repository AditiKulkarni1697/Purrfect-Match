const { UserModel } = require("../databases/models/user.model");
const bcrypt = require("bcryptjs");
const { BlacklistModel } = require("../databases/models/blacklist.model");
const {
  ConnectionRequestModel,
} = require("../databases/models/connectionRequest.model");
require("dotenv").config();

const register = async (req, res) => {
  const {
    name,
    email,
    password,
    photoUrl,
    species,
    interestedIn,
    lookingFor,
    interests,
  } = req.body;

  const userExists = await UserModel.findOne({ email });

  if (userExists) {
    return res.status(400).send("User already exists");
  }

  const hashed = await bcrypt.hash(password, 8);
  try {
    const user = new UserModel({
      name,
      email,
      password: hashed,
      photoUrl,
      species,
      interestedIn,
      lookingFor,
      interests,
    });

    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ message:"User not found"});
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).send({ message:"Invalid password"});
    }

    //console.log("userModel", UserModel)
    const token = await user.getJWT();

    res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
    res.status(200).send({ message: "Logged in successfully" });
  } catch (err) {
    console.log("error", err);
    res.status(500).send({ error: "Internal server error" });
  }
};

const logout = async (req, res) => {
  const { token } = req;

  try {
    const blacklisted = new BlacklistModel({ token });
    await blacklisted.save();
    res.status(200).send({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).send({ error: "Internal server error" });
  }
};

const getConnections = async (req, res) => {
  const userId = req.user._id;
  try {
    const allConnections = await ConnectionRequestModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: "accepted",
    })
      .populate({
        path: "senderId",
        select: "name photoUrl species lookingFor interests",
      })
      .populate({
        path: "receiverId",
        select: "name photoUrl species lookingFor interests",
      });

    const connections = allConnections.map((connection) =>
      connection.senderId._id.toString() === userId.toString()
        ? connection.receiverId
        : connection.senderId
    );

    res.status(200).send({ data: connections });
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const requestReceived = async (req, res) => {
  const userId = req.user._id;
  try {
    const requests = await ConnectionRequestModel.find({
      receiverId: userId,
      status: "interested",
    })
      .select("senderId")
      .populate("senderId", [
        "name",
        "photoUrl",
        "species",
        "lookingFor",
        "interests",
      ]);
    res.status(200).send({ data: requests });
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getFeed = async (req, res) => {
  const user = req.user;
  const page = req.query.page === undefined ? 1 : parseInt(req.query.page);
  const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  try {
    const alreadyShown = await ConnectionRequestModel.find({
      $or: [{ senderId: user._id }, { receiverId: user._id }],
    });

    const alreadyShownIds = alreadyShown.map((connection) => {
      return connection.senderId.toString() === user._id.toString()
        ? connection.receiverId.toString()
        : connection.senderId.toString();
    });

    const feed = await UserModel.find({
      $or: [
        { interestedIn: { $in: [user.species] } },
        { lookingFor: user.lookingFor },
      ],
      _id: { $ne: user._id, $nin: Array.from(alreadyShownIds)},
    })
      .select("name photoUrl species lookingFor interests")
      .skip(skip)
      .limit(limit);

    res.status(200).send({ data: feed });
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getConnections,
  requestReceived,
  getFeed,
};
