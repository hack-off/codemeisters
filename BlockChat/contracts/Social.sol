pragma solidity ^0.5.8;

contract Social {
    //Model a user
    struct User{
        uint uid;
        string uname;
        string pass_hash;
        string name;
        string phone_number;
        string gender;
        string email;
        string profileurl;
    }

    //model a message
    struct Message{
        uint mid;
        string from_user;
        string to_user;
        string text_body;
    }

    //access all messages
    mapping(uint => Message) public messages;

    //to read/write users
    mapping(uint => User) public users;

    //store user, message count
    uint public usercount;
    uint public msgcount;

     //add user
    function addUser (string memory uname, string memory hash, string memory name, string memory phone, string memory gender, string memory email_id, string memory url) public {
        usercount++;
        users[usercount] = User(usercount, uname, hash, name, phone, gender, email_id, url);
    }

    //send message
    function sendmsg (string memory fromUser, string memory toUser, string memory txt) private {
        msgcount++;
        messages[msgcount] = Message(msgcount, fromUser, toUser, txt);
    }

    //update user
    function update (uint index, string memory uname, string memory name, string memory phone, string memory gender, string memory email_id) private {
        users[index].uname = uname;
        users[index].name = name;
        users[index].phone_number = phone;
        users[index].gender = gender;
        users[index].email = email_id;
    }
}
