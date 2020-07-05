const User = require("../Models/User");

async function createNewUser(userInfo: User) {

  // FIX: add avatar once implemented
  const { name, phone } = userInfo;


  let status_message: string, success_status: boolean;

  try {
    const saved_person = await User.findOne({ phone: phone });

    if (saved_person) throw new Error("Phone number already registered")

    else {
      const user = new User({
        name: name,
        phone: phone,
        // avatar: avatar,
      });

      const new_user = await user.save()

      status_message = "Phone number successfully registered"
      success_status = true

    }
  } catch (err) {
    status_message = err.message
    success_status = false
  }

  return {
    message: status_message,
    success: success_status,
  }

}

async function doesUserExist(userInfo: User) {

  let status_message: string, success_status: boolean;

  try {
    const saved_person = await User.findOne({ phone: userInfo.phone });

    if (saved_person) {
      status_message = "Logged in successfully"
      success_status = true
    }

    else throw new Error("Phone number already registered")

  } catch (err) {
    status_message = err.message
    success_status = false
  }

  return {
    message: status_message,
    success: success_status,
  }

}

module.exports = { createNewUser, doesUserExist }