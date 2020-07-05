import Group from "../Models/Group";

async function createGroup(groupInfo: GroupCreate) {
  const { name, avatar, timeCreated, creator, participants } = groupInfo
  let status_message: string, success_status: boolean, gid: string;

  try {
    const group = new Group({
      name: name,
      // avatar:avatar,
      creator: creator,
      time_created: timeCreated,
      admins: [creator],
      participants: participants,
    });

    const new_group = await group.save()
    gid = new_group._id

    status_message = "Group successfully created"
    success_status = true

  } catch (err) {
    status_message = err.message
    success_status = false
  }

  return {
    group_id: gid,
    message: status_message,
    success: success_status,
  }
}

async function addUser(group_id: string, user: User) {
  let status_message: string, success_status: boolean;

  try {
    const saved_group = await Group.findOne({ _id: group_id });

    if (saved_group) {
      Group.updateOne()
      status_message = "Added new user successfully"
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

module.exports = { createGroup, addUser }