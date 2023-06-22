import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { HTTP } from 'meteor/http'
import { Mongo } from 'meteor/mongo';
import fs from 'fs';
import { Inbox } from '../data/inbox';
import { Outbox } from '../data/outbox';
import { Trash } from '../data/trash';
import { Draft } from '../data/draft';
// import { elecUsage } from '../data/elecUsage';
// import { ClaimImages } from '../data/claimImages';
// import { profSet } from '../data/profSet';
// import { Subscriptions } from '../data/subscriptions';
import { Email } from 'meteor/email';
import { Random } from 'meteor/random';
import {ServiceConfiguration} from 'meteor/service-configuration'
const { promisify } = require('util');
const convert = require('heic-convert');
const moment = require('moment-timezone');
moment.tz.setDefault("Australia/Sydney");
const pathNpm = require('path');
const Transactions = new Mongo.Collection('transactions');
Meteor.startup(() => {
    
    // process.env.MAIL_URL = "smtp://no-reply@allcarpets.com.au:noreply2018@smtp.gmail.com:587/";
    // process.env.MAIL_URL = "smtp://gwaysmtp@gmail.com:$$$Gwaysafepass2022$$$@smtp.gmail.com:587/";
    process.env.MAIL_URL = "smtp://postmaster@sandbox0cff46686b5a4d358c39a1a186f9a50c.mailgun.org:1984bb1a3b2d4e5e495232a3ddd240b7-f7d687c0-4185a0a5@smtp.mailgun.org:587"
    ServiceConfiguration.configurations.upsert(
        {service: 'google'},
        {
          $set: {
            "clientId": "922342759226-qm78af1l7sqpagfumtofaggplaedfcl0.apps.googleusercontent.com",
            "secret": "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",
            "loginStyle": "popup"
          },
        },
      );

      //gmail api key: AIzaSyA7-JKVno_j9IZnorZgpLx-nXKzJPKivLA
    // Stripe.setPublishableKey('pk_test_EwtQ86rXvyQnWihU4y9YTfCN00onkiiwVS');
});


//export const Jobs = new Mongo.Collection('jobs');
Meteor.publish("inbox", function() {
    return Inbox.find({})
});
Meteor.publish("outbox", function() {
    return Outbox.find({})
});
Meteor.publish("draft", function() {
    return Draft.find({})
});
Meteor.publish("trash", function() {
    return Trash.find({})
});
Meteor.publish("userList", function() {
    return Meteor.users.find({}, { fields: { emails: 1, profile: 1 } });
});
Meteor.publish("usersList", function() {
    return Meteor.users.find({});
});
//============================
Meteor.methods({
    // call from client
    retailerRegister: function(data) {
        var tempPassword = Random.secret(15)
        var userId = Accounts.createUser({
            email: data.email,
            password: data.pass,
            profile: {
                name: data.name,
                phone: data.phone,
                role: "contractor",
                company: this.userId,
                subrole: this.userId,
                activity: true
            }
        });

        if (userId) {
            Email.send({
                from: 'Water Damage <info@gway.com.au>',
                replyTo: 'info@gway.com.au',
                to: data.email,
                subject: "Account password",
                text: 'Your account password is: ' + tempPassword
            });
        }

    },

    resetpasswordreq: function(data) {
        var password = Random.secret(8)
        var udata = Meteor.users.findOne({ "emails.0.address": data.existemail });


        if (udata) {
            Email.send({
                from: 'Water Damage <info@gway.com.au>',
                replyTo: 'info@gway.com.au',
                to: udata.emails[0].address,
                subject: "Password Reset Request",
                text: 'Your temporary password is: ' + password
            });
            return password;
        } else {
            return false;
        }


    },

    resetpasswordsucess: function(data) {

        var udata = Meteor.users.findOne({ "emails.0.address": data.existemail });
        Accounts.setPassword(udata._id, data.newpass);

        if (udata) {
            Email.send({
                from: 'Water Damage <info@gway.com.au>',
                replyTo: 'info@gway.com.au',
                to: udata.emails[0].address,
                subject: "Password Reset sucessfull",
                text: 'Password reset successfull.'
            });
            return true;
        } else {
            return false;
        }


    },
    updateuserprofile: function(data) {
        var udata = Meteor.user();
        // console.log(udata)
        Meteor.users.update(udata._id, {
            $set: {

                'profile.name': data.name,
                'profile.phone': data.phone
            }
        });

        if (data.password) {
            Accounts.setPassword(data.empid, data.password);
            Email.send({
                from: 'Water Damage <info@gway.com.au>',
                replyTo: 'info@gway.com.au',
                to: udata.emails[0].address,
                subject: "Password Reset sucessfull",
                text: 'Password reset successfull.'
            });
            return true;
        } else {
            return true;
        }
    },
    edituserprofile: function(data) {
        var udata = Meteor.users.find({ _id: { $eq: data.userid } }).fetch();
        Meteor.users.update(data.userid, {
            $set: {
                'profile.name': data.name,
                'emails.0.address': data.email,
                'profile.activity': data.activity,
                'profile.plan': data.plan
            }
        });

        if (data.password) {
            Accounts.setPassword(data.userid, data.password);
            // Email.send({
            //     from: 'Water Damage <info@gway.com.au>',
            //     replyTo: 'info@gway.com.au',
            //     to: udata[0].emails[0].address,
            //     subject: "Password Reset sucessfull",
            //     text: 'Super admin reset your password.'
            // });
            return true;
        } else {
            return true;
        }
    },
    'sendPdfToEmail': function(data) {
        // console.log(data.email)
        var res = Email.send({
            from: 'Water Damage <info@gway.com.au>',
            to: data.email,
            replyTo: 'info@gway.com.au',
            subject: "Report PDF",
            text: 'This is your attachments',
            attachments: {
                filename: 'claim.pdf',
                contentType: 'application/pdf',
                encoding: 'base64',
                content: data.pdfdata
            }
        });
        //  console.log(res)
        return 'Success';
    },
    'sendAggrementToEmail': function(data) {
        Email.send({
            from: 'Water Damage <info@gway.com.au>',
            replyTo: 'info@gway.com.au',
            to: data.email,
            subject: "Agreement PDF",
            text: 'This is your attachments',
            attachments: {
                filename: 'aggrement.pdf',
                contentType: 'application/pdf',
                encoding: 'base64',
                content: data.pdfdata
            }
        });
    },
    createEmail: function(emailData) {
        // Inbox.insert(emailData)
        var user = Meteor.user()
        var senderEmail = user.services.google.email;
        Email.send({
            // from: "Mailgun Sandbox <postmaster@sandbox0cff46686b5a4d358c39a1a186f9a50c.mailgun.org>",
            from: senderEmail,
            replyTo: [senderEmail],
            // from: 'supernftier@gmail.com',
            // replyTo: ["supernftier@gmail.com"],
            to: emailData.recipients,
            subject: emailData.subjects,
            text: emailData.textbody,
        });
        return true;
    },
    createDraft: function(emailData) {
        // Draft.insert(emailData)         
        var user = Meteor.user()
        const email = user.services.google.email
        console.log(email)

        // var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
        // 'content': JSON.stringify({
        //     "raw": encodedMail
        // })
        const dataObject = {
            'headers' : { 
                'Authorization': "Bearer " + user.services.google.accessToken,
                'Content-Type': 'application/json' 
            },
            'content': {
                'raw': CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Hello, World!'))
            }
        }
        HTTP.post('https://www.googleapis.com/upload/gmail/v1/users/' + encodeURIComponent(email) + '/drafts', dataObject, (error, result) => {
            if (error) {
            console.log('err', error)
            }
            if (result) {
            console.log('res', result)
            }
        })
        return true;
    },
    getInbox: function() {
        this.unblock();
        // var user = Meteor.user();
        // var inboxData = Inbox.find({recipients: user.emails[0].address}).fetch();
        var user = Meteor.user()
        const email = user.services.google.email
        console.log(email)
        console.log(user.services.google.accessToken);
        // var inboxData;

        // var result = HTTP.get('https://gmail.googleapis.com/gmail/v1/users/' + email + '/messages', {
        //     'headers': {
        //         'Authorization': "Bearer " + user.services.google.accessToken,
        //         'Content-Type': 'application/json' 
        //     }
        // })
        var result = HTTP.get('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
            headers: {
                'Authorization': "Bearer " + user.services.google.accessToken,
            },
            params: {
                'orderBy': 'startTime',
                'timeZone': 'Australia/Sydney'
            }
        })
        // var result = HTTP.get('https://reqres.in/api/users?page=2')
        return result;
    },
    // getOutbox: function() {
    //     var user = Meteor.user();
    //     var outboxData = Inbox.find({user: user._id}).fetch();
    //     return outboxData;
    // },
    getTrash: function() {
        var trashData = HTTP.get('https://gmail.googleapis.com/gmail/v1/users/' + encodeURIComponent(email) + '/messages'/data.emailId, {
            'headers': {
                'Authorization': "Bearer " + user.services.google.accessToken,
                'Content-Type': 'application/json'
            }
        }).then((error, result) => {
            if (error) {
                console.log('err', error)
                return 'error'
            }
            if (result) {
                console.log('res', result)
                return 'result'
            }
        })
        return trashData;
    },
    getDraft: function() {
        // var draftData = Draft.find({}).fetch();
        var result = HTTP.get('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
            headers: {
                'Authorization': "Bearer " + user.services.google.accessToken,
            },
            params: {
                'orderBy': 'startTime',
                'timeZone': 'Australia/Sydney'
            }
        })
        return draftData;
    },
    // getImportant: function() {
    //     var importantData = Inbox.find({ important: true}).fetch();
    //     return importantData;
    // },
    // getStarred: function() {
    //     var starredData = Inbox.find({ starred: true}).fetch();
    //     return starredData;
    // },
    // getAll: function() {
    //     var inboxData = Inbox.find({}).fetch();
    //     var outboxData = Outbox.find({}).fetch();
    //     var trashData = Trash.find({}).fetch();
    //     return [...inboxData, ...outboxData, ...trashData];
    // },
    deleteEmail: function(data) {
        // var emailData;
        // if(type == 'inbox') {
        //     emailData = Inbox.findOne({_id: data.id});
        //     Inbox.remove({_id: data.id});
        // } else if(type == 'outbox') {
        //     emailData = Outbox.findOne({_id: data.id});
        //     Outbox.remove({_id: data.id});
        // }
        // Trash.insert(emailData);

        // var user = Meteor.user();
        // var inboxData = Inbox.find({recipients: user.emails[0].address}).fetch();
        var user = Meteor.user()
        const email = user.services.google.email
        console.log(email)
        // var inboxData;

        HTTP.get('https://gmail.googleapis.com/gmail/v1/users/' + encodeURIComponent(email) + '/messages'/data.emailId, {
            'headers': {
                'Authorization': "Bearer " + user.services.google.accessToken,
                'Content-Type': 'application/json' 
            }
        }).then((error, result) => {
            if (error) {
                console.log('err', error)
                return 'error'
            }
            if (result) {
                console.log('res', result)
                return 'result'
            }
        })
        return true;
    },
    // updateImportant: function(id) {
    //     var currentemail = Inbox.findOne({_id: id});
    //     var currentimportantstatus = currentemail.important;
    //     Inbox.update({ _id: id }, { $set: {'important' : !currentimportantstatus} });
    //     return true;
    // },
    // updateStarred: function(id) {
    //     var currentemail = Inbox.findOne({_id: id});
    //     var currentstarredstatus = currentemail.starred;
    //     Inbox.update({ _id: id }, { $set: {'starred' : !currentstarredstatus} });
    //     return true;
    // },
    // updateReadStatus: function(id) {
    //     var currentemail = Inbox.findOne({_id: id});
    //     Inbox.update({ _id: id }, { $set: {'readStauts' : true} });
    //     return true;
    // }
    
});