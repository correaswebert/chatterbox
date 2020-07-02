import React from "react";

const ContactList = () => {
  return (
    <>
      <List className={classes.root}>
        <ListItem alignItems="flex-start">
          <Link to="/new-chat">
            <ListItemAvatar>
              <PersonAddIcon />
            </ListItemAvatar>
            {"New Chat"}
          </Link>
        </ListItem>
        <Divider />

        <ListItem alignItems="flex-start">
          <Link to="/new-group">
            <ListItemAvatar>
              <GroupAddIcon />
            </ListItemAvatar>
            {"New Group"}
          </Link>
        </ListItem>
        <Divider />

        {chats.map((chat, index) => {
          const { name, image, extract } = chat;
          return (
            <div key={index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={name} src={image || logo} />
                </ListItemAvatar>
                <ListItemText primary={name} secondary={extract || ""} />
              </ListItem>
              <Divider variant="inset" component="li" />
            </div>
          );
        })}
      </List>
    </>
  );
};

export default ContactList;
