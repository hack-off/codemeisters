//const SHA256 = require(['crypto-js/sha256'], function(){});
function calculateH(pass){
  var shaObj = new jsSHA("SHA-512", "TEXT");
  shaObj.update(pass);
  return shaObj.getHash("HEX");
}
App = {
  web3Provider: null,
  contracts: {},
  account: 'hi',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Social.json", function(social) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Social = TruffleContract(social);
      // Connect provider to interact with contract
      App.contracts.Social.setProvider(App.web3Provider);
      return App.render();
    });
  },

  render: function() {
    // Load eth account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
      else{
        window.alert(err);
      }
    });
  },

sendMessage: function(){
    var to_user = $("#to_user").val();
    var from_user = sessionStorage.getItem("uname");
    var txt = $("#msg_txt").val();
    App.contracts.Social.deployed().then(function(instance){
        return instance.sendmsg(from_user, to_user, txt); //make msg transaction
    }).then(function(){
        window.alert("Sent");
    }).catch(function(err){
        window.alert(err);
    });
},

newUser: function(file){
    //get user profile
    var uname = file.username;
    var hash = $("#loginPassword").val();
    var name = file.name;
    console.log(hash);
    console.log(name);
    var phone = file.phone_number;
    var gender = file.gender;
    var email = file.email;
    var url = file.profile_pic_url;
    App.contracts.Social.deployed().then(function(instance){
    hash=calculateH(hash)
        return instance.addUser(uname,hash,name,phone,gender,email,url, { from: App.account }); //make user update
    }).then(function(){
        window.alert("New user created");
    }).catch(function(err){
        window.alert(err);
    });
},

loginUser: function(){
    //get login data
    var uname = $("#user").val();
    var pass = $("#loginPassword").val();
      var hash = calculateH(hash);

    App.contracts.Social.deployed().then(function(instance){
        var flag = 0;
        for(var i = 0; i<=instance.usercount; i++)
            {
                if(uname === instance.users[i].uname && hash === instance.users[i].hash)
                    {
                        flag = 1;
                        window.alert("login successful");
                        window.location.replace("index.html");
                        sessionStorage.setItem("uname", uname);
                    }
            }
        if(flag == 0)
            {
                window.alert("User not found. Username or password is incorrect");
            }
    }).catch(function(err){
        console.log(err);
    });
},

logout: function(){
    sessionStorage.removeItem('uname');
    window.location.replace('login.html');

},

readMessage: function(){
    var uname = sessionStorage.getItem("uname");
    App.contracts.Social.deployed().then(function(instance){
        for(var i = 0; i<=instance.msgcount; i++)
            {
                if(instance.messages[i].to_user === uname)
                {
                    displayMessage("inbox", instance.messages[i].from_user, instance.messages[i].text_body);
                }
            }
    }).catch(function(err){
        console.log(err);
    });
},

readsentMessage: function(){
    var uname = sessionStorage.getItem("uname");
    App.contracts.Social.deployed().then(function(instance){
        for(var i = 0; i<=instance.msgcount; i++)
            {
                if(instance.messages[i].from_user === uname)
                {
                    displayMessage("sentbox", instance.messages[i].to_user, instance.messages[i].text_body);
                }
            }
    }).catch(function(err){
        console.log(err);
    });
},

displayMessage: function(id, user, txt){
        var node = document.createElement("DIV");
        var attr = document.createAttribute("class");
        attr.value = "card my-3 p-3 bg-white rounded shadow-sm";
        node.setAttributeNode(attr);
        var hnode = document.createElement("H3");
        var hattr = document.createAttribute("class");
        hattr.value = "card-header";
        hnode.setAttributeNode(hattr);
        var htext = document.createTextNode("From:" + user);
        hnode.appendChild(htext);
        node.appendChild(hnode);
        var textnode = document.createTextNode(txt);
        node.appendChild(textnode);
        document.getElementById(id).appendChild(node);
},

calculateHash: function(pass){
  return pass;
},

updateUser: function(){
    //get user details from form
    var cuname = sessionStorage.getItem("uname");
    var uname = $("#uname").val();
    var name = $("#name").val();
    var phone = $("#phone").val();
    var gender = $("#gender input:radio").val();
    console.log(gender);
    var email = $("email").val();
    App.contracts.Social.deployed().then(function(instance){
        for(var i = 0; i<=instance.usercount; i++)
            {
                if(instance.users[i].uname == cuname)
                    {
                        sessionStorage.setItem("uname", uname);
                        return instance.update(i,uname,name,phone,gender,email); //update user
                    }
            }
    }).catch(function(err){
        console.log(err);
    })

},

readUser: function(){
    var uname = sessionStorage.getItem("uname");
    App.contracts.Social.deployed().then(function(instance){
        for(var i = 0; i<=instance.usercount; i++)
            {
                if(instance.users[i].uname == uname)
                    {
                        document.getElementById("user") = "User Name: " + uname;
                        document.getElementById("name") = "Name: " + instance.users[i].name;
                        document.getElementById("phone") = "Phone: " + instance.users[i].phone;
                        document.getElementById("gender") = "Gender: " + instance.users[i].gender;
                        document.getElementById("email") = "Email: " + instance.users[i].email;
                        var attr = document.createAttribute("src");
                        attr.value = instance.users[i].profileurl;
                        document.getElementById("img").setAttribute(attr);
                    }
            }
    }).catch(function(err){
        console.log(err);
    });
}

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
