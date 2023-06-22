import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import { Session } from 'meteor/session';
// import { profSet } from '../data/profSet';
import './main.html';
import './footer.html';
import './dashboard.js';
import './auth/auth.html';
import './auth/auth.js';
import './admin/admin.js';
// import './emp/dashboard.js';
// import './myaccount/dashboard.html';
// import './canvas/canvas.html';
// import './canvas/canvas.js';
const moment = require('moment-timezone');
moment.tz.setDefault("Australia/Sydney");
Meteor.startup(function() {
    Uploader.uploadUrl = Meteor.absoluteUrl("upload"); // Cordova needs absolute URL
    // Stripe.setPublishableKey('pk_live_z6bzNLPKm9r5voHKIufEoEDr00BRgzrDrt');
    Stripe.setPublishableKey('pk_test_EwtQ86rXvyQnWihU4y9YTfCN00onkiiwVS');
    GoogleMaps.load({
        key: 'AIzaSyA-MQvDnJelr8EREqQqAOSNWnF7QE5wEJw',
        libraries: 'places'
    });
    Accounts.ui.config({
        requestPermissions: {
            google: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://mail.google.com/',
                'https://www.googleapis.com/auth/gmail.compose',
                'https://www.googleapis.com/auth/gmail.insert',
                'https://www.googleapis.com/auth/gmail.labels',
                'https://www.googleapis.com/auth/gmail.metadata',
                'https://www.googleapis.com/auth/gmail.modify',
                'https://www.googleapis.com/auth/gmail.readonly',
                'https://www.googleapis.com/auth/gmail.send',
                'https://www.googleapis.com/auth/gmail.settings.basic',
                'https://www.googleapis.com/auth/gmail.settings.sharing',
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/spreadsheets',
                "https://mail.google.com/mail/feed/atom",
                "https://mail.google.com/mail",
            ]
      },
        requestOfflineToken: {
          google: true
        }
    })
});


Router.route('/', function() {
    if (Meteor.userId()) {
        Router.go("/dashboard");
    } else {
        this.render('login');
    }
});

Router.route('/register', function() {
    this.render('register');
});
Router.route('/forgotpassword', function() {
    this.render('forgotpassword');
});
Router.route('/forgotpasswordsub', function() {
    this.render('forgotpasswordsub');
});
Router.route('/myaccount', function() {
    this.render('myaccount');
});

Router.route('/dashboard', function() {
    var user = Meteor.user();
    if (Meteor.userId()) {
        this.render('admindashboard');
    } else {
        Router.go('login');
    }
});

Router.route('/viewemail:id', {
    template: 'viewemail',
    data: function() {
        var emailId = this.params.id;
        return { emailId: emailId.replace(':', '') };
    }
});
//-----------------
Meteor.subscribe("userList");
//========================
Template.registerHelper('isCompany', function(id) {
        var data = Meteor.user();

        if (data.profile.role == 'company') {
            return true;
        } else {
            return false;
        }

    })
    //========================
Template.registerHelper('currentRouteIs', function(route) {

    return Router.current().route.path() === route;
});
Template.registerHelper('isFontend', function() {

    if (Router.current()) {
        if (Router.current().route.path() === '/' || Router.current().route.path() === '/login' || Router.current().route.path() === '/register') {
            return true;
        } else {
            return false;
        }
    } else {
        Router.go('/');
    }

});
//======================================================
var isadminUser = function(val) {
    var data = Meteor.user();
    if (data.profile.role == 'contractor') {
        return false;
    } else {
        return true;
    }
};
    //========================================
    //==============
Template.adminheader.helpers({
    'getuserprofilename': function() {
        var udata = Meteor.user();
        return udata;

    },
});

Template.adminheader.events({
    'click a#logout': function(e, t) {
        // prevent page to load
        e.preventDefault();

        // Clear the session
        Session.clear(); //Session.keys = {};

        // User logout from meteor
        Meteor.logout(function(err) {
            if (err) {
                // Error Occured
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                Router.go('/');
            }
        });

        // Delay 100 milisecond to execute logout properly
        /*Meteor.setTimeout(function(){ 
          // redirect to / or /login
          Router.go('/login'); 
        }, 100);*/
    }

});
//===================
Blaze.registerHelper('isEqual', function(lhs, rhs) {

    if (lhs === rhs) {
        return true;
    }
});
Blaze.registerHelper('notEqual', function(lhs, rhs) {

    if (lhs.toString() != rhs.toString()) {
        return true;
    }
});

Blaze.registerHelper('isChecked', function(lhs, rhs) {

    if (lhs === rhs) {
        return 'checked';
    }
});