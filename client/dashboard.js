import './admin/dashboard.html';
import './admin/header.html';
import './admin/footer.html';
import './admin/sidebar.html';
// import './admin/imports/imports.js';
// import { Inbox } from '../data/inbox';
import { Accounts } from 'meteor/accounts-base'
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http'
const moment = require('moment-timezone');
moment.tz.setDefault("Australia/Sydney");
Meteor.subscribe('usersList');

//============================================
Router.route('/sent', function() {
    this.render('outboxdashboard');
});
Router.route('/trash', function() {
    this.render('trashboard');
});
Router.route('/important', function() {
    this.render('importantdashboard');
});
Router.route('/starred', function() {
    this.render('starreddashboard');
});
Router.route('/unread', function() {
    this.render('unreaddashboard');
});
Router.route('/draft', function() {
    this.render('draftdashboard');
});
Template.registerHelper('getuserField', function(id, filed) {
    var data = Meteor.users.find({ _id: { $eq: id } }).fetch();
    if (filed == 'name') {
        return data[0].profile.name;
    } else {
        return data[0].emails[0].address;
    }
});

Template.registerHelper('isRole', function(role) {
    var user = Meteor.user();
    return user.profile.role == role;
});

Template.registerHelper('currentRoute', function(route) {
    return Router.current().route.getName() === route;
});
//============================================
Template.sidebar.events({
    'click a#logout': function(e, t) {
        //e.preventDefault();
        //Session.keys = {};
        //console.log(Session.keys);
        //Session.clear();
        //Meteor.logout();
        //Router.go("/adminLogout");
    }
});

Template.adminheader.rendered = function() {
    $('textarea#textbody').characterCounter();
    $('#createmodal').modal();
};
Template.adminheader.events({
    'submit #sendEmail': function(event) {
        event.preventDefault();
        var target = event.currentTarget;

        var recipients = target.recipients.value;
        var subjects = target.subjects.value;
        var textbody = target.textbody.value;

        var user = Meteor.user().services.google.email;
        var emailData = {
            user,
            recipients,
            subjects,
            textbody,
            important: false,
            starred: false,
            createdAt: new Date(moment().format())
        }

        console.log(emailData);

        Loading.call('createEmail', emailData, (err, data) => {
            if (err) {
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                Bert.alert("Email sent Successfully", "success", "growl-top-right");
                Router.go('/sent')
            }

        });
    },
    'click .todraftbtn': function(event) {
        event.preventDefault();
        // var target = event.currentTarget;

        var recipients = $('#recipients').val();
        var subjects = $('#subjects').val();
        var textbody = $('#textbody').val();

        var user = Meteor.userId();
        var emailData = {
            user,
            recipients,
            subjects,
            textbody,
            important: false,
            starred: false,
            createdAt: new Date(moment().format())
        }

        console.log(emailData);

        Loading.call('createDraft', emailData, (err, data) => {
            if (err) {
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                Bert.alert("Email saved as draft Successfully", "success", "growl-top-right");
                Router.go('/draft')
            }

        });
    }
});
//=================================
Template.admindashboard.rendered = function() {
    $('textarea#textbody').characterCounter();
    $('.dropdown-trigger').dropdown();
    Session.set('routerPath', 'dashboard')
};
Template.admindashboard.onCreated(function() {
    this.inboxData = new ReactiveVar();
    Loading.call('getInbox', { query: {} }, (err, data) => {
        this.inboxData.set(data);
    });
});
Template.admindashboard.helpers({
    userslist() {
        var userlist = Meteor.users.find({}, {"services.google.name": 1, 
            "services.google.picture": 1,
            "services.google.email" : 1}).fetch();
        console.log(userlist);
        var user = Meteor.user()
        console.log(user.services.google.given_name, user.services.google.picture);
        return userlist;
    },
    inboxData: function() {
        var inboxData =  Template.instance().inboxData.get();
        var user = Meteor.user()
        const email = user.services.google.email
        console.log(email)
        console.log(inboxData);
        var msgIdList = []
        if(inboxData) {
            for(var i=0; i< inboxData.messages.length; i++) {
                msgIdList.push(inboxData.messages[i].id)
            }
        }
        return msgIdList;
    },
    employeecount: function() {
        var users = Meteor.users.find({ 'profile.company': Meteor.userId() }).fetch();

        return users.length;
    },
    calcDate: function(createdAt) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
        var year = createdAt.getFullYear()
        var month = createdAt.getMonth()
        var day = createdAt.getDate()
        var hour = createdAt.getHours()
        var minute = createdAt.getMinutes()
        var ampm = 'am'
        if (hour > 12) {
            ampm = 'pm'
        }
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        return hour + ':' + minute + ' ' + ampm + ' ' + monthNames[month] + ' ' + day + ', ' + year.toString().slice(-2);
    },
});
Template.admindashboard.events({
    'click .deletebtn': function(event) {
        // var id = event.currentTarget.getAttribute('id');
        var name = event.currentTarget.getAttribute('name');
        Loading.call('deleteEmail', {id: name, type: 'inbox'}, (err, data) => {
            if (err) {
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                window.location.reload()
                Bert.alert("Email deleted Successfully", "success", "growl-top-right");
            }
        });
    },
    'click .importantbtn': function(event) {
        // var id = event.currentTarget.getAttribute('id');
        var name = event.currentTarget.getAttribute('name');
        Loading.call('updateImportant', name, (err, data) => {
            if (err) {
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                window.location.reload()
                Bert.alert("Email deleted Successfully", "success", "growl-top-right");
            }
        });
    },
    'click .starbtn': function(event) {
        // var id = event.currentTarget.getAttribute('id');
        var name = event.currentTarget.getAttribute('name');
        Loading.call('updateStarred', name, (err, data) => {
            if (err) {
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                window.location.reload()
                Bert.alert("Email deleted Successfully", "success", "growl-top-right");
            }
        });
    },
});

Template.unreaddashboard.onCreated(function() {
    Session.set('routerPath', 'unread')
    this.unreadData = new ReactiveVar();
    Loading.call('getInbox', { query: {} }, (err, data) => {
        this.unreadData.set(data);
    });
});
Template.unreaddashboard.helpers({
    unreadData: function() {
        var unreadData =  Template.instance().unreadData.get().filter(element => element.readStauts != true);
        console.log(unreadData);
        return unreadData;
    },
    calcDate: function(createdAt) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
        var year = createdAt.getFullYear()
        var month = createdAt.getMonth()
        var day = createdAt.getDate()
        var hour = createdAt.getHours()
        var minute = createdAt.getMinutes()
        var ampm = 'am'
        if (hour > 12) {
            ampm = 'pm'
        }
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        return hour + ':' + minute + ' ' + ampm + ' ' + monthNames[month] + ' ' + day + ', ' + year.toString().slice(-2);
    },
});
Template.unreaddashboard.events({
    'click .deletebtn': function(event) {
        // var id = event.currentTarget.getAttribute('id');
        var name = event.currentTarget.getAttribute('name');
        Loading.call('deleteEmail', {id: name, type: 'inbox'}, (err, data) => {
            if (err) {
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                window.location.reload()
                Bert.alert("Email deleted Successfully", "success", "growl-top-right");
            }
        });
    },
    'click .importantbtn': function(event) {
        // var id = event.currentTarget.getAttribute('id');
        var name = event.currentTarget.getAttribute('name');
        Loading.call('updateImportant', name, (err, data) => {
            if (err) {
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                window.location.reload()
                Bert.alert("Email deleted Successfully", "success", "growl-top-right");
            }
        });
    },
    'click .starbtn': function(event) {
        // var id = event.currentTarget.getAttribute('id');
        var name = event.currentTarget.getAttribute('name');
        Loading.call('updateStarred', name, (err, data) => {
            if (err) {
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                window.location.reload()
                Bert.alert("Email deleted Successfully", "success", "growl-top-right");
            }
        });
    },
});

Template.outboxdashboard.rendered = function() {
    $('.dropdown-trigger').dropdown();
    Session.set('routerPath', 'sent')
};
Template.outboxdashboard.onCreated(function() {
    this.outboxData = new ReactiveVar();

    Loading.call('getOutbox', { query: {} }, (err, data) => {
        this.outboxData.set(data);
    });

});
Template.outboxdashboard.helpers({
    outboxData: function() {
        var outboxData =  Template.instance().outboxData.get();
        console.log(outboxData);
        return outboxData;
    },
    calcDate: function(createdAt) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
        var year = createdAt.getFullYear()
        var month = createdAt.getMonth()
        var day = createdAt.getDate()
        var hour = createdAt.getHours()
        var minute = createdAt.getMinutes()
        var ampm = 'am'
        if (hour > 12) {
            ampm = 'pm'
        }
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        return hour + ':' + minute + ' ' + ampm + ' ' + monthNames[month] + ' ' + day + ', ' + year.toString().slice(-2);
    },
});
Template.outboxdashboard.events({
    'click .deletebtn': function(event) {
        // var id = event.currentTarget.getAttribute('id');
        var name = event.currentTarget.getAttribute('name');
        Loading.call('deleteEmail', {id: name, type: 'outbox'}, (err, data) => {
            if (err) {
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                window.location.reload()
                Bert.alert("Email deleted Successfully", "success", "growl-top-right");
            }
        });
    },
    'click .importantbtn': function(event) {
        // var id = event.currentTarget.getAttribute('id');
        var name = event.currentTarget.getAttribute('name');
        Loading.call('updateImportant', name, (err, data) => {
            if (err) {
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                window.location.reload()
                Bert.alert("Email deleted Successfully", "success", "growl-top-right");
            }
        });
    },
    'click .starbtn': function(event) {
        // var id = event.currentTarget.getAttribute('id');
        var name = event.currentTarget.getAttribute('name');
        Loading.call('updateStarred', name, (err, data) => {
            if (err) {
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                window.location.reload()
                Bert.alert("Email deleted Successfully", "success", "growl-top-right");
            }
        });
    }
});

Template.trashboard.onCreated(function() {
    Session.set('routerPath', 'trash')
    this.trashData = new ReactiveVar();
    Loading.call('getTrash', { query: {} }, (err, data) => {
        this.trashData.set(data);
    });
});

Template.trashboard.helpers({
    trashData: function() {
        var trashData =  Template.instance().trashData.get();
        console.log(trashData);
        return trashData;
    },
});

Template.importantdashboard.onCreated(function() {
    Session.set('routerPath', 'important')
    this.importantData = new ReactiveVar();
    Loading.call('getImportant', { query: {} }, (err, data) => {
        this.importantData.set(data);
    });
});

Template.importantdashboard.helpers({
    importantData: function() {
        var importantData =  Template.instance().importantData.get();
        console.log(importantData);
        return importantData;
    },
    calcDate: function(createdAt) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
        var year = createdAt.getFullYear()
        var month = createdAt.getMonth()
        var day = createdAt.getDate()
        var hour = createdAt.getHours()
        var minute = createdAt.getMinutes()
        var ampm = 'am'
        if (hour > 12) {
            ampm = 'pm'
        }
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        return hour + ':' + minute + ' ' + ampm + ' ' + monthNames[month] + ' ' + day + ', ' + year.toString().slice(-2);
    },
});

Template.starreddashboard.onCreated(function() {
    Session.set('routerPath', 'starred')
    this.starredData = new ReactiveVar();
    Loading.call('getStarred', { query: {} }, (err, data) => {
        this.starredData.set(data);
    });
});

Template.starreddashboard.helpers({
    starredData: function() {
        var starredData =  Template.instance().starredData.get();
        console.log(starredData);
        return starredData;
    },
    calcDate: function(createdAt) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
        var year = createdAt.getFullYear()
        var month = createdAt.getMonth()
        var day = createdAt.getDate()
        var hour = createdAt.getHours()
        var minute = createdAt.getMinutes()
        var ampm = 'am'
        if (hour > 12) {
            ampm = 'pm'
        }
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        return hour + ':' + minute + ' ' + ampm + ' ' + monthNames[month] + ' ' + day + ', ' + year.toString().slice(-2);
    },
});

Template.viewemail.onCreated(function() {
    this.emailData = new ReactiveVar();
    Loading.call('getAll', { query: {} }, (err, data) => {
        this.emailData.set(data);
    });
});

Template.viewemail.helpers({
    emailData: function() {
        var emailData =  Template.instance().emailData.get();
        console.log(emailData);
        var emailId = this.emailId;
        var data = emailData.find(element => element._id == emailId);
        var user = Meteor.user();
        if(user.emails[0].address == data.recipients) {
            Loading.call('updateReadStatus', emailId, (err, res) => {
                console.log(res);
            })
        }
        return data;
    },
});

Template.viewemail.events({
    'click .backbtn': function() {
        // Router.go('/dashboard')
        var routerPath = Session.get('routerPath');
        console.log(routerPath);
        Router.go(`/${routerPath}`)
    }
})

Template.draftdashboard.rendered = function() {
    $('.dropdown-trigger').dropdown();
};
Template.draftdashboard.onCreated(function() {
    this.draftData = new ReactiveVar();

    Loading.call('getDraft', { query: {} }, (err, data) => {
        this.draftData.set(data);
    });

});
Template.draftdashboard.helpers({
    draftData: function() {
        var draftData =  Template.instance().draftData.get();
        console.log(draftData);
        return draftData;
    },
    calcDate: function(createdAt) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
        var year = createdAt.getFullYear()
        var month = createdAt.getMonth()
        var day = createdAt.getDate()
        var hour = createdAt.getHours()
        var minute = createdAt.getMinutes()
        var ampm = 'am'
        if (hour > 12) {
            ampm = 'pm'
        }
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        return hour + ':' + minute + ' ' + ampm + ' ' + monthNames[month] + ' ' + day + ', ' + year.toString().slice(-2);
    },
});
Template.draftdashboard.events({
    'click .deletebtn': function(event) {
        // var id = event.currentTarget.getAttribute('id');
        var name = event.currentTarget.getAttribute('name');
        Loading.call('deleteEmail', name, (err, data) => {
            if (err) {
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                window.location.reload()
                Bert.alert("Email deleted Successfully", "success", "growl-top-right");
            }
        });
    },
    'click .importantbtn': function(event) {
        // var id = event.currentTarget.getAttribute('id');
        var name = event.currentTarget.getAttribute('name');
        Loading.call('updateImportant', name, (err, data) => {
            if (err) {
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                window.location.reload()
                Bert.alert("Email deleted Successfully", "success", "growl-top-right");
            }
        });
    },
    'click .starbtn': function(event) {
        // var id = event.currentTarget.getAttribute('id');
        var name = event.currentTarget.getAttribute('name');
        Loading.call('updateStarred', name, (err, data) => {
            if (err) {
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                window.location.reload()
                Bert.alert("Email deleted Successfully", "success", "growl-top-right");
            }
        });
    }
});
Template.registerHelper('membershipExpcheck', function(arg) {
    var user = Meteor.user();

    if (user) {
        var rndate = user.createdAt;

        if (user.profile.membershipreniew) {

            //const user = Meteor.users.findOne({_id: user.profile.compnay});
            rndate = user.profile.membershipreniew;
            return '' + moment(rndate).add(180, 'days').format('DD, MMM YYYY');
        } else {
            return '' + moment(rndate).add(180, 'days').format('DD, MMM YYYY');
        }
    }
});
//================================================
//---------------------------------------
// Template.myaccount.helpers({
//     'userdetails': function() {
//         // Meteor.subscribe("userList");
//         //  console.log(Meteor.user());
//         return Meteor.user();

//     }

// });

// Template.myaccount.events({

//     'submit #my-profile': function(event) {
//         event.preventDefault();

//         var target = event.currentTarget;
//         //Get All From Data

//         var fullName = target.name.value;
//         var phone = target.phone.value;
//         var password = target.password.value;

//         Loading.call('updateuserprofile', { name: fullName, phone: phone, password: password },
//             function(error, result) {
//                 // console.log(error)
//                 //  if (error) {
//                 //    Bert.alert("Something wrong: Please try again.", "danger", "growl-top-right");
//                 //  } else {
//                 Bert.alert("Profile update successfull.", "success", "growl-top-right");


//                 // }

//             });

//     },
//     'change .signatureImageUpload': function(event) {
//         var files = event.target.files;
//         var total_file = files.length;
//         var cap = $(event.target).closest('tr').find('.autocomplete').val();

//         $(event.target).closest('tr').next('tr').find('.image_preview').html('');
//         for (var i = 0; i < total_file; i++) {

//             $(event.target).closest('tr').next('tr').find('.image_preview').append("<div class='previewblock'><img class='responsive-img imagegrayscale' id='image_pre_" + i + "' src='" + URL.createObjectURL(files[i]) + "'></div>");
//         }




//         var reader = new FileReader();

//         function readFile(index) {
//             if (index >= files.length) return;
//             var file = files[index];
//             var lastmodifydate = file.lastModifiedDate;
//             reader.onload = function(e) {
//                 Loading.start();
//                 Meteor.call('signature-file-upload', { name: file.name, fileData: reader.result, cid: Session.get('currentClaimNumber'), cap: cap, lastmodifydate: lastmodifydate }, function(error, result) {

//                     $("#image_pre_" + index).removeClass("imagegrayscale");
//                     Loading.stop();
//                 });
//                 var bin = e.target.result;
//                 // do sth with bin
//                 readFile(index + 1)
//             }
//             reader.readAsBinaryString(file);
//         }
//         readFile(0);



//     },
// });