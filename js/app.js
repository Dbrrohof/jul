// Script updated to firebase. Contains the same functionality

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBAnks7FMf2TNQE8m7z_oh9Vs-mbs16Okw",
  authDomain: "julelodtraekning.firebaseapp.com",
  databaseURL: "https://julelodtraekning.firebaseio.com",
  projectId: "julelodtraekning",
  storageBucket: "julelodtraekning.appspot.com",
  messagingSenderId: "490164122312"
};
firebase.initializeApp(config);

// DECALRATIONS
var usersArray = [];
var wishlistsArray = [];
var bucketArray = [];
var database = firebase.database();
var storage = firebase.storage();
var usersLeft = [];

var users = firebase.database().ref('users');
var bucket = firebase.database().ref('hat').orderByValue().equalTo(0);
var wishlists = firebase.database().ref('wishlists');

// Get people who has no nisse assigned
users.on('value', function(snapshot) {
  Object.entries(snapshot.val()).forEach(
    ([key, value]) => {if (!value.nisse) usersLeft[key] = value}
  );
});

// all users
users.on('value', function(snapshot) {
  let obj = snapshot.val();
});

// get wishlists
wishlists.on('value', function(snapshot) {
  wishlistsArray = snapshot.val();
  getWishlists();
});





//Check if logged in
var currentUser = sessionStorage.getItem("name");
if (currentUser) {
  // Hello user!
  document.getElementById('hello').innerHTML = "Hej <span class='name'>" + currentUser + "</span>!";

  // Call to see if nisse is assigned to currentUser
  getNisse();
} else {
  // show the signup or login page
  window.location = "signup"
}

function getNisse() {
  firebase.database().ref('/users/' + currentUser + '/nisse').once('value').then(function(snapshot) {
		if (snapshot.val() == "none" || snapshot.val() == 0 || snapshot.val() == null) {
      document.getElementById('answer').innerHTML = "???"
		} else {
      document.getElementById('answer').innerHTML = "Du er nisse for <span class='name'>" + snapshot.val() + "</span>";
      document.getElementById('nisseknap').style.display = 'none';
      document.getElementById('nisseknap').value = "Du er en nisse!";
		}
  });
}

// function logInUser() {

//   var user = new Parse.User.logIn(document.getElementById('myName').value, document.getElementById('myPass').value, {
//       success: function(user) {
//         // Do stuff after successful login.
//         console.log("succes!")
//         window.location = "index.html"
//       },
//       error: function(user, error) {
//         // The login failed. Check error to see why.
//         document.getElementById('error').innerHTML = "Brugernavnet eller kodeordet er forkert.";
//         console.log("nope!")
//       }
//   });
// }

// log out
function logOut() {
  sessionStorage.clear();
  currentUser = null;
  window.location = "signup"
}

//Find nisse
function getAnswer() {
  document.getElementById('nisseknap').style.display = 'none';
  bucket.once('value', function(snapshot) {
    bucketArray = Object.keys(snapshot.val());
    getAnswerReady();
  });
}
function getAnswerReady() {
  console.log(bucketArray);

  // loop over bucket to find a random nisse.
  let keys = Object.keys(bucketArray);
  let chosenNisse =  bucketArray[keys[ keys.length * Math.random() << 0]];
  console.log(chosenNisse)
  // Check if nisse result is you
  // console.log(chosenNisse, currentUser)
  if (chosenNisse === currentUser && keys.length > 1) {
    getAnswerReady();
    return;
  } else if (chosenNisse === currentUser && keys.length == 1) {
    document.getElementById('answer').innerHTML = "Øv... Der er ikke flere navne i posen";
  }
  if (keys.length == 2) {
    // check if the two names in the hat exist in the usersLeft array, if so, asign the "double-person" to currentUser
    for (let i = 0; i < bucketArray.length; i++) {
      if (usersLeft[bucketArray[i]]) {
        // Make sure that the one picking a nisse, isn't the "double-person"
        if (bucketArray[i] != currentUser) {
          chosenNisse = bucketArray[i];
        }
      }
    }
  }

  // // Assign nisse to you
  firebase.database().ref('users/' + currentUser).update({ nisse: chosenNisse });
  document.getElementById('answer').innerHTML = "Du er nisse for <span class='name'>" + chosenNisse + "</span>";

  // Remove nisse from bucket
  firebase.database().ref('hat/').update({ [chosenNisse]: 1});
  

  // // Get data from parse
  // var Navne = Parse.Object.extend("Navne");
  // var query = new Parse.Query(Navne);
  // var object = [];

  // query.find({
  //   success: function(results) {
  //     console.log("Successfully retrieved " + results.length + " navne.");
        
  //       // Create array
  //       for (var i = 0; i < results.length; i++) { 
  //           object[i] = results[i].get("Navn");            
  //         }
      
  //       console.log(object.indexOf(currentUser.get("username")));
  //       //object.splice( object.indexOf(currentUser.get("username")), 1);
  //       console.log(object);      

  //       // Find random name in array
  //       var name = Math.floor(Math.random()*object.length);

  //       // If array empty
  //       if (object.length == 0) {
  //         document.getElementById('answer').innerHTML = "Øv... Der er ikke flere navne i posen";
  //       }

  //       // If last name is the same - give feedback
  //       else if (object.length == 1 && object[name] === currentUser.get("username")) {
  //         document.getElementById('answer').innerHTML = "Øv! Der er ikke flere navne tilbage";
  //       }

  //       // If name is the same as user input - try again
  //       else if (object[name] === currentUser.get("username")) {
  //         // Find another random name  
  //         getAnswer();  
  //       }

  //       // Else print name and remove from PARSE
  //       else {
  //         document.getElementById('answer').innerHTML = "Du er nisse for " + object[name];

  //         currentUser.set('nisse' , object[name]);
  //         currentUser.save();
          
  //         console.log(object[name]);
  //         // Remove name from database
  //         var i = object.indexOf(object[name]);
  //           if (i != -1) {              
  //             query.find({
  //               success: function(results) {               
  //                 for (var i = 0; i < results.length; i+=1) {
  //                   if (results[i].attributes.Navn == object[name])
  //                   {
  //                     results[i].destroy({});
  //                   }
  //                 }
  //               }
  //             });
  //           } 
  //       }
  //     },

  //   error: function(error) {
  //     alert("Error: " + error.code + " " + error.message);
  //   }
  // }); 
}

function newPass() {
  var newPass = document.getElementById('newPassword').value;

  if (document.getElementById('newPassword').value == "") {
    document.getElementById('passwordChanged').innerHTML = "Husk at skrive en kode i feltet!";
  }
  else {
  firebase.database().ref('users/' + currentUser).update({
    password: newPass
  });
  document.getElementById('passwordChanged').innerHTML = "Din adgangskode er skiftet!";
  }
}


function uploadWishlist() {
  
  if (document.getElementById("wishes").value == "") {
    document.getElementById('noWishes').innerHTML = "Husk at vælge en fil før du trykker på knappen :-)";
  } else {
    // GET ELEMENTS
    var fileUploadControl =  document.getElementById('wishes');
    var file = fileUploadControl.files[0];

    // Create a storage ref
    let storageRef = firebase.storage().ref('wishlists/' + currentUser)

    // Upload file
    var task = storageRef.put(file);

    // Confirmation to user
    task.on('state_changed', 
  
      function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(percentage);
      },
      function error(err) {
        
      },
      function complete() {
        let downloadurl = task.snapshot.downloadURL;
        firebase.database().ref('wishlists/' + currentUser).update({
          downloadurl
        });
      }    
  
    );
  }
}




//Get wishlists from Parse
function getWishlists() {
  let listOfWishlists = document.getElementById('wishlistsInner');
  listOfWishlists.innerHTML = "";
  var object = [];

  for (var key in wishlistsArray) {
    let listItem = document.createElement('li')
    listItem.innerHTML = '<a href="' + wishlistsArray[key].downloadurl + '" class="list-group-item" target="_blank">' + key + '</a>';
    listOfWishlists.appendChild(listItem);
    //document.write('<li><a href="' + object[i]._url + '">' + userwishes[i] + '</a></li>');
  }

}

function getNamesLeft() {
  firebase.database().ref('hat').orderByValue().equalTo(0).once('value').then(function(snapshot) {
		console.log(snapshot.val())
  });
}

function getPeoplePicked() {
  
}