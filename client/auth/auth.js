import { Session } from 'meteor/session';
import { ServiceConfiguration } from 'meteor/service-configuration'

Template.register.events({

    'submit form': function(event) {
        event.preventDefault();

        Loading.start();

        var nameVar = event.target.registerName.value;
        var emailVar = event.target.registerEmail.value;
        var passwordVar = event.target.registerPassword.value;

        // Check email exists or not
        const user = Meteor.users.findOne({ "emails.0.address": emailVar });

        // stop loading
        Loading.stop();

        if (!user) {
            //User Doesnot Exists; So Check It has any claim or not
            // Check email has any claim or not
            // if (!user) {
            //     // any claim not found under these email; so registerd it as company
            //     Accounts.createUser({
            //         email: emailVar,
            //         password: passwordVar,
            //         profile: {
            //             name: nameVar,
            //             role: "company",
            //             subrole: 'administrator',
            //             access: [0],
            //             activity: true,
            //             lastsignin: new Date(moment().format())
            //         },
            //     }, function(err, data) {

            //         Loading.stop();

            //         if (err) {
            //             Bert.alert(err.reason, "danger", "growl-top-right");
            //         } else {
            //             Router.go("/dashboard");
            //         }

            //     });
            // } else {
                // email found under claim; so registered it as customer
                Accounts.createUser({
                    email: emailVar,
                    password: passwordVar,
                    profile: {
                        name: nameVar,
                        role: "customer",
                        access: [0],
                        activity: true,
                        lastsignin: new Date(moment().format())
                    }
                }, function(err, data) {
                    // loading stop
                    Loading.stop();

                    if (err) {
                        // if registration failed
                        Bert.alert(err.reason, "danger", "growl-top-right");
                    } else {
                        // redirect to dashboard
                        Router.go("/dashboard");
                    }

                });
            // }
        } else {
            // Email Already In Used 
            Bert.alert("Email Already Registered, Please Try Another", "danger", "growl-top-right");
        }

    }

});

Template.login.helpers({
    configurationExists() {
        return ServiceConfiguration.configurations.findOne({service: 'google'});
      }
})

Template.login.events({
    'submit form': function(event) {
        event.preventDefault();

        // Loading.start();

        // var emailVar = event.target.loginEmail.value;
        // var passwordVar = event.target.loginPassword.value;GWxmt[2HkP

        console.log(ServiceConfiguration.configurations.findOne({service: 'google'}));
        Meteor.loginWithGoogle({
            loginStyle: 'popup',
            requestPermissions: [
                'https://www.googleapis.com/auth/gmail.readonly',
                'https://www.googleapis.com/auth/gmail.modify',
                'https://mail.google.com',
                'https://www.googleapis.com/auth/gmail.compose',
                'https://www.googleapis.com/auth/gmail.metadata',
            ],
            requestOfflineToken: true,
            forceApprovalPrompt: true
        }, err => {
            if (!err) {
              // successful authentication
              Bert.alert("Login successfully", "success", "growl-top-right");
            } else{
              // failed authentication
              Bert.alert(err.toString() || 'Unknown Error', "danger", "growl-top-right");
            }
          });

        // const user = Meteor.users.findOne({ "emails.0.address": emailVar });
        // if (user && !user.profile.activity) {
        //     Loading.stop();
        //     Bert.alert("You are inactivated by super admin", "danger", "growl-top-right");
        // } else {
        //     Meteor.loginWithPassword(emailVar, passwordVar, function(err) {
        //         //Stop loading
        //         Loading.stop();
    
        //         if (err) {
        //             // If login failed
        //             Bert.alert(err.reason, "danger", "growl-top-right");
    
        //         } else {
        //             // get instance of current user
        //             var user = Meteor.user();
        //             // console.log(user._id);debugger;
        //             Meteor.users.update(user._id, { $set: { 'profile.lastsignin' : new Date(moment().format()) } });
    
        //             // Check current user is company or not
        //             if(user.profile.role == 'superadmin') {
        //                 Router.go("/dashboard");
        //             } else if (user.profile.role == "company") {
        //                 //Session.set('subRole', 'administrator');
        //                 // if (isExpired()) {
        //                 //     Router.go("/billing");
        //                 // } else {
        //                 Router.go("/dashboard");
        //                 // }
    
    
        //             } else if (user.profile.role == "contractor") {
        //                 //Session.set('subRole', 'administrator');
        //                 Router.go("/dashboard");
    
        //             } else if (user.profile.role == "customer") {
        //                 //Session.set('subRole', 'administrator');
        //                 Router.go("/dashboard");
        //                 //Router.go("/emp-dashboard");
        //             } else {
        //                 // Take action accordingly
    
        //             }
        //         }
        //     });
        // }
    }
});
Template.forgotpassword.events({
    'submit form': function(event) {
        event.preventDefault();

        //  Loading.start();

        var emailVar = event.target.loginEmail.value;

        Loading.call(
            'resetpasswordreq', { existemail: emailVar },
            function(error, result) {
                if (error) {
                    Bert.alert("Email does not exist!", "danger", "growl-top-right");
                } else {
                    Bert.alert("Please check your email for pass code.", "success", "growl-top-right");
                    Session.set('resetemail', emailVar);
                    Session.set('resetpass', result);
                    Router.go("/forgotpasswordsub");
                }

            });
    }
});
Template.forgotpasswordsub.events({
    'submit form': function(event) {
        event.preventDefault();

        //  Loading.start();
        var email = Session.get('resetemail');
        var passcode = Session.get('resetpass');
        var onetimepass = event.target.onetimepass.value;
        var newpass = event.target.loginPassword.value;
        if (passcode === onetimepass) {
            Loading.call(
                'resetpasswordsucess', { existemail: email, newpass: newpass },
                function(error, result) {
                    if (error) {
                        Bert.alert("Something wrong: Please try again.", "danger", "growl-top-right");
                    } else {
                        Bert.alert("Password reset successfull.", "success", "growl-top-right");
                        Router.go("/");

                    }

                });
        } else {
            Bert.alert("Entered passcode does not matched.", "danger", "growl-top-right");
        }
    }
});
Template.addContractor.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.registerEmail.value;
        var passwordVar = event.target.registerPassword.value;
        var userName = event.target.userName.value;
        var contactNo = event.target.contactNo.value;
        console.log("Called");
        Accounts.createUser({
            email: emailVar,
            password: passwordVar,
            profile: {
                name: userName,
                contactNo: contactNo,
                role: "contractor",
                company: Meteor.user()._id,
                activity: true
            }
        }, function(err, data) {
            if (err)
                console.log(err);
            else {
                data.firstLogin = true;
                console.log('success!', data);
                Router.go("/dashboard");
            }
        });
    }
});

Template.sendInvitation.events({
    'submit form': function(event) {
        event.preventDefault();
        var email = event.target.email.value;
        // console.log("email==", email, Meteor.user()._id);
        Meteor.call('addToInvitesList', email, Meteor.user()._id);
        // Meteor.call(
        //   'sendEmail',
        //   'Alice <santunandi.nandi@gmail.com>',
        //   'santunandi07@gmail.com',
        //   'Hello from Meteor!',
        //   'This is a test of Email.send.'
        // );
        // Accounts.createUser({
        //   email: emailVar,
        //   password: passwordVar,
        //   profile: {
        //     name: userName,
        //     contactNo: contactNo,
        //     role: "contractor"
        //   }
        // }, function(err, data) {
        //   if (err)
        //     console.log(err);
        //   else {
        //     data.firstLogin = true;
        //     console.log('success!', data);
        //     Router.go("/dashboard");
        //   }
        // });
    }
});

Template.invitationAdd.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.registerEmail.value;
        var passwordVar = event.target.registerPassword.value;
        var userName = event.target.userName.value;
        var contactNo = event.target.contactNo.value;
        console.log("Called");
        Accounts.createUser({
            email: emailVar,
            password: passwordVar,
            profile: {
                name: userName,
                contactNo: contactNo,
                role: "contractor",
                activity: true
            }
        }, function(err, data) {
            if (err)
                console.log(err);
            else {
                data.firstLogin = true;
                console.log('success!', data);
                Router.go("/dashboard");
            }
        });
    }
});

Template.acceptInvitation.events({
    'submit form': function(event) {
        event.preventDefault();
        var userName = event.target.userName.value;
        var contactNo = event.target.contactNo.value;
        console.log("Called", this.jobId);
        Invites = new Mongo.Collection("invites");

        let invitationData = Invites.findOne({ _id: this.jobId });
        Accounts.createUser({
            email: 'santu123@gmail.com', //invitationData.email,http://localhost:3000/accept-invitation/ftRCwDDSeiTCYnBrg
            password: invitationData._id,
            profile: {
                name: userName,
                contactNo: contactNo,
                role: "contractor",
                company: invitationData.company,
                invitation: true,
                activity: true
            }
        }, function(err, data) {
            if (err)
                console.log(err);
            else {
                data.firstLogin = true;
                console.log('success!', data);
                // Router.go("/dashboard");
            }
        });
    }
});