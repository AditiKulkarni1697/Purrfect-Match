const { BlacklistModel } = require("../databases/models/blacklist.model");
const { UserModel } = require("../databases/models/user.model");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../utils/nodeMailer");

const getAllProfiles = async (req, res) => {
  try {
    const user = await UserModel.find();
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ error: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  const userId = req.params.id;
  try {
    const profile = await UserModel.findById(userId);
    res.status(200).send({ profile });
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const updateProfile = async (req, res) => {
  const payload = req.body;
  const user = req.user;

  try {
    Object.keys(payload).forEach((field) => {
      user[field] = payload[field];
    });

    user.save();

    res.status(200).send({ msg: "Profile is updated" });
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).send({ msg: "Wrong Credentials" });
    }

    const token = await user.getJWT();

    const url = `http://localhost:${process.env.PORT}/profile/updatepassword?token=${token}`;

    await sendMail(email, url);

    res
      .status(200)
      .send({
        msg: "A email has been sent to your registered emailId to update your password",
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const updatePassword = async (req, res) => {
  const { email, password } = req.body;
  const token = req.query.token;
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).send({ msg: "Wrong Credentials" });
    }

    const hash = await bcrypt.hash(password, 8);

    await UserModel.findByIdAndUpdate(user._id, { password: hash });

    const blacklisted = new BlacklistModel({ token });
    await blacklisted.save();

    res.status(200).send({ msg: "Password updated successfully" });
  } catch (err) {
    console.log("err in updatepassword", err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

module.exports = {
  getAllProfiles,
  getProfile,
  updateProfile,
  forgotPassword,
  updatePassword,
};
