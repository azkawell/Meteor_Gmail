Loading.call('getClaimsQuerydOne', { query: { '_id': target.attr('id') } }, (err, retdata) => {
    //console.log(data)
    var data = retdata.claims;

    let techdata = Meteor.users.findOne({ '_id': data.empID });
    let email_id = data.client_email;

    var headerRaa = [{ text: 'Room Type', color: '#c8aa76', bold: true }, { text: 'Area', color: '#c8aa76', bold: true }, { text: 'Category of damage', color: '#c8aa76', bold: true }, { text: 'Classification of loss', color: '#c8aa76', bold: true }];
    var raadata = data.raa_data;
    var raaBodydata = [];
    raaBodydata.push(headerRaa);

    var headerR = [{ text: 'Date', color: '#c8aa76', bold: true }, { text: 'WME % Structure', color: '#c8aa76', bold: true }, { text: 'WME % Content', color: '#c8aa76', bold: true }, { text: 'Humidity & Temp', color: '#c8aa76', bold: true }, { text: 'Location', color: '#c8aa76', bold: true }];
    var reading = data.readings;
    var bodydata = [];
    bodydata.push(headerR);

    var user = Meteor.user();

    if (user.profile.role === 'company')
        userId = Meteor.userId();
    else
        userId = user.profile.company;

    //var setData = profSet.findOne({ empID: { $eq: userId } });
    var setData = retdata.profdata;

    //Check Does Company add any Settings Information
    if (setData.length === 0) {

        //If Company doesnot add any Settings Information
        Bert.alert("Provide Your Company Settings & Try Again", "danger", "growl-top-right");
        return false;

    }

    for (var i = 0; i < raadata.length; i++) {
        datarow = [];
        datarow.push(raadata[i].raa_roomtype);
        datarow.push(raadata[i].raa_area);
        datarow.push(raadata[i].raa_category);


        if (raadata[i].raa_class == undefined) {
            datarow.push('');
        } else {
            datarow.push(raadata[i].raa_class);
        }
        raaBodydata.push(datarow);
    }

    for (var i = 0; i < reading.length; i++) {
        datarow = [];
        datarow.push(reading[i].reading_date);
        datarow.push(reading[i].wme_structure_value);
        datarow.push(reading[i].wme_content_value);
        datarow.push(reading[i].wme_humidity);

        if (reading[i].wme_location == undefined) {
            datarow.push('');
        } else {
            datarow.push(reading[i].wme_location);
        }
        bodydata.push(datarow);
    }

    var equip_headerR = [{ text: 'Equipment', fillColor: '#f5f5f5', bold: true }, { text: 'Serial No', style: 'tablesubitem' }, 'Days'];
    var equipment_info = data.equipment_info;
    var equip_data = [];
    equip_data.push(equip_headerR);

    for (var i = 0; i < equipment_info.length; i++) {
        datarow = [];
        datarow.push({ text: equipment_info[i].equipment, style: 'tablesubitem' });
        datarow.push(equipment_info[i].euip_serial_no);

        datarow.push((equipment_info[i].quip_day_1) ? equipment_info[i].quip_day_1 : '');
        // datarow.push((parseInt(equipment_info[i].quip_day_2) ? 'X' : ''));
        // datarow.push((parseInt(equipment_info[i].quip_day_3) ? 'X' : ''));
        // datarow.push((parseInt(equipment_info[i].quip_day_4) ? 'X' : ''));
        // datarow.push((parseInt(equipment_info[i].quip_day_5) ? 'X' : ''));
        // datarow.push((parseInt(equipment_info[i].quip_day_6) ? 'X' : ''));
        // datarow.push((parseInt(equipment_info[i].quip_day_7) ? 'X' : ''));
        equip_data.push(datarow);
    }


    var category_damage_arr = ['Clean', 'Grey', 'Black', 'Contaminated'];
    var cat_dmg = [];
    cat_dmg.push("");
    for (var i = 0; i < category_damage_arr.length; i++) {
        if (category_damage_arr[i] == data.category_damage) {
            cat_dmg.push('X');
        } else {
            cat_dmg.push("");
        }
    }

    var loss_classification_arr = ['Class 1', 'Class 2', 'Class 3', 'Class 4'];
    var loss_arr = [];
    loss_arr.push("");
    for (var i = 0; i < loss_classification_arr.length; i++) {
        if (loss_classification_arr[i] == data.loss_classification) {
            loss_arr.push('X');
        } else {
            loss_arr.push("");
        }
    }


    var travelhours = data.travel_info;
    var trvArray = [];
    trvArray.push(['Date', 'Time Onsite', 'Time Offsite', 'Travel Hours']);
    travelhours.forEach(function(value) {
        trvArray.push([value.travel_date, value.time_onsite, value.time_offsite, value.travel_hours]);
    });


    Loading.call('getNewimagetobase64', { claimid: data._id }, function(error, base64images) {
        console.log(base64images)
        var totalphotopage = Math.ceil(base64images.photo.length / 4);
        var totalsketpagesket = Math.ceil(base64images.sketch.length / 4);
        var lastpage = parseInt(totalphotopage) + parseInt(totalsketpagesket);
        var docDefinition = '';

        if (setData.invoice_template == 2) {
            var equip_headerR = [{ text: 'Equipment', fillColor: '#f5f5f5', bold: true }, { text: 'Serial No', style: 'tablesubitem' }, 'Days'];
            var equipment_info = data.equipment_info;
            var equip_data = [];
            equip_data.push(equip_headerR);

            for (var i = 0; i < equipment_info.length; i++) {
                datarow = [];
                datarow.push({ text: equipment_info[i].equipment, style: 'tablesubitem' });
                datarow.push(equipment_info[i].euip_serial_no);

                datarow.push((equipment_info[i].quip_day_1) ? equipment_info[i].quip_day_1 : '');
                // datarow.push((parseInt(equipment_info[i].quip_day_2) ? 'X' : ''));
                // datarow.push((parseInt(equipment_info[i].quip_day_3) ? 'X' : ''));
                // datarow.push((parseInt(equipment_info[i].quip_day_4) ? 'X' : ''));
                // datarow.push((parseInt(equipment_info[i].quip_day_5) ? 'X' : ''));
                // datarow.push((parseInt(equipment_info[i].quip_day_6) ? 'X' : ''));
                // datarow.push((parseInt(equipment_info[i].quip_day_7) ? 'X' : ''));
                equip_data.push(datarow);
            }
            var docDefinition = {
                pageSize: 'A4',

                footer: function(currentPage, pageCount) {
                    if (currentPage != 1) {
                        // return [
                        //     // { text: 'Mobile: '+setData.contactNo+', Email: '+setData.email, alignment: 'center', color:'#1b4d98' },
                        //     { text: currentPage.toString() + ' of ' + pageCount, alignment: 'right', italics: true, margin: 10 },
                        // ]
                        return [

                            {

                                columns: [{

                                        text: 'Powered by Gway',
                                        width: '50%',
                                        italics: true,
                                        margin: 10,
                                        alignment: 'left'


                                    },

                                    {

                                        text: currentPage.toString() + ' of ' + pageCount,
                                        alignment: 'right',
                                        italics: true,
                                        margin: 10,
                                        width: '50%',




                                    },


                                ]
                            }


                        ]
                    } else {
                        return '';
                    }
                },

                // header: function (currentPage, pageCount, pageSize) {
                //     return [
                //         { text: 'National Restoration Network Pvt. Ltd.', alignment: 'center' },
                //         { text: 'ACN: 35 632 764 660 <br> Mobile: 04325 10 325',  },
                //         { text: 'Mobile: 04325 10 325 ',  },
                //         { text: 'Info@nationalrestorationnetwork.com.au', }

                //     ]
                // },
                pageMargins: [30, 100, 60, 30],
                header: function(page) {
                    if (page != 1) {
                        return [

                            {
                                margin: 10,
                                columns: [{
                                        // usually you would use a dataUri instead of the name for client-side printing
                                        // sampleImage.jpg however works inside playground so you can play with it
                                        image: setData.iconImg,
                                        // height: 68,
                                        // fit: [70],
                                        fit: [170, 70],
                                        width: '50%',
                                        alignment: 'left',
                                        margin: [0, 0, 0, 0],
                                    },

                                    {

                                        text: setData.contactNo + ' \n ' + setData.email + ' \n ' + setData.website,
                                        width: '50%',
                                        alignment: 'right',
                                        margin: [5, 10, 0, 2],


                                    },

                                ]
                            },
                            {
                                margin: [0, 0, 0, 0],
                                canvas: [{ type: 'line', lineColor: 'orange', x1: 10, y1: 10, x2: 595 - 10, y2: 10, lineWidth: 1 }]
                            }

                        ]
                    } else {
                        return '';
                    }
                },
                // Content with styles
                background: function(currentPage, pageSize) {
                    if (currentPage === 1) {
                        return {
                            image: backImageForPDF(),
                            fit: [70]


                        }
                    } else {
                        return '';
                    }
                    // return `page ${currentPage} with size ${pageSize.width} x ${pageSize.height}`
                },
                content: [{
                        columns: [{
                                width: '40%',
                                text: '',

                            },
                            {
                                margin: [250, 30, 0, 0],
                                image: setData.iconImg,
                                // fit: [70],
                                heigt: 120,
                                alignment: 'center'
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '40%',
                                text: '',

                            },
                            {
                                margin: [0, 200, 0, 0],
                                width: '60%',
                                text: 'Complete reportings of restoration work completed at ' + setData.companyName,
                                bold: true,
                                fontSize: 16,
                                alignment: 'center',
                                italics: true,
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '40%',
                                text: '',

                            },
                            {
                                margin: [0, 50, 0, 0],
                                width: '60%',
                                text: setData.companyName + ' \n ACN: ' + setData.ACN,
                                bold: true,
                                fontSize: 18,
                                alignment: 'center',
                                italics: true,
                                color: '#777879'
                            }
                        ]
                    },

                    { text: '\n\n TABLE OF CONTENTS ', pageBreak: "before", margin: [0, 30, 0, 20], bold: true, alignment: 'center', fontSize: 16 },

                    {
                        columns: [{
                                width: '90%',
                                text: 'REPORT',

                            },
                            {
                                width: '10%',
                                text: '#',
                            }
                        ]
                    },
                    {
                        margin: [0, 0, 0, 30],
                        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 480 - 10, y2: 0, lineWidth: 1 }]
                    },
                    { columns: [{ width: '90%', text: 'Report Details', fontSize: 11, margin: [0, 0, 0, 0] }, { width: '10%', text: '3', margin: [0, 0, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Details of Work Carried Out', fontSize: 11, margin: [0, 10, 0, 0] }, { width: '10%', text: '3', margin: [0, 10, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Technician Report', fontSize: 11, margin: [0, 10, 0, 0] }, { width: '10%', text: '4', margin: [0, 10, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Moisture Reading', fontSize: 11, margin: [0, 10, 0, 0] }, { width: '10%', text: '5', margin: [0, 10, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Category', fontSize: 11, margin: [0, 10, 0, 0] }, { width: '10%', text: '6', margin: [0, 10, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Equipment used in the Water Damage Restoration Services provided', fontSize: 11, margin: [0, 10, 0, 30] }, { width: '10%', text: '6', margin: [0, 10, 0, 0] }] },
                    {
                        columns: [{

                                width: '90%',
                                text: 'PHOTOS & SKETCHES',

                            },
                            {
                                width: '10%',
                                text: '#',
                            }
                        ]
                    },
                    {
                        margin: [0, 0, 0, 20],
                        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 480 - 10, y2: 0, lineWidth: 1 }]
                    },
                    { columns: [{ width: '90%', text: ' Uploaded Images', fontSize: 11, margin: [0, 0, 0, 0] }, { width: '10%', text: '7', margin: [0, 0, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Uploaded Sketches', fontSize: 11, margin: [0, 10, 0, 0] }, { width: '10%', text: '8', margin: [0, 10, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Travel Hours ', fontSize: 11, margin: [0, 10, 0, 0] }, { width: '10%', text: '9', margin: [0, 10, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Customer Survey ', fontSize: 11, margin: [0, 10, 0, 0] }, { width: '10%', text: '9', margin: [0, 10, 0, 0] }] },

                    { text: '', pageBreak: "before", margin: [0, 10, 0, 0] },
                    // {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 3,color:'#6a1b9a' }]},
                    { text: '\n REPORT DETAILS', bold: true, alignment: 'center', fontSize: 18 },
                    { text: 'Report Date: ' + moment(data.created_at).format('MMMM DD, YYYY'), margin: [0, 10, 0, 30], bold: true, alignment: 'center', fontSize: 12 },
                    {
                        columns: [{
                                width: '50%',
                                text: 'Report ID',
                                bold: true,
                                fontSize: 12
                            },
                            {
                                width: '50%',
                                text: 'Report Date',
                                bold: true,
                                fontSize: 12
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '50%',
                                text: data.claim_no + '\n\n'
                            },
                            {
                                width: '50%',
                                text: moment(data.claim_date).format('MMMM DD, YYYY') + '\n\n'
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '50%',
                                text: 'Address',
                                bold: true,
                                fontSize: 12
                            },
                            {
                                width: '50%',
                                text: 'Policyholder',
                                bold: true,
                                fontSize: 12
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '50%',
                                text: data.street_address + '\n\n'
                            },
                            {
                                width: '50%',
                                text: data.client_email + '\n\n'
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '50%',
                                text: 'Insurance Company',
                                bold: true,
                                fontSize: 12
                            },
                            {
                                width: '50%',
                                text: 'Policy Number',
                                bold: true,
                                fontSize: 12
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '50%',
                                text: data.insurence_company
                            },
                            {
                                width: '50%',
                                text: 'PNR' + data.claim_no + '\n'
                            }
                        ]
                    },
                    { text: '', margin: [0, 30, 0, 0] },
                    {
                        margin: [0, 0, 0, 20],
                        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 480 - 10, y2: 0, lineWidth: 1 }]
                    },
                    //  {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 3,color:'#6a1b9a' }]},
                    //{text:'Details of Work Carried Out\n\n',bold:true, alignment: 'center', color:'#1b4d98', fontSize: 25},
                    { text: 'DETAILS OF WORK CARRIED OUT \n\n', margin: [0, 40, 0, 0], bold: true, alignment: 'center', fontSize: 16 },
                    data.workdetails,




                    { text: 'TECHNICIAN REPORT  ', bold: true, alignment: 'center', fontSize: 16, margin: [0, 20, 0, 30], pageBreak: "before" },
                    {
                        margin: [0, 10, 0, 10],
                        // layout: 'lightHorizontalLines',
                        table: {
                            widths: [300, '*'],
                            body: [
                                [{ text: 'Survey Completed By', fillColor: '#f5f5f5', bold: true }, 'EMPN'],
                                [{ text: 'Date', fillColor: '#f5f5f5', bold: true }, data.claim_date],
                                [{ text: 'Time', fillColor: '#f5f5f5', bold: true }, data.claim_time],
                                [{ text: 'Insurance Company', fillColor: '#f5f5f5', bold: true }, data.insurence_company],
                                [{ text: 'Report No', fillColor: '#f5f5f5', bold: true }, data.claim_no],
                                //  [{ text: 'Claim Excess Payble', fillColor: '#f5f5f5', bold: true }, data.claim_ex_pay],
                                [{ text: 'Site Contact', fillColor: '#f5f5f5', bold: true }, data.site_contact],
                                [{ text: 'Address', fillColor: '#f5f5f5', bold: true }, data.street_address],
                                //  [{text:'State',style: 'tablesubitem'},data.state],
                                // [{text:'Post Code',style: 'tablesubitem'},data.post_code],
                                [{ text: 'Contact no 1', fillColor: '#f5f5f5', bold: true }, data.contact_no_1],
                                [{ text: 'Contact no 2', fillColor: '#f5f5f5', bold: true }, data.contact_no_2 ? data.contact_no_2 : ''],
                                [{ text: 'Date Incident Occurred', fillColor: '#f5f5f5', bold: true }, data.date_incident_occured],
                                [{ text: 'Time Incident Occurred', fillColor: '#f5f5f5', bold: true }, data.time_incident_occured],
                                [{ text: 'Type of Flooring', fillColor: '#f5f5f5', bold: true }, data.floor_type],
                                [{ text: 'Floor Age', fillColor: '#f5f5f5', bold: true }, data.floor_age]
                            ]
                        },
                        layout: {
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? '#eee' : 'white';
                            },
                            paddingTop: function(i, node) { return 10; },
                            paddingBottom: function(i, node) { return 10; },

                        }

                    },

                    {

                        text: "\n\n Rooms and areas affected",
                        pageBreak: "before",
                        bold: true,
                        alignment: 'center',
                        fontSize: 14,
                        margin: [0, 0, 0, 30],
                    },

                    {
                        // style: 'tableExample',
                        table: {
                            widths: [100, 100, 100, '*'],
                            body: raaBodydata
                        },
                        layout: {
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? '#eee' : '#ccc';
                            },
                            paddingTop: function(i, node) { return 10; },
                            paddingBottom: function(i, node) { return 10; },

                        }
                    },

                    {

                        text: "\n\n MOISTURE READING",
                        pageBreak: "before",
                        bold: true,
                        alignment: 'center',
                        fontSize: 14,
                        margin: [0, 0, 0, 30],
                    },

                    {
                        // style: 'tableExample',
                        table: {
                            widths: [100, 100, 100, 120, '*'],
                            body: bodydata
                        },
                        layout: {
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? '#eee' : '#ccc';
                            },
                            paddingTop: function(i, node) { return 10; },
                            paddingBottom: function(i, node) { return 10; },

                        }
                    },
                    {
                        bold: true,
                        alignment: 'center',
                        fontSize: 16,
                        text: "\n\n CATEGORY",
                        pageBreak: "before",
                        margin: [0, 0, 0, 30],
                    },
                    {

                        table: {
                            widths: [160, 80, 80, 80, '*'],
                            body: [
                                [{ text: 'Category of Water Damage', fillColor: '#f5f5f5', bold: true }, 'Clean', 'Grey', 'Black', 'Contaminated'],
                                cat_dmg, [{ text: 'Classification of Loss', fillColor: '#f5f5f5', bold: true }, 'Class 1', 'Class 2', 'Class 3', 'Class 4'],
                                loss_arr, [{ text: 'Cause of damage', fillColor: '#f5f5f5', bold: true }, { text: data.cause_of_damage, colSpan: 4 }],
                                [{ text: 'Areas Affected', fillColor: '#f5f5f5', bold: true }, { text: data.area_affected, colSpan: 4 }],
                                [{ text: 'Notes', fillColor: '#f5f5f5', bold: true }, { text: data.notes, colSpan: 4 }]
                            ]
                        },
                        layout: {
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? '#eee' : '#ccc';
                            },
                            paddingTop: function(i, node) { return 10; },
                            paddingBottom: function(i, node) { return 10; },

                        }
                    },
                    {
                        text: '\n\n\n\nEquipment used in the Water Damage Restoration Services provided',
                        bold: true,
                        alignment: 'center',
                        fontSize: 14,
                        margin: [0, 0, 0, 20]
                            //  pageBreak: "before"
                    },
                    {
                        margin: [0, 20, 0, 10],
                        table: {

                            widths: [100, 50, '*'],
                            body: equip_data
                        },
                        layout: {
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? '#eee' : '#ccc';
                            },
                            paddingTop: function(i, node) { return 10; },
                            paddingBottom: function(i, node) { return 10; },

                        }
                    },
                    // {text:'',pageBreak: "before", margin: [0, 50, 0, 10]},

                    { text: '\n\n UPLOAD IMAGES', pageBreak: "before", margin: [0, 0, 0, 30], bold: true, alignment: 'center', fontSize: 16 },
                    base64images.photo,
                    { text: '\n\n UPLOAD SKETCHES', pageBreak: "before", margin: [0, 0, 0, 30], bold: true, alignment: 'center', fontSize: 16 },
                    base64images.sketch,
                    { text: '\n\n TRAVEL HOURS ', bold: true, pageBreak: "before", alignment: 'center', margin: [0, 0, 0, 30], fontSize: 16 },

                    { text: setData.companyName.toUpperCase() + '\n\n', bold: true, alignment: 'center', margin: [0, 50, 0, 10], },
                    { text: 'JOB COMPLETION – CUSTOMER SURVEY\n\n\n \n \n ', bold: true, alignment: 'center', },
                    //  { text: 'Please PRINT NAME / Client to Sign\n', alignment:'left',},

                    `   \n\n              
              This is to certify that works carried out by ` + setData.companyName.toUpperCase() + ` at the above listed property have been carried out in a professional manner and have been completed to the satisfaction of the insured.
              `

                ],

                // Style dictionary
                styles: {
                    headline: { fontSize: 25, bold: true },
                    listItem: { fontSize: 14 },
                    listLabel: { bold: true },
                    subheader: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 10, 0, 5],

                    },
                    tablesubitem: {
                        fontSize: 12,
                        bold: true,
                        //  decoration: 'underline',
                        //  italics:true
                    },
                    listText: { italic: true },
                    tableExample: {
                        margin: [0, 5, 0, 15]
                    },
                }
            };
        }
        if (setData.invoice_template == 3) {
            var equip_headerR = [{ text: 'Equipment', fillColor: '#f5f5f5', bold: true }, { text: 'Serial No', style: 'tablesubitem' }, 'Days'];
            var equipment_info = data.equipment_info;
            var equip_data = [];
            equip_data.push(equip_headerR);

            for (var i = 0; i < equipment_info.length; i++) {
                datarow = [];
                datarow.push({ text: equipment_info[i].equipment, style: 'tablesubitem' });
                datarow.push(equipment_info[i].euip_serial_no);

                datarow.push((equipment_info[i].quip_day_1) ? equipment_info[i].quip_day_1 : '');
                // datarow.push((parseInt(equipment_info[i].quip_day_2) ? 'X' : ''));
                // datarow.push((parseInt(equipment_info[i].quip_day_3) ? 'X' : ''));
                // datarow.push((parseInt(equipment_info[i].quip_day_4) ? 'X' : ''));
                // datarow.push((parseInt(equipment_info[i].quip_day_5) ? 'X' : ''));
                // datarow.push((parseInt(equipment_info[i].quip_day_6) ? 'X' : ''));
                // datarow.push((parseInt(equipment_info[i].quip_day_7) ? 'X' : ''));
                equip_data.push(datarow);
            }
            var docDefinition = {
                pageSize: 'A4',

                footer: function(currentPage, pageCount) {
                    if (currentPage != 1) {
                        // return [
                        //     // { text: 'Mobile: '+setData.contactNo+', Email: '+setData.email, alignment: 'center', color:'#1b4d98' },
                        //     { text: currentPage.toString() + ' of ' + pageCount, alignment: 'right', italics: true, margin: 10 },
                        // ]
                        return [

                            {

                                columns: [{

                                        text: 'Powered by Gway',
                                        width: '50%',
                                        italics: true,
                                        margin: 10,
                                        alignment: 'left'


                                    },

                                    {

                                        text: currentPage.toString() + ' of ' + pageCount,
                                        alignment: 'right',
                                        italics: true,
                                        margin: 10,
                                        width: '50%',




                                    },


                                ]
                            }


                        ]
                    } else {
                        return '';
                    }
                },

                // header: function (currentPage, pageCount, pageSize) {
                //     return [
                //         { text: 'National Restoration Network Pvt. Ltd.', alignment: 'center' },
                //         { text: 'ACN: 35 632 764 660 <br> Mobile: 04325 10 325',  },
                //         { text: 'Mobile: 04325 10 325 ',  },
                //         { text: 'Info@nationalrestorationnetwork.com.au', }

                //     ]
                // },
                pageMargins: [30, 100, 60, 30],
                header: function(page) {

                    return [

                        {

                            text: 'WATER DAMAGE RESTORATION REPORT',
                            alignment: 'center',
                            margin: [5, 10, 0, 2],


                        }

                    ]

                },
                // Content with styles
                background: function(currentPage, pageSize) {

                    // return `page ${currentPage} with size ${pageSize.width} x ${pageSize.height}`
                },
                content: [{
                        columns: [{
                            margin: [0, 200, 0, 0],
                            width: '100%',
                            text: 'Complete reportings of restoration work completed at ' + setData.companyName,
                            bold: true,
                            fontSize: 16,
                            alignment: 'center',
                            italics: true,
                        }]
                    },
                    {
                        columns: [{
                            margin: [0, 50, 0, 0],
                            width: '100%',
                            text: setData.companyName + ' \n ACN: ' + setData.ACN,
                            bold: true,
                            fontSize: 18,
                            alignment: 'center',
                            italics: true,
                            color: '#777879'
                        }]
                    },

                    { text: '\n\n TABLE OF CONTENTS ', pageBreak: "before", margin: [0, 30, 0, 20], bold: true, alignment: 'center', fontSize: 16 },

                    {
                        columns: [{
                                width: '90%',
                                text: 'REPORT',

                            },
                            {
                                width: '10%',
                                text: '#',
                            }
                        ]
                    },
                    {
                        margin: [0, 0, 0, 30],
                        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 480 - 10, y2: 0, lineWidth: 1 }]
                    },
                    { columns: [{ width: '90%', text: 'Report Details', fontSize: 11, margin: [0, 0, 0, 0] }, { width: '10%', text: '3', margin: [0, 0, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Details of Work Carried Out', fontSize: 11, margin: [0, 10, 0, 0] }, { width: '10%', text: '3', margin: [0, 10, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Technician Report', fontSize: 11, margin: [0, 10, 0, 0] }, { width: '10%', text: '4', margin: [0, 10, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Moisture Reading', fontSize: 11, margin: [0, 10, 0, 0] }, { width: '10%', text: '5', margin: [0, 10, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Category', fontSize: 11, margin: [0, 10, 0, 0] }, { width: '10%', text: '6', margin: [0, 10, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Equipment used in the Water Damage Restoration Services provided', fontSize: 11, margin: [0, 10, 0, 30] }, { width: '10%', text: '6', margin: [0, 10, 0, 0] }] },
                    {
                        columns: [{

                                width: '90%',
                                text: 'PHOTOS & SKETCHES',

                            },
                            {
                                width: '10%',
                                text: '#',
                            }
                        ]
                    },
                    {
                        margin: [0, 0, 0, 20],
                        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 480 - 10, y2: 0, lineWidth: 1 }]
                    },
                    { columns: [{ width: '90%', text: ' Uploaded Images', fontSize: 11, margin: [0, 0, 0, 0] }, { width: '10%', text: '7', margin: [0, 0, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Uploaded Sketches', fontSize: 11, margin: [0, 10, 0, 0] }, { width: '10%', text: '8', margin: [0, 10, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Travel Hours ', fontSize: 11, margin: [0, 10, 0, 0] }, { width: '10%', text: '9', margin: [0, 10, 0, 0] }] },
                    { columns: [{ width: '90%', text: 'Customer Survey ', fontSize: 11, margin: [0, 10, 0, 0] }, { width: '10%', text: '9', margin: [0, 10, 0, 0] }] },

                    { text: '', pageBreak: "before", margin: [0, 10, 0, 0] },
                    // {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 3,color:'#6a1b9a' }]},
                    { text: '\n REPORT DETAILS', bold: true, alignment: 'center', fontSize: 18 },
                    { text: 'Report Date: ' + moment(data.created_at).format('MMMM DD, YYYY'), margin: [0, 10, 0, 30], bold: true, alignment: 'center', fontSize: 12 },
                    {
                        columns: [{
                                width: '50%',
                                text: 'Report ID',
                                bold: true,
                                fontSize: 12
                            },
                            {
                                width: '50%',
                                text: 'Report Date',
                                bold: true,
                                fontSize: 12
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '50%',
                                text: data.claim_no + '\n\n'
                            },
                            {
                                width: '50%',
                                text: moment(data.claim_date).format('MMMM DD, YYYY') + '\n\n'
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '50%',
                                text: 'Address',
                                bold: true,
                                fontSize: 12
                            },
                            {
                                width: '50%',
                                text: 'Policyholder',
                                bold: true,
                                fontSize: 12
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '50%',
                                text: data.street_address + '\n\n'
                            },
                            {
                                width: '50%',
                                text: data.client_email + '\n\n'
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '50%',
                                text: 'Insurance Company',
                                bold: true,
                                fontSize: 12
                            },
                            {
                                width: '50%',
                                text: 'Policy Number',
                                bold: true,
                                fontSize: 12
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '50%',
                                text: data.insurence_company
                            },
                            {
                                width: '50%',
                                text: 'PNR' + data.claim_no + '\n'
                            }
                        ]
                    },
                    { text: '', margin: [0, 30, 0, 0] },
                    {
                        margin: [0, 0, 0, 20],
                        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 480 - 10, y2: 0, lineWidth: 1 }]
                    },
                    //  {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 3,color:'#6a1b9a' }]},
                    //{text:'Details of Work Carried Out\n\n',bold:true, alignment: 'center', color:'#1b4d98', fontSize: 25},
                    { text: 'DETAILS OF WORK CARRIED OUT \n\n', margin: [0, 40, 0, 0], bold: true, alignment: 'center', fontSize: 16 },
                    data.workdetails,




                    { text: 'TECHNICIAN REPORT  ', bold: true, alignment: 'center', fontSize: 16, margin: [0, 20, 0, 30], pageBreak: "before" },
                    {
                        margin: [0, 10, 0, 10],
                        // layout: 'lightHorizontalLines',
                        table: {
                            widths: [300, '*'],
                            body: [
                                [{ text: 'Survey Completed By', fillColor: '#f5f5f5', bold: true }, 'EMPN'],
                                [{ text: 'Date', fillColor: '#f5f5f5', bold: true }, data.claim_date],
                                [{ text: 'Time', fillColor: '#f5f5f5', bold: true }, data.claim_time],
                                [{ text: 'Insurance Company', fillColor: '#f5f5f5', bold: true }, data.insurence_company],
                                [{ text: 'Report No', fillColor: '#f5f5f5', bold: true }, data.claim_no],
                                //  [{ text: 'Claim Excess Payble', fillColor: '#f5f5f5', bold: true }, data.claim_ex_pay],
                                [{ text: 'Site Contact', fillColor: '#f5f5f5', bold: true }, data.site_contact],
                                [{ text: 'Address', fillColor: '#f5f5f5', bold: true }, data.street_address],
                                //  [{text:'State',style: 'tablesubitem'},data.state],
                                // [{text:'Post Code',style: 'tablesubitem'},data.post_code],
                                [{ text: 'Contact no 1', fillColor: '#f5f5f5', bold: true }, data.contact_no_1],
                                [{ text: 'Contact no 2', fillColor: '#f5f5f5', bold: true }, data.contact_no_2 ? data.contact_no_2 : ''],
                                [{ text: 'Date Incident Occurred', fillColor: '#f5f5f5', bold: true }, data.date_incident_occured],
                                [{ text: 'Time Incident Occurred', fillColor: '#f5f5f5', bold: true }, data.time_incident_occured],
                                [{ text: 'Type of Flooring', fillColor: '#f5f5f5', bold: true }, data.floor_type],
                                [{ text: 'Floor Age', fillColor: '#f5f5f5', bold: true }, data.floor_age]
                            ]
                        },
                        layout: {
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? '#eee' : 'white';
                            },
                            paddingTop: function(i, node) { return 10; },
                            paddingBottom: function(i, node) { return 10; },

                        }

                    },
                    {

                        text: "\n\n ROOM AND AREAS AFFECTED ",
                        pageBreak: "before",
                        bold: true,
                        alignment: 'center',
                        fontSize: 14,
                        margin: [0, 0, 0, 30],
                    },

                    {
                        // style: 'tableExample',
                        table: {
                            widths: [100, 100, '*', '*'],
                            body: raaBodydata
                        },
                        layout: {
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? '#eee' : '#ccc';
                            },
                            paddingTop: function(i, node) { return 10; },
                            paddingBottom: function(i, node) { return 10; },

                        }
                    },
                    {

                        text: "\n\n MOISTURE READING",
                        bold: true,
                        alignment: 'center',
                        fontSize: 14,
                        margin: [0, 0, 0, 30],
                    },
                    {
                        // style: 'tableExample',
                        table: {
                            widths: [100, 100, 100, 120, '*'],
                            body: bodydata
                        },
                        layout: {
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? '#eee' : '#ccc';
                            },
                            paddingTop: function(i, node) { return 10; },
                            paddingBottom: function(i, node) { return 10; },

                        }
                    },
                    {
                        bold: true,
                        alignment: 'center',
                        fontSize: 16,
                        text: "\n\n CATEGORY",
                        pageBreak: "before",
                        margin: [0, 0, 0, 30],
                    },
                    {

                        table: {
                            widths: [160, 80, 80, 80, '*'],
                            body: [
                                [{ text: 'Category of Water Damage', fillColor: '#f5f5f5', bold: true }, 'Clean', 'Grey', 'Black', 'Contaminated'],
                                cat_dmg, [{ text: 'Classification of Loss', fillColor: '#f5f5f5', bold: true }, 'Class 1', 'Class 2', 'Class 3', 'Class 4'],
                                loss_arr, [{ text: 'Cause of damage', fillColor: '#f5f5f5', bold: true }, { text: data.cause_of_damage, colSpan: 4 }],
                                [{ text: 'Areas Affected', fillColor: '#f5f5f5', bold: true }, { text: data.area_affected, colSpan: 4 }],
                                [{ text: 'Notes', fillColor: '#f5f5f5', bold: true }, { text: data.notes, colSpan: 4 }]
                            ]
                        },
                        layout: {
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? '#eee' : '#ccc';
                            },
                            paddingTop: function(i, node) { return 10; },
                            paddingBottom: function(i, node) { return 10; },

                        }
                    },
                    {
                        text: '\n\n\n\nEquipment used in the Water Damage Restoration Services provided',
                        bold: true,
                        alignment: 'center',
                        fontSize: 14,
                        margin: [0, 0, 0, 20]
                            //  pageBreak: "before"
                    },
                    {
                        margin: [0, 20, 0, 10],
                        table: {

                            widths: [100, 50, '*'],
                            body: equip_data
                        },
                        layout: {
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? '#eee' : '#ccc';
                            },
                            paddingTop: function(i, node) { return 10; },
                            paddingBottom: function(i, node) { return 10; },

                        }
                    },
                    // {text:'',pageBreak: "before", margin: [0, 50, 0, 10]},

                    { text: '\n\n UPLOAD IMAGES', pageBreak: "before", margin: [0, 0, 0, 30], bold: true, alignment: 'center', fontSize: 16 },
                    base64images.photo,
                    { text: '\n\n UPLOAD SKETCHES', pageBreak: "before", margin: [0, 0, 0, 30], bold: true, alignment: 'center', fontSize: 16 },
                    base64images.sketch,
                    { text: '\n\n TRAVEL HOURS ', bold: true, pageBreak: "before", alignment: 'center', margin: [0, 0, 0, 30], fontSize: 16 },

                    { text: setData.companyName.toUpperCase() + '\n\n', bold: true, alignment: 'center', margin: [0, 50, 0, 10], },
                    { text: 'JOB COMPLETION – CUSTOMER SURVEY\n\n\n \n \n ', bold: true, alignment: 'center', },
                    //  { text: 'Please PRINT NAME / Client to Sign\n', alignment:'left',},

                    `   \n\n              
              This is to certify that works carried out by ` + setData.companyName.toUpperCase() + ` at the above listed property have been carried out in a professional manner and have been completed to the satisfaction of the insured.
              `,
                    { text: '\n\n   END REPORT ', bold: true, alignment: 'center', margin: [0, 30, 0, 0], fontSize: 16 },


                ],

                // Style dictionary
                styles: {
                    headline: { fontSize: 25, bold: true },
                    listItem: { fontSize: 14 },
                    listLabel: { bold: true },
                    subheader: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 10, 0, 5],

                    },
                    tablesubitem: {
                        fontSize: 12,
                        bold: true,
                        //  decoration: 'underline',
                        //  italics:true
                    },
                    listText: { italic: true },
                    tableExample: {
                        margin: [0, 5, 0, 15]
                    },
                }
            };
        } else {

            var trvArray = [];
            trvArray.push([{ text: 'Date', color: '#c8aa76' }, { text: 'Time Onsite', color: '#c8aa76' }, { text: 'Time Offsite', color: '#c8aa76' }, { text: 'Travel Hours', color: '#c8aa76' }]);
            travelhours.forEach(function(value) {
                trvArray.push([{ text: value.travel_date, color: '#c8aa76' }, { text: value.time_onsite, color: '#c8aa76' }, { text: value.time_offsite, color: '#c8aa76' }, { text: value.travel_hours, color: '#c8aa76' }]);
            });


            var equip_headerR = [{ text: 'Equipment', color: '#c8aa76', bold: true }, { text: 'Serial No', color: '#c8aa76', bold: true }, { text: 'Days', color: '#c8aa76', bold: true }];
            var equipment_info = data.equipment_info;
            var equip_data = [];
            equip_data.push(equip_headerR);

            for (var i = 0; i < equipment_info.length; i++) {
                datarow = [];
                datarow.push({ text: equipment_info[i].equipment, style: 'tablesubitem' });
                datarow.push(equipment_info[i].euip_serial_no);

                datarow.push((equipment_info[i].quip_day_1) ? equipment_info[i].quip_day_1 : '');
                equip_data.push(datarow);
            }

            var photoimages = {}
            if (base64images.photo.length > 0) {

                photoimages = { text: '\n\n IMAGES & SKETCHES', pageBreak: "before", alignment: 'left', fontSize: 14, color: '#c8aa76', margin: [40, -60, 0, 20] }

            }
            var sketimages = {};
            if (base64images.sketch.length > 0) {
                sketimages = { text: '\n\n IMAGES & SKETCHES', pageBreak: "before", alignment: 'left', fontSize: 14, color: '#c8aa76', margin: [40, -60, 0, 20] }
            }
            var docDefinition = {
                pageSize: 'A4',

                footer: function(currentPage, pageCount) {

                    if (currentPage != 1) {
                        // return [
                        //     // { text: 'Mobile: '+setData.contactNo+', Email: '+setData.email, alignment: 'center', color:'#1b4d98' },
                        //     { text: currentPage.toString() + ' of ' + pageCount, alignment: 'right', italics: true, margin: 10 },
                        // ]
                        return [

                            {

                                columns: [{

                                        text: 'Powered by Gway',
                                        width: '50%',
                                        italics: true,
                                        margin: 10,
                                        alignment: 'left'


                                    },

                                    {

                                        text: '',
                                        //text: currentPage.toString() + ' of ' + pageCount,
                                        alignment: 'right',
                                        italics: true,
                                        margin: 10,
                                        width: '50%',




                                    },


                                ]
                            }


                        ]
                    } else {
                        return '';
                    }
                },

                // header: function (currentPage, pageCount, pageSize) {
                //     return [
                //         { text: 'National Restoration Network Pvt. Ltd.', alignment: 'center' },
                //         { text: 'ACN: 35 632 764 660 <br> Mobile: 04325 10 325',  },
                //         { text: 'Mobile: 04325 10 325 ',  },
                //         { text: 'Info@nationalrestorationnetwork.com.au', }

                //     ]
                // },
                pageMargins: [30, 100, 60, 30],
                header: function(page) {
                    if (page > 2) {
                        return [

                            {

                                columns: [{

                                        text: '',
                                        width: '50%',
                                        alignment: 'left',
                                        margin: [0, 0, 0, 0],
                                    },

                                    {

                                        text: 'PAGE ' + page,
                                        width: '50%',
                                        alignment: 'right',
                                        color: '#000',
                                        fontSize: 8,
                                        margin: [10, 40, 50, 2],


                                    },

                                ]
                            },


                        ]
                    } else {
                        return '';
                    }
                },
                // Content with styles
                background: function(currentPage, pageSize) {


                    if (currentPage === 1) {
                        return {
                            image: backImageForPDF1(),
                            fit: [840, 895]


                        }
                    } else if (currentPage === 2) {
                        return {
                            image: backImageForPDF21(),
                            fit: [840, 840]

                        }
                    } else if (currentPage === 3) {
                        return {
                            image: backImageForPDF13(),
                            fit: [840, 897],
                            margin: [-45, 15, 0, 20],

                            // fit: [70]

                        }
                    } else if (currentPage === 6) {
                        return {
                            image: backImageForPDF6(),
                            fit: [840, 905],
                            margin: [-53, 0, 0, 20],
                            //  absolutePosition: { x: 0, y: 391 },
                            // fit: [70]

                        }
                    } else if (currentPage === 8) {
                        return {
                            image: backImageForPDF8(),
                            fit: [840, 905],
                            margin: [-45, 0, 0, 20],
                            //  absolutePosition: { x: 0, y: 391 },
                            // fit: [70]

                        }
                    } else if (currentPage == (parseInt(lastpage) + 9)) {
                        return {
                            image: backImageForPDFLast(),
                            fit: [840, 905],
                            margin: [-45, 0, 0, 20],
                            // absolutePosition: { x: 0, y: 533 },
                            // fit: [70]

                        }
                    } else {
                        return {
                            image: backImageForHeader(),
                            fit: [550, 100],
                            margin: [-45, 0, 0, 20],


                        }
                    }
                    // return `page ${currentPage} with size ${pageSize.width} x ${pageSize.height}`
                },
                content: [
                    { text: 'Water Damage Restoration Report', margin: [-10, 280, 0, 0], bold: true, alignment: 'center', fontSize: 20, color: '#ffffff' },

                    { text: data.primary_job_address, margin: [-10, 20, 0, 0], bold: false, alignment: 'center', fontSize: 14, color: '#ffffff' },
                    { text: moment(data.created_at).format('MMMM DD, YYYY'), margin: [-10, 20, 0, 0], color: '#fff', fontSize: 14, alignment: 'center' },
                    {

                        columns: [{
                            margin: [0, 300, 0, 0],
                            width: '80%',
                            text: setData.companyName,
                            color: '#000000',
                            fontSize: 18,
                            bold: false,
                            alignment: 'left',


                        }, {
                            width: '20%',
                            margin: [0, 200, 0, 0],
                            image: setData.iconImg,
                            fit: [90, 90],
                            // heigt: 120,

                            alignment: 'right'
                        }]
                    },



                    { text: '', pageBreak: "before", margin: [0, 30, 0, 20], bold: true, alignment: 'center', fontSize: 16 },




                    { text: '', pageBreak: "before", margin: [0, 10, 0, 0] },
                    // {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 3,color:'#6a1b9a' }]},
                    { text: '\n PREFACE & CONTEXT \n', alignment: 'left', fontSize: 18, color: '#c8aa76' },
                    { text: 'Report Content \n', bold: true, alignment: 'left', fontSize: 12, margin: [0, 50, 0, 20], color: '#c8aa76' },
                    { text: 'This report, which can be cited as Water Damage Report No.' + data.claim_no + ' ' + data.street_address + ' compiles information concerning Water Damage Restoration services that ' + setData.companyName + ' supplied to the Client from ' + moment(data.claim_date).format('DD MMMM, YYYY') + ' – ' + moment(data.date_incident_occured).format('DD MMMM, YYYY') + ' at the address ' + data.street_address + '.\n This report was complied with the assistance of the technician ' + techdata.profile.name + ' and ' + setData.companyName + '.', alignment: 'left', fontSize: 10, margin: [0, -20, 150, 10] },

                    { text: setData.companyName, alignment: 'left', fontSize: 16, color: '#c8aa76', margin: [0, 30, 0, 0] },
                    { text: setData.email, alignment: 'left', fontSize: 16, color: '#c8aa76', margin: [0, 30, 0, 0] },
                    { text: setData.website + '\n', alignment: 'left', fontSize: 16, color: '#c8aa76', margin: [0, 30, 0, 50] },
                    {
                        columns: [{
                                width: '5%',
                                text: 'Ph: '
                            },
                            {
                                width: '95%',
                                text: setData.contactNo,
                                alignment: 'left',
                                color: '#c8aa76',
                                margin: [0, 0, 0, 30]
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '5%',
                                text: 'Fax: '
                            },
                            {
                                width: '95%',
                                text: setData.contactNo,
                                alignment: 'left',
                                color: '#c8aa76',
                                margin: [0, 0, 0, 30]
                            }
                        ]
                    },
                    { text: 'JOB DETAILS', pageBreak: "before", alignment: 'left', fontSize: 14, bold: true, color: '#c8aa76', margin: [0, -30, 0, 0] },
                    { text: 'JOB PARTICULARS', alignment: 'left', fontSize: 14, color: '#c8aa76', margin: [0, 50, 0, 50] },
                    {
                        columns: [{
                                width: '50%',
                                fontSize: 10,
                                text: 'Location',
                                color: '#c8aa76'
                            },
                            {
                                width: '50%',
                                fontSize: 10,
                                text: 'Dates & Times',
                                color: '#c8aa76'
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '50%',
                                margin: [0, 2, 0, 0],
                                text: data.primary_job_address,
                                fontSize: 8
                            },
                            {
                                width: '50%',
                                margin: [0, 2, 0, 0],
                                text: moment(data.created_at).format('MMMM DD, YYYY'),
                                fontSize: 8
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '50%',
                                fontSize: 10,
                                margin: [0, 30, 0, 0],
                                text: 'Site Contact',
                                color: '#c8aa76'
                            },
                            {
                                width: '50%',
                                fontSize: 10,
                                margin: [0, 30, 0, 0],
                                text: 'Accounts Information',
                                color: '#c8aa76'
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '50%',
                                margin: [0, 2, 0, 0],
                                text: data.contact_no_1 + '\n' + 'Ph:' + data.contact_no_2 + ',' + data.contact_no_3 + '\n Email:' + data.client_email + '\n',
                                fontSize: 8
                            },
                            {
                                width: '50%',
                                margin: [0, 2, 0, 0],
                                text: data.client_buninessname + '\n' + data.billing_address,
                                fontSize: 8
                            }
                        ]
                    },
                    // {
                    //     columns: [{
                    //             width: '50%',
                    //             fontSize: 10,
                    //             margin: [0, 30, 0, 0],
                    //             text: 'Accounts Information',
                    //             color: '#c8aa76'
                    //         },
                    //         {
                    //             width: '50%',
                    //             fontSize: 10,
                    //             margin: [0, 30, 0, 0],
                    //             text: 'Existing Flooring',
                    //             color: '#c8aa76'
                    //         }
                    //     ]
                    // },
                    // {
                    //     columns: [{
                    //             width: '50%',
                    //             margin: [0, 2, 0, 0],
                    //             text: data.street_address,
                    //             fontSize: 8
                    //         },
                    //         {
                    //             width: '50%',
                    //             margin: [0, 2, 0, 0],
                    //             text: moment(data.created_at).format('MMMM DD, YYYY'),
                    //             fontSize: 8
                    //         }
                    //     ]
                    // },
                    {
                        columns: [{
                                width: '50%',
                                fontSize: 10,
                                margin: [0, 30, 0, 0],
                                text: 'Survey Completed By',
                                color: '#c8aa76'
                            },
                            {
                                width: '50%',
                                fontSize: 10,
                                margin: [0, 30, 0, 0],
                                text: '',
                                // text: 'Client Authorisation Agreement',
                                color: '#c8aa76'
                            }
                        ]
                    },
                    {
                        columns: [{
                                width: '50%',
                                margin: [0, 2, 0, 0],
                                text: techdata.profile.name,
                                fontSize: 8
                            },
                            {
                                width: '50%',
                                margin: [0, 2, 0, 0],
                                text: '',
                                fontSize: 8
                            }
                        ]
                    },
                    { text: 'REPORT DETAILS', alignment: 'left', fontSize: 14, color: '#c8aa76', margin: [0, 50, 0, 50] },
                    { text: 'Insurer: ' + '', alignment: 'left', fontSize: 12, color: '#c8aa76', margin: [0, 10, 0, 2] },
                    {
                        ul: [
                            { text: 'Report ID: ' + data.claim_no, fontSize: 8, margin: [0, 5, 0, 0] },
                            { text: 'Report Date: ' + moment(data.claim_date).format('MMMM DD, YYYY'), fontSize: 8, margin: [0, 5, 0, 0] },
                            { text: 'Policy Number: ' + data.claim_no, fontSize: 8, margin: [0, 5, 0, 0] },
                            { text: 'Policyholder: ' + data.client_fullname, fontSize: 8, margin: [0, 5, 0, 0] },

                        ]
                    },
                    { text: 'ADDITIONAL TECHNICIAN/COMPANY NOTES', alignment: 'left', fontSize: 14, color: '#c8aa76', margin: [0, 40, 0, 10] },
                    {

                        fontSize: 10,
                        margin: [0, 30, 0, 0],
                        text: data.notes
                    },
                    { text: 'EXECUTED WORK', pageBreak: "before", bold: true, alignment: 'left', fontSize: 14, color: '#c8aa76', margin: [0, -30, 0, 0] },
                    { text: 'DAY BREAKDOWN', alignment: 'left', fontSize: 14, color: '#c8aa76', margin: [0, 50, 0, 50] },


                    data.workdetails,
                    { text: 'LABOUR & TRAVEL', alignment: 'left', fontSize: 14, color: '#c8aa76', margin: [0, 50, 0, 50] },

                    {
                        layout: 'lightHorizontalLines', // optional
                        table: {

                            widths: ['*', '*', '*', '*'],

                            body: trvArray
                        },
                        layout: {
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? '#eee' : '#ccc';
                            },
                            paddingTop: function(i, node) { return 10; },
                            paddingBottom: function(i, node) { return 10; },

                        }
                    },
                    { text: 'EXECUTED WORK', pageBreak: "before", alignment: 'left', bold: true, fontSize: 14, color: '#c8aa76', margin: [0, -25, 0, 0] },
                    {
                        text: 'EQUIPMENT UTILISED',
                        bold: true,
                        alignment: 'left',
                        fontSize: 14,
                        color: '#c8aa76',
                        margin: [0, 30, 0, 30]
                            //  pageBreak: "before"
                    },
                    {
                        margin: [0, 20, 0, 10],
                        table: {

                            widths: [200, 100, '*'],
                            body: equip_data
                        },
                        layout: {
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? '#eee' : '#ccc';
                            },
                            paddingTop: function(i, node) { return 10; },
                            paddingBottom: function(i, node) { return 10; },

                        }
                    },
                    { text: setData.companyName, alignment: 'right', fontSize: 16, color: '#ffffff', absolutePosition: { x: 12, y: 775 } },
                    { text: 'EXECUTED WORK', pageBreak: "before", alignment: 'left', bold: true, fontSize: 14, color: '#c8aa76', margin: [0, -30, 0, 0] },
                    {

                        text: "\n\n ROOM AND AREAS AFFECTED ",

                        color: '#c8aa76',
                        bold: true,
                        alignment: 'left',
                        fontSize: 16,
                        margin: [0, 0, 0, 30],
                    },

                    {
                        // style: 'tableExample',
                        table: {
                            widths: [100, 100, '*', '*'],
                            body: raaBodydata
                        },
                        layout: {
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? '#eee' : '#ccc';
                            },
                            paddingTop: function(i, node) { return 10; },
                            paddingBottom: function(i, node) { return 10; },

                        }
                    },
                    {

                        text: "\n\n MOISTURE READING",
                        color: '#c8aa76',
                        bold: true,
                        alignment: 'left',
                        fontSize: 16,
                        margin: [0, 0, 0, 30],
                    },
                    {
                        // style: 'tableExample',
                        table: {
                            widths: [100, 100, 100, 120, '*'],
                            body: bodydata
                        },
                        layout: {
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? '#eee' : '#ccc';
                            },
                            paddingTop: function(i, node) { return 10; },
                            paddingBottom: function(i, node) { return 10; },

                        }
                    },
                    {
                        bold: true,
                        alignment: 'left',
                        fontSize: 14,

                        color: '#c8aa76',
                        text: "\n\n CATEGORY OF WATER DAMAGE",
                        pageBreak: "before",
                        margin: [0, 0, 0, 30],
                    },
                    {

                        table: {
                            widths: [160, 80, 80, 80, '*'],
                            body: [
                                [{ text: 'Category of Water Damage', fillColor: '#c8aa76', color: '#ffffff', bold: true }, 'Clean', 'Grey', 'Black', 'Contaminated'],
                                cat_dmg, [{ text: 'Classification of Loss', fillColor: '#c8aa76', color: '#ffffff', bold: true }, 'Class 1', 'Class 2', 'Class 3', 'Class 4'],
                                loss_arr, [{ text: 'Cause of damage', fillColor: '#c8aa76', color: '#ffffff', bold: true }, { text: data.cause_of_damage, colSpan: 4 }],
                                [{ text: 'Areas Affected', fillColor: '#c8aa76', color: '#ffffff', bold: true }, { text: data.area_affected, colSpan: 4 }],
                                [{ text: 'Notes', fillColor: '#c8aa76', color: '#ffffff', bold: true }, { text: data.notes, colSpan: 4 }]
                            ]
                        },
                        layout: {
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? '#eee' : '#ccc';
                            },
                            paddingTop: function(i, node) { return 10; },
                            paddingBottom: function(i, node) { return 10; },

                        }
                    },

                    // {text:'',pageBreak: "before", margin: [0, 50, 0, 10]},

                    photoimages,
                    base64images.photo,
                    sketimages,
                    base64images.sketch,
                    { text: ' ', pageBreak: "before", bold: true, alignment: 'left', fontSize: 14, color: '#c8aa76', margin: [0, -28, 0, 0] },
                    // { text: '\n\n ACKNOWLEDGEMENT OF COMPLETION', alignment: 'left', margin: [0, 60, 0, 30], fontSize: 14, color: '#c8aa76' },

                    //{ text: '\n\n TRAVEL HOURS ', bold: true, pageBreak: "before", alignment: 'center', margin: [0, 0, 0, 30], fontSize: 16 },

                    //{ text: setData.companyName.toUpperCase() + '\n\n', bold: true, alignment: 'center', margin: [0, 50, 0, 10], },
                    // { text: 'JOB COMPLETION – CUSTOMER SURVEY\n\n\n \n \n ', bold: true, alignment: 'center', },
                    //  { text: 'Please PRINT NAME / Client to Sign\n', alignment:'left',},
                    // {
                    //     layout: 'lightHorizontalLines', // optional
                    //     table: {
                    //         widths: ['*', '*', ],

                    //         body: [

                    //             [{ text: 'Report Number', fillColor: '#f5f5f5', bold: true }, data.claim_no],
                    //             [{ text: 'Street Address', fillColor: '#f5f5f5', bold: true }, data.street_address],
                    //             [{ text: 'Contact Phone', fillColor: '#f5f5f5', bold: true }, data.contact_no_1],
                    //             [{ text: 'Technician Name', fillColor: '#f5f5f5', bold: true }, techdata.profile.name],
                    //             [{ text: 'Date', fillColor: '#f5f5f5', bold: true }, moment(data.date_incident_occured).format('MMMM DD, YYYY')],
                    //             [{ text: 'Time Onsite', fillColor: '#f5f5f5', bold: true }, data.time_incident_occured]
                    //         ]
                    //     },
                    //     layout: {
                    //         hLineColor: function(i, node) {
                    //             return (i === 0 || i === node.table.body.length) ? '#eee' : '#ccc';
                    //         },
                    //         vLineColor: function(i, node) {
                    //             return (i === 0 || i === node.table.widths.length) ? '#eee' : '#ccc';
                    //         },
                    //         paddingTop: function(i, node) { return 10; },
                    //         paddingBottom: function(i, node) { return 10; },

                    //     }
                    // },
                    //         `   \n\n              
                    //         The Water Damage Restoration works executed by ` + setData.companyName.toUpperCase() + ` at the property were carried out in a professional manner and completed to the satisfaction of the client. The Client assented to the terms and conditions set out in the Client Authorisation Agreement.                  
                    //   `,
                    // {
                    //     columns: [{
                    //             width: '25%',
                    //             fontSize: 10,
                    //             margin: [0, 30, 0, 0],
                    //             text: 'Signed: ',

                    //         },
                    //         {
                    //             width: '25%',
                    //             fontSize: 10,
                    //             margin: [0, 30, 0, 0],
                    //             text: '(technician/reporter)',

                    //         },
                    //         {
                    //             width: '25%',
                    //             fontSize: 10,
                    //             margin: [0, 30, 0, 0],
                    //             text: techdata.profile.name,

                    //         },
                    //         {
                    //             width: '25%',
                    //             fontSize: 10,
                    //             margin: [0, 30, 0, 0],
                    //             text: 'Dated: ' + moment(data.claim_date).format('DD MMMM, YYYY'),

                    //         }
                    //     ]
                    // },
                    { text: '\n\n T H A N K   Y O U   F O R   Y O U R   C U S T O M', alignment: 'center', margin: [0, 220, 0, 30], fontSize: 16, color: '#c8aa76' },

                ],

                // Style dictionary
                styles: {
                    headline: { fontSize: 25, bold: true },
                    listItem: { fontSize: 14 },
                    listLabel: { bold: true },
                    subheader: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 10, 0, 5],

                    },
                    tablesubitem: {
                        fontSize: 12,
                        bold: true,
                        //  decoration: 'underline',
                        //  italics:true
                    },
                    listText: { italic: true },
                    tableExample: {
                        margin: [0, 5, 0, 15]
                    },
                },
                defaultStyle: {
                    color: '#3C4858'
                }
            };

        }
        //  pdfMake.createPdf(docDefinition).open('export.pdf');
        pdfMake.createPdf(docDefinition).getBase64(function(encstring) {
            data = encstring;
            Loading.call('sendPdfToEmail', { pdfdata: data, email: email_id }, function(error, result) {
                // console.log(result);
                Loading.stop();
                if (error) {
                    Bert.alert(error, "danger", "growl-top-right");

                } else {
                    // Accounts.sendEnrollmentEmail(result,[emailVar])

                    Bert.alert("Successfull Sent", "success", "growl-top-right");



                }

            });
        });
        //pdfMake.createPdf(docDefinition).download(filename + '.pdf');
    });
});