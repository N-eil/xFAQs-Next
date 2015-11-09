// ==UserScript==
// @name         xFAQs-Next
// @namespace    xfaqs
// @version      0.2
// @description  xFAQs For the New Message Board Beta
// @author       @Kraust / Judgmenl
// @match        http://*.gamefaqs.com/*
// @grant        none
// @noframes
// ==/UserScript==

// https://github.com/N-eil/xFAQs-Next

// TODOs:
// 3. Get the "MASTER" User Variable to work in all cases
// 2. Settings Page (In the same Style as xfaqs does now) - Partial}

// Note: jQuery is provided by GameFAQs by default. I will be using it a lot in this code.

// --- Settings related functions ---
// Parses the settings from localstorage and returns them.  Has some special cases to be compatible with previous extensions
function getSettings() {
    // Returns a variable which contains user settings
    var _SETTINGS_;

    if( localStorage.getItem("_SETTINGS_") !== null ) { //Load existing settings from localStorage
        _SETTINGS_ = JSON.parse(localStorage.getItem("_SETTINGS_"));

        // Automatically import signatures from old xFAQs if they don't have any set here
        if( _SETTINGS_.signatures.length === 1 && localStorage.getItem('sigList')) {
            _SETTINGS_.signatures = JSON.parse(localStorage.getItem("sigList")).signatures;
            localStorage.setItem("_SETTINGS_", JSON.stringify(_SETTINGS_));
        }

        if (!(_SETTINGS_.signatures instanceof Array)) { //Some people had issues with signatures not being an array, not sure how that happened but this will restore it
            _SETTINGS_.signatures = [
                {
                    "boards": [""],
                    "accounts": [""],
                    "signature": "powered by xfaqs"
                }
            ];
            localStorage.setItem("_SETTINGS_", JSON.stringify(_SETTINGS_));
        }

        // Automatically convert old enableAvatars values to "left" and "right"
        // to allow easy conversion from old xFAQs versions of the enableAvatars setting
        switch (_SETTINGS_.settings[0].enableAvatars) {
            case "topLeft":
            case "leftLeft":
                _SETTINGS_.settings[0].enableAvatars = "left";
                localStorage.setItem("_SETTINGS_", JSON.stringify(_SETTINGS_));
                break;

            case "topRight":
                _SETTINGS_.settings[0].enableAvatars = "right";
                localStorage.setItem("_SETTINGS_", JSON.stringify(_SETTINGS_));
                break;
        }
    } else {  // First time user, create and store default settings in localStorage
        _SETTINGS_ =
        {
            "settings": [
                {
                    "enableAMP": false,
                    "enablePopular": false,
                    "searchTopics": false,
                    "enableFilter": false,
                    "enableWebm": false,
                    "enableGifv": false,
                    "enableImages": false,
                    "enableYoutube": false,
                    "msgBelowLeftOfPost": false,
                    "enableAvatars": "disabled",
                    "enableAccountSwitcher": false,
                    "enableRotatingSigs": false,
                    "enableQuickTopic": false,
                    "enableHotkeys": true,
                }
            ],
            "highlight-groups": [
                {
                    "groupName": "xFAQs Creator",
                    "color": "#FFD9D9",
                    "userNames": [ "Judgmenl" ]
                }
            ],
            "ignored-users": [],
            "signatures": [
                {
                    "boards": [""],
                    "accounts": [""],
                    "signature": "powered by xfaqs"
                }
            ],
            "accounts": []
        };
        localStorage.setItem("_SETTINGS_", JSON.stringify(_SETTINGS_));
    }

    return _SETTINGS_;
}

// Adds the link to the settings page in the top right
function addSettingsPageLink() {
    $(".masthead_user:last").prepend("<span class='masthead_mygames_drop'><a href='/boards/user.php?settings=1'>xFAQs Settings <i class='icon icon-cog'></i>" +
                                "</a><ul class='masthead_mygames_subnav' style='width:200px;left:-1px;'><li class='masthead_mygames_subnav_item'>" +
                                "<a href='/boards/565885-blood-money/'>xFAQs Help</a></li></ul></span> ");
}

// Checks if they are currently on the xfaqs settings page
function onSettingsPage() {
    return (decodeURIComponent((new RegExp('[?|&]' + "settings" + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')) == "1") && (location.pathname == "/user");
}

// Fills the checkboxes on the general settings tab with the current settings
function loadSettingsCheckboxes(_SETTINGS_) {
    $("#enableAMP").prop('checked', _SETTINGS_.settings[0].enableAMP);
    $("#enablePopular").prop('checked', _SETTINGS_.settings[0].enablePopular);
    $("#searchTopics").prop('checked', _SETTINGS_.settings[0].searchTopics);
    $("#enableFilter").prop('checked', _SETTINGS_.settings[0].enableFilter);
    $("#enableWebm").prop('checked', _SETTINGS_.settings[0].enableWebm);
    $("#enableGifv").prop('checked', _SETTINGS_.settings[0].enableGifv);
    $("#enableImages").prop('checked', _SETTINGS_.settings[0].enableImages);
    $("#enableYoutube").prop('checked', _SETTINGS_.settings[0].enableYoutube);
    $("#msgBelowLeftOfPost").prop('checked', _SETTINGS_.settings[0].msgBelowLeftOfPost);
    $("#enableAvatars").val(_SETTINGS_.settings[0].enableAvatars);
    $("#enableAccountSwitcher").prop('checked', _SETTINGS_.settings[0].enableAccountSwitcher);
    $("#enableRotatingSigs").prop('checked', _SETTINGS_.settings[0].enableRotatingSigs);
    $("#enableQuickTopic").prop('checked', _SETTINGS_.settings[0].enableQuickTopic);
    $("#enableHotkeys").prop('checked', _SETTINGS_.settings[0].enableHotkeys);
}

// Saves settings from the general settings tab
function saveSettingsCheckboxes(e) {
    var _SETTINGS_ = e.data;
    _SETTINGS_.settings[0].enableAMP = $('#enableAMP').is(":checked");
    _SETTINGS_.settings[0].enablePopular = $('#enablePopular').is(":checked");
    _SETTINGS_.settings[0].searchTopics = $('#searchTopics').is(":checked");
    _SETTINGS_.settings[0].enableFilter = $('#enableFilter').is(":checked");
    _SETTINGS_.settings[0].enableWebm = $('#enableWebm').is(":checked");
    _SETTINGS_.settings[0].enableGifv = $('#enableGifv').is(":checked");
    _SETTINGS_.settings[0].enableImages = $('#enableImages').is(":checked");
    _SETTINGS_.settings[0].enableYoutube = $('#enableYoutube').is(":checked");
    _SETTINGS_.settings[0].msgBelowLeftOfPost = $('#msgBelowLeftOfPost').is(":checked");
    _SETTINGS_.settings[0].enableAvatars = $('#enableAvatars').val();
    _SETTINGS_.settings[0].enableAccountSwitcher = $('#enableAccountSwitcher').is(":checked");
    _SETTINGS_.settings[0].enableRotatingSigs = $('#enableRotatingSigs').is(":checked");
    _SETTINGS_.settings[0].enableQuickTopic = $('#enableQuickTopic').is(":checked");
    _SETTINGS_.settings[0].enableHotkeys = $('#enableHotkeys').is(":checked");
    localStorage.setItem("_SETTINGS_", JSON.stringify(_SETTINGS_));
    document.location = "/boards/user.php?settings=1#settings";
    location.reload(true);
}

// Generate the main body of the settings page
function createSettingsPage(_SETTINGS_, _USER_, _AVATARDOMAIN_) {

    // Remove gamefaqs usual settings page to make space for xfaqs settings
    $(".span4").remove();
    $(".span8").css("width", "100%");
    $(".userinfo").css("border", "none");
    $(".title").remove();
    $(".head").remove();
    $('#js_content_nav').remove();

    $("table.board").empty().append('<thead></thead>').append('<tbody></tbody>');
    $(".page-title").html("xFAQs Settings");

    $("tbody").append( "<div id='xfaqs-tabs'>" +
                    "<ul class='content_nav content_nav_wrap'>" +
                        "<li class='cnav_item' style='border-radius: 5px; cursor: pointer;'><a href='#news'>News</a></li>" +
                        "<li class='cnav_item' style='border-radius: 5px; cursor: pointer;'><a href='#settings'>General Settings</a></li>" +
                        "<li class='cnav_item' style='border-radius: 5px; cursor: pointer;'><a href='#avatars'>GameFAQs Avatars</a></li>" +
                        "<li class='cnav_item' style='border-radius: 5px; cursor: pointer;'><a href='#tabs-3'>User Highlighting</a></li>" +
                        "<li class='cnav_item' style='border-radius: 5px; cursor: pointer;'><a href='#tabs-4'>Ignore List+</a></li>" +
                        "<li class='cnav_item' style='border-radius: 5px; cursor: pointer;'><a href='#tab-rotating-sigs'>Rotating Signatures</a></li>" +
                        "<li class='cnav_item' style='border-radius: 5px; cursor: pointer;'><a href='#tab-account-switcher'>Account Switcher</a></li>" +
                        "<li class='cnav_item' style='border-radius: 5px; cursor: pointer;'><a href='#tabs-6'>About</a></li>" +
                    "</ul>" +

                    "<div id='news' style='padding-top:20px; padding-left:10px'></div>" +

                    "<div id='settings' style='padding-top:20px'>" +
                        "<table style='margin-bottom: none' class='contrib'>" +
                            "<tr><th colspan='2'>General Settings</th></tr>" +
                            "<tr><td style='width:50%'>Popular Topics in Board Navigation</td><td><input type='checkbox' id='enablePopular'></td></tr>" +
                            "<tr><td style='width:50%'>AMP in Board Navigation</td><td><input type='checkbox' id='enableAMP'></td></tr>" +
                            "<tr><td style='width:50%'>\"Search Topics\" at top of topic list.</td><td><input type='checkbox' id='searchTopics'></td></tr>" +
                            "<tr><td style='width:50%'>Message Filtering <i class='icon icon-question-sign' title='Note: filters only work on retro skins if Message Poster Display: Above Message is selected in the Advanced Site Settings'></i></td><td><input type='checkbox' id='enableFilter'></td></tr>" +
                            "<tr><td style='width:50%'>Embedded Webm</td><td><input type='checkbox' id='enableWebm'></td></tr>" +
                            "<tr><td style='width:50%'>Embedded Gifv</td><td><input type='checkbox' id='enableGifv'></td></tr>" +
                            "<tr><td style='width:50%'>Embedded Images</td><td><input type='checkbox' id='enableImages'></td></tr>" +
                            "<tr><td style='width:50%'>Embedded Youtube</td><td><input type='checkbox' id='enableYoutube'></td></tr>" +
                            "<tr><td style='width:50%'>quote, edit, ect. in Message Display Left</td><td><input type='checkbox' id='msgBelowLeftOfPost'></td></tr>" +
                            "<tr><td style='width:50%'>GameFAQs Avatars</td><td>" +
                            "<select id='enableAvatars'>" +
                                "<option value='disabled'>Disabled</option>" +
                                "<option value='left'>Left</option>" +
                                "<option value='right'>Right</option>" +
                            "</select></td></tr>" +
                            "<tr><td style='width:50%'>Account Switcher</td><td><input type='checkbox' id='enableAccountSwitcher'></td></tr>" +
                            "<tr><td style='width:50%'>Rotating Sigs</td><td><input type='checkbox' id='enableRotatingSigs'></td></tr>" +
                            "<tr><td style='width:50%'>Quick Topic</td><td><input type='checkbox' id='enableQuickTopic'></td></tr>" +
                            "<tr><td style='width:50%'>Posting Hotkeys <i class='icon icon-question-sign' title='Alt+Z to post, Alt+X to preview. This may conflict with other hotkey scripts.'></i></td><td><input type='checkbox' id='enableHotkeys'></td></tr>" +
                            "<tr><td colspan='2'><input type='submit' id='update-general' class='btn' value='Update xFAQs Settings'></td></tr>" +
                        "</table>" +
                    "</div>" +

                   "<div id='avatars' style='padding-top:20px'>" +
                        "<div style='float:left; width:100px; height:100px;'><img class='avatar' src='" + _AVATARDOMAIN_ + "avatars/" + _USER_ + ".png'></div>" +
                        "<div style='float:left; padding-left:10px'><h4>GameFAQs Avatars</h4> <ul id=settings class='paginate user' style='margin:0;padding:0;'> " +
                            "<form id='submit' method='POST' enctype='multipart/form-data' > " +
                            "<input class='btn' type='file' name='file' accept='image/*' id='file'> " +
                            "<input class='btn btn_primary' type='button' id='submit_btn' value='Upload'> " +
                            "<input style='display:none' type='text' name='dest' value='GameFAQs-Avatars'> " +
                            "<input style='display:none' type='text' name='user' value='" + _USER_ + " '> " +
                            "<span id='server_message'>Maximum dimensions: 100x100 pixels.  Maximum File Size: 200KB</span> " +
                            "</form></div>" +
                            "<div style='clear:both;padding-top:30px;'>Upload an avatar, and select upload. If your upload fails, then you will get a message telling you why.<br>" +
                            "Please note: This process modifies your signature, however you should get your old signature back.<br>" +
                            "If your signature is set to upload:ok it will be removed.</div>" +
                   "</div>" +
                   //"<div id='tabs-3' style='padding-top:20px'>" + highlightBody + "</div>" +
                   //"<div id='tabs-4' style='padding-top:20px'>" + ignoreBody + "</div>" +
                   "<div id='tab-rotating-sigs' style='padding-top:20px'>" + generateRotatingSigsBody(_SETTINGS_.signatures) + "</div>" +
                   //"<div id='tabs-6' style='padding-top:20px'>" + aboutBody + "</div>" +
                   "<div id='tab-account-switcher' style='padding-top:20px'>" + generateAccountSwitcherBody(_SETTINGS_.accounts) + "</div>" +
                "</div>");
}

// Create the body of the account switcher settings tab
function generateAccountSwitcherBody(accounts) {
    var switcherBody = "<h3>Account Switcher Settings</h3>";
    switcherBody += "<p>Note: This is super dangerous. Passwords are saved unencrypted in localStorage. Please use this with caution. " +
                        "<b>I have no access to your account information and am not liable for anything that may happen as a result of using this feature!</b></p>";

    switcherBody += '<table id="account-list">';

    switcherBody += '<tr class="acount-switcher-row">' +
                        '<td>Username</td>' +
                        '<td><input class="username" style="width:100%"> </td>' +
                        '<td>Password</td>' +
                        '<td><input class= "password" type="password" style="width:100%"> </td>' +
                        '<td><button class="account-new btn">Add</button></td>' +
                    '</tr>';


    function createAccountAddMarkup(acc) {
        return '<tr class="account-switcher-row">' +
                    '<td>Username</td>' +
                    '<td><input class="username" style="width:100%" value="' + acc.name + '"></td>' +
                    '<td>Password</td>' +
                    '<td><input class= "password" type="password" style="width:100%" value="' + acc.pass + '"></td>' +
                    '<td><button class="account-remove btn">Remove</button></td>' +
                '</tr>';
    }

    accounts.forEach(function(acc) {
        switcherBody += createAccountAddMarkup(acc);
    });

    switcherBody += "</table>";

    return switcherBody;
}

// Create the entry for a single sig in the settings page
function createSigChangeMarkup(sig, index){
    return "<tr class='signature-header-row'><th colspan='2'>Signature " + (index + 1) + " <input type='submit' class='sig-update btn' style='float:right; margin-left:10px;' value='Update'><input type='submit' class='sig-delete btn' style='float:right' value='Delete'></th></tr>" +
        "<tr class='board-names-row'><td>Board Names</td><td><input class='board-names' style='width:100%' value=\"" + sig.boards + "\"></td></tr>" +
        "<tr class='accounts-row'><td>Accounts</td><td><input class='accounts' style='width:100%' value=\"" + sig.accounts + "\"></td></tr>" +
        "<tr class='signature-row'><td>Signature</td><td><textarea class='signature' style='width:100%'>" + sig.signature + "</textarea></td></tr>";
}

// Create the body for the rotating sigs settings tab
function generateRotatingSigsBody(sigs) {
    var sigBody = "<p style='float:left'>1 line break and 160 characters allowed. Just like with regular sigs.<br> If you want a signature to apply to all boards or accounts leave the field blank.<br>Multiple boards and accounts are separated by commas.</p>";
    sigBody += " <div style='float:right'><button  class='btn btn_primary' id='sig-export'>Export Signature Data</button> ";
    sigBody += " <button class='btn' id='sig-import'>Import Signature Data</button></div> ";

    sigBody += "<table id='existing-sigs'>" +
                "<tr class='signature-header-row'><th colspan='2'> New Signature <input type='submit' class='sig-new btn' style='float:right' value='Add'></th></tr>" +
                "<tr class='board-names-row'><td>Board Names</td><td><input class='board-names' style='width:100%'></td></tr>" +
                "<tr class='accounts-row'><td>Accounts</td><td><input class='accounts' style='width:100%'></td></tr>" +
                "<tr class='signature-row'><td>Signature</td><td><textarea class='signature' style='width:100%'></textarea></td></tr>";

    sigs.forEach(function(sig, index){
        sigBody += createSigChangeMarkup(sig, index);
    });

    sigBody += "</table><br>";
    return sigBody;
}

// Add the popup windows for sig import and export on the settings page
function addSigImportExport(_SETTINGS_) {
    // Sig Export Widget.
    $("body").append("<div id='sigWidget' style='display:none'><p>Save this text data in a text file</p><textarea id='sigbackup' style='width:100%; height:500px;' readonly>" + JSON.stringify(_SETTINGS_.signatures, null, "\t") + "</textarea></div>");
    $("#sigWidget").dialog({
         autoOpen: false,
         height: "auto",
         width: 1100,
    });

    // Sig Import Widget
    $("body").append("<div id='sigWidgetI' style='display:none'><p>Paste the contents of Export Signature Data into this box and click Save.</p><textarea id='sig-import-text' style='width:100%; height:500px;'>" + "" + "</textarea><p><br><button id='okToSaveSig'>Save</button></p></div>");
    $("#sigWidgetI").dialog({
         autoOpen: false,
         height: "auto",
         width: 1100,
    });

    $("#okToSaveSig").click(function() {
        var sigData = $("#sig-import-text").val();
        _SETTINGS_.signatures = JSON.parse(sigData);
        localStorage.setItem("_SETTINGS_", JSON.stringify(_SETTINGS_));
        location.reload(true);
    });

    $("#sigWidget").parent().addClass("reg_dialog");
    $("#sigWidgetI").parent().addClass("reg_dialog");
    $("button").addClass("btn");
}

// Adds handlers for buttons on the rotating sigs settings page
function addSigChangeHandlers(_SETTINGS_) {

    function sigClickCallback($entry, index) {
        var sigText = $entry.nextAll('.signature-row').first().find('.signature').val();
        var sigLines = (sigText.match(/\n/g)||[]).length;
        var sigCharacters = sigText.length + sigLines;

        if((sigLines > 1) || (sigCharacters > 160)) {
            alert("Signature is too long. " + sigLines + " breaks and " + sigCharacters + " characters.");
            return;
        }

        var boardNameArray = $entry.nextAll('.board-names-row').first().find('.board-names').val().split(/ *, */);
        var accountNameArray = $entry.nextAll('.accounts-row').first().find('.accounts').val().split(/ *, */);
        var newSigData = {
            "boards": boardNameArray,
            "accounts": accountNameArray,
            "signature": sigText
        };

        if (index === undefined) { // Adding a new sig
            _SETTINGS_.signatures.push(newSigData);
            $entry.closest('tbody').append(createSigChangeMarkup(newSigData,_SETTINGS_.signatures.length - 1));
            $entry.nextAll('.signature-row').first().find('.signature').val('Signature added successfully');
        }
        else { //Updating an old sig
            _SETTINGS_.signatures[index] = newSigData;
            $entry.find('.sig-update').val('Updated.');
        }

        localStorage.setItem("_SETTINGS_", JSON.stringify(_SETTINGS_));
    }

    function sigDeleteCallback($entry, index) {
        $entry.nextUntil('.signature-header-row').addBack().remove();
        _SETTINGS_.signatures.splice((index-1), 1);
        localStorage.setItem("_SETTINGS_", JSON.stringify(_SETTINGS_));
    }

    $('#existing-sigs').on('click', '.sig-update', function(){sigClickCallback($(this).closest('tr'), $('#existing-sigs .sig-update').index(this));});
    $('#existing-sigs').on('click', '.sig-new', function(){sigClickCallback($(this).closest('tr'));});
    $('#existing-sigs').on('click', '.sig-delete', function(){sigDeleteCallback($(this).closest('tr'), $('#existing-sigs .sig-delete').index(this));});
    $("#sig-export").click(function(){$("#sigWidget").dialog("open");});
    $("#sig-import").click(function(){$("#sigWidgetI").dialog("open");});
}

// Add handlers for account switcher settings tab
function addAccountSwitcherHandlers(_SETTINGS_) {
    function asAddCallback($entry) {
        _SETTINGS_.accounts.push(
            {
                "name": $entry.find('.username').val(),
                "pass": $entry.find('.password').val()
            });

        localStorage.setItem("_SETTINGS_", JSON.stringify(_SETTINGS_));
        document.location = "/boards/user.php?settings=1#tab-account-switcher";
        location.reload(true);
    }

    function asDeleteCallback(index) {
        _SETTINGS_.accounts.splice(index, 1);
        localStorage.setItem("_SETTINGS_", JSON.stringify(_SETTINGS_));
        document.location = "/boards/user.php?settings=1#tab-account-switcher";
        location.reload(true);
    }

    $('#account-list').on('click', '.account-new', function(){asAddCallback($(this).closest('tr'));});
    $('#account-list').on('click', '.account-remove', function(){asDeleteCallback($('#account-list .account-remove').index(this));});
}


// Loads news into the news tab on the settings page
function loadNews() {
    $.ajax({
        url: "https://raw.githubusercontent.com/N-eil/xFAQs-Next/master/news.html",
        dataType: "html",
        type: "GET",
    }).done(function(data) {
        $("#news").html(data);
    }).error(function() {
        $("#news").html("There's no news. Ask <a href='http://www.gamefaqs.com/boards/565885-'>Blood Money</a> what we're up to.");
    });
}


// --- Embedding images and videos ---
// Embed images in posts
function addTtiImages() {
    var $buttonTemplate = $("<button class='btn' style='margin-left:5px;padding-left:3px;padding-right:3px;padding-top:1px;padding-bottom:1px;'>" +
                        "<i class='icon icon-picture'></i></button>");
    var $ttiTemplate = $('<div style="display:none"><img alt="TTI Image"></div>');

    $('.msg_body a[href$=".gif"], .msg_body a[href$=".jpg"], .msg_body a[href$=".png"], .msg_body a[href$=".bmp"], .msg_body a[href$=".jpeg"]').each(function() {
        var href = $(this).attr("href");
        var $ttiDiv = $ttiTemplate.clone();
        var $toggleButton = $buttonTemplate.clone().click(function() {
            $ttiDiv.children('img').attr('src', href);
            $ttiDiv.toggle();
        });
        $(this).after($ttiDiv).after($toggleButton);
    });
}

// Embed things that can fit as a src for a <video> tag, plus .gifv in posts
function embedVideos(selectors) {
    var $buttonTemplate = $('<button class="btn" style="margin-left:5px;padding-left:3px;padding-right:3px;padding-top:1px;padding-bottom:1px;">' +
                        '<i class="icon icon-play-circle"></i></button>');
    var $videoTemplate = $('<div style="display:none"> <video controls loop autoplay> </video> </div>');

    $(selectors).each(function() {
        var href = $(this).attr("href").replace('.gifv', '.webm');
        var $videoDiv = $videoTemplate.clone();
        var $toggleButton = $buttonTemplate.clone().click(function() {
            $videoDiv.toggle();
            if ($videoDiv.find('video').is(':hidden'))
                $videoDiv.find('video')[0].pause();
            else
                $videoDiv.find('video')[0].play();

        })
        .one('click', function() { // Only set the source once to prevent videos from restarting when hidden and then reopened
            $videoDiv.find('video').attr('src', href);
        });
        $(this).after($videoDiv).after($toggleButton);
    });
}

// Embed youtube videos in posts
function embedYoutube() {
    // https://xkcd.com/1171/
    var ytregex = /(?:http|https|)(?::\/\/|)(?:www.|)(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[a-z0-9;:@#?&%=+\/\$_.-]*/;
    var $buttonTemplate = $('<button class="btn" style="margin-left:5px;padding-left:3px;padding-right:3px;padding-top:1px;padding-bottom:1px;">' +
                        '<i class="icon icon-play-circle"></i></button>');
    var $videoTemplate = $('<div style="display:none"> <iframe width="720" height="480"frameborder="0" allowfullscreen></iframe> </div>');

    $('td.msg a').each(function() {
        if (!(ytregex.test($(this).attr('href'))))
            return;
        var id = ytregex.exec($(this).attr('href'))[1];
        var $videoDiv = $videoTemplate.clone();
        var $toggleButton = $buttonTemplate.clone().click(function() { //TODO: Figure out how to pause youtube videos when toggled to hidden
            $videoDiv.toggle();
        })
        .one('click', function() { // Only set the source once to prevent videos from restarting when hidden and then reopened
            $videoDiv.find('iframe').attr('src', 'http://www.youtube.com/embed/' + id);
        });
        $(this).after($videoDiv).after($toggleButton);
    });
}


// --- Adding convenience buttons and links to boards and messages ---
// Add search bar at top of topic list
function addTopicSearchBar() {
    $(".board_nav").after($(".searchtopics").css('margin', '0'));
}

// Add link to popular topics
function addPopularLink() {
    $(".paginate.user > .unav").after("<li><a href='http://www.gamefaqs.com/boards/popular.php?'>Popular</a></li>");
}

// Add link to AMP page
function addAmpLink(_USER_) {
    var ampURL = "http://www.gamefaqs.com/users/" + _USER_ + "/boards";
    if(ampURL) {
        $.ajax({
            type: "POST",
            url: ampURL,
        })
        .done(function(response) {
            var amp = $(response).find("#content > div > div > div > table > tbody:nth-child(3) > tr:nth-child(8) > td:nth-child(2)").text();
            $(".paginate.user > .unav").after("<li><a href='http://www.gamefaqs.com/user/messages'>" + amp + " AMP</a></li>");
        });
    }
}

// Add link to filter messages in topic and only display the selected user's messages
function filterMessages() {
    function filterCallback(user) {
        $(".name:not(:contains('" + user + "'))").closest(".msg").toggle();
    }

    $(".message_num").before(function(i) {
        var $span = $("<span class='postaction'> </span>");
        return $("<a href='#' class='filter-" + i + "'> filter </a>")
            .appendTo($span)
            .click(function(){ filterCallback($(this).siblings('.user').find('.name').text()); });
    });
}

// Move the info below the message into the message-left sidebar
function moveMsgBelow(messageDisplayTop) {
    if (messageDisplayTop)
        return; // Don't move anything for message display top.  Potential TODO: Move msgBelow links into user info bar for message display top as well?

    $(".msg_below").css("position", "relative").each(function() {
        $(this).parent().prev().find('.message_num').before(this);
    });

    $(".edited").css("display", "block");
    $(".action_after").hide();
    $(".options").css("float", "none");
}


// --- Avatar functions ---
// Display avatars in topics
function renderAvatars(avatarPlacement, messageDisplayTop, _AVATARDOMAIN_) {
    if (avatarPlacement === "left")
    {
        if (messageDisplayTop) {
            $(".msg_infobox").css("clear", "both");
            $(".msg_below").css("clear", "both");
            $(".msg_body").css("padding-left", "115px").each(function() {
                var post_user = $(this).parent().prev().find(".name").text().trim().replace(/ /g,"_");
                $(this).before("<div style='top:45px;padding:.5em;float:left'><img src='" + _AVATARDOMAIN_ + 'avatars/' + post_user +".png' /></div>");
            });
        } else {
            $(".msg_infobox").each(function() {
                var post_user = $(this).find(".name").text().trim().replace(/ /g,"_");
                $(this).find('.user').after("<img src='" + _AVATARDOMAIN_ + 'avatars/' + post_user +".png' />");
            });
        }
    }
    else if (avatarPlacement === "right") {
        $(".msg_body").css("padding-right", "calc(" + (105 - parseInt($(".msg_body").css("margin-right"), 10)) + "px + 0.5em)");
        $(".msg_infobox").css("clear", "both");
        $(".msg_below").css("clear", "both");
        $(".msg_body").each(function() {
            var post_user = $(this).parent().prev().find(".name").text().trim().replace(/ /g,"_");
            $(this).before("<div style='padding:.5em;float:right'><img src='" + _AVATARDOMAIN_ + 'avatars/' + post_user +".png' /></div>");
        });
    }

    $('img').error(function() { $(this).hide(); });
}

// Add handlers for events in avatar settings page
function addAvatarUploadHandlers(_USER_, _AVATARDOMAIN_) {

    // Utility function to restore sig after it is changed during upload
    function restoreSig(url, key, sig) {
        $.ajax({
            type: "POST",
            url: url,
            data: "key=" + key + "&sig=" + sig + "&submit=Change Settings",
        });
    }

    // Verify avatar dimensions, filetype, etc when selecting file to upload
    $("#file").change(function() {
        var file = this.files[0];
        var size = file.size;
        var type = file.type;
        $("#submit_btn").css("display", "none");

        if (!type.match(/image.*/)) {
            $("#server_message").html("Invalid File Type");
            return;
        }

        if (size > 204800) {
            $("#server_message").html("Image is too big (" + size/1024 + "KB). 200KB maximum.");
            return;
        }

        if (!_USER_) {
            $("#server_message").html("Log in to upload avatars.");
            return;
        }

        $("#submit_btn").css("display", "inline");
        $("#server_message").html("OK");
    });

    // Handles the upload itself.  Changes the user's sig temporarily, this is checked on the server so that people can't upload avatars under anyone else's name
    $("#submit_btn").click(function() {
        var formData = new FormData($('#submit')[0]);

        $("#server_message").html("backing up signature...");

        $.ajax({
            type: "POST",
            url: "/boards/sigquote.php",
        }).done(function(response) {
            var sig = $(response).find("#sig").text();
            var key = $(response).find("input[name=key]").eq(0).attr("value");
            var sigpost = $(response).find("#add").attr("action");

            if((sig == "upload:ok") || (sig == "avatarupload:true"))
                sig = "";

            $("#server_message").html("Sending permission to change sig");

            $.ajax({
                type: "POST",
                url: sigpost,
                data: "key=" + key + "&sig=" + "avatarupload:true" + "&submit=Change Settings",
            }).done(function() {
                $("#server_message").html("Uploading...");
                $.ajax( {
                    url: _AVATARDOMAIN_ + '/upload-v2.php',
                    dataType: "html",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                }).done(function() {
                    restoreSig(sigpost, key, sig);
                    location.reload(true);
                }).fail(function() {
                    restoreSig(sigpost, key, sig);
                    $("#server_message").html("Avatar not uploaded to avatarfaqs domain. Service may be unavailable.");
                });
            });
        });
    });
}


// --- Rotating sigs stuff ---
// Adds rotating sigs to your posts in topics
function addRandomSigToPost(sigList) {
    var board = $('.page-title').html().trim();
    if (sigList) {
        var filteredSigList = sigList.filter(function(sig) {
            return (sig.boards[0] === "" || sig.boards.indexOf(board) !== -1) &&
                    (sig.accounts[0] === "" || sig.accounts.indexOf(_USER_) !== -1);
        });
        if (filteredSigList.length) {
            var randomSig = filteredSigList[Math.floor(Math.random() * filteredSigList.length)].signature;
            $("input[name='custom_sig']").after("<div class='head'><h2 class='title'>Custom Signature</h2></div>" +
                                                "<textarea name='custom_sig' rows='2' cols='100' style='width:100%;'></textarea>");
            $("input[name='custom_sig']").remove();
            $("textarea[name='custom_sig']").val(randomSig);
        }
    }
}

// --- Account switcher stuff ---
// Logs in to an account using account.name and account.pass
function loginToAccount(account) {
    var key;

    $.ajax( {
        type: "GET",
        url: "/user/logout",
        async: false
    });

    $.ajax({
        type: "POST",
        url: "/",
        async: false
    }).done(function(response) {
        key = response.match(/key" value="([^"]*)"/)[1];
    });

    var formData = "EMAILADDR=" + account.name + "&PASSWORD=" + account.pass + "&key=" + key + "&path=http://www.gamefaqs.com/";

    $.ajax({
        type: "POST",
        url: "/user/login",
        data: formData,
        async: false
    }).done(function() {
        location.reload(true);
    });
}

// Adds the account switcher link to top right of page
function addAccountSwitcher(accounts) {
    $(".masthead_user:last").append("<a href='#' id='account-switch'>Account Switcher</a>");

    $("#account-switch").click(function() {

        var topicForm = "<div id='account-switch-panel' class='reg_dialog' style='position:fixed;left:25%;top:10%;width:50%'>" +
                            "<div style='padding:10px;'><h3>Account Switcher</h3>" +
                            "<p>";

        topicForm += "<table>";

        accounts.forEach(function(account) {
            topicForm += "<tr><td>" + account.name + "</td><td><button class='switch btn'>Log in</button></td></tr>";
        });

        topicForm += "</table>";

        topicForm += "<br><button class='btn' id='account-switch-close'>Close</button>" +
                        "</p>" +
                        "</div></div>";

        $("body").append(topicForm);
        $("#account-switch-panel .switch").click(function() {loginToAccount(accounts[$('#account-switch-panel .switch').index(this)]);});

        $("#account-switch-close").click(function() { $("#account-switch-panel").remove(); });
    });
}


// --- Quick topic functions ---
// Add formatting tags (<b>, <i>, etc) to message on button click
function addQuickTag(e) {
    var msgAreaEdit = e.data;
    var currTag = $(this);
    var tagStart = '<' + this.name + '>';
    var tagEnd = '</' + this.name + '>';
    var c = msgAreaEdit.selectionStart;
    var selPre = msgAreaEdit.value.substr(0, c);
    var selPost = msgAreaEdit.value.substr(msgAreaEdit.selectionEnd);
    var selTxt = msgAreaEdit.value.substr(c, msgAreaEdit.selectionEnd-c);

    if (selTxt.length < 1) {
        if (currTag.hasClass('active')) { // Add the ending tag
            msgAreaEdit.value = [msgAreaEdit.value.slice(0, c), tagEnd, msgAreaEdit.value.slice(c)].join('');
            currTag.css('color', '#000');
            msgAreaEdit.setSelectionRange(c + tagEnd.length, c + tagEnd.length);
        } else { // Add the starting tag
            msgAreaEdit.value = [msgAreaEdit.value.slice(0, c),tagStart,msgAreaEdit.value.slice(c)].join('');
            currTag.css('color', '#6564ff');
            msgAreaEdit.setSelectionRange(c + tagStart.length, c + tagStart.length);
        }
        currTag.toggleClass('active');
    } else {  // Enclose the selected text in tags
        msgAreaEdit.value = selPre + tagStart + selTxt + tagEnd + selPost;
        msgAreaEdit.setSelectionRange(c + tagStart.length + selTxt.length + tagEnd.length, c + tagStart.length + selTxt.length + tagEnd.length);
    }
    msgAreaEdit.focus();
}

// Add quick topic button to page, make it pop up a quick topic creation form on click
function addQuickTopic() {
    if ($(".action:first").text() !== " New Topic") return; // Only allow quick topic if the user can usually make topics
    var key;
    var postUrl = $(".action > a").attr("href");
    var tagButtons = '<span class="tagbuttons">' +
                    '<input type="button"  value="Bold" class="btn btn_mini btnbold" name="b" tabindex="-1">' +
                    '<input type="button"  value="Italic" class="btn btn_mini btnitalic" name="i" tabindex="-1">' +
                    '<input type="button"  value="Spoiler" class="btn btn_mini" name="spoiler" tabindex="-1">' +
                    '<input type="button"  value="Cite" class="btn btn_mini btncite" name="cite" tabindex="-1">' +
                    '<input type="button"  value="Quote" class="btn btn_mini" name="quote" tabindex="-1">' +
                    '<input type="button"  value="Code" class="btn btn_mini btncode" name="code" tabindex="-1">' +
                    '</span>';

    $(".paginate.user").append("<li id='topicToggle' class='action' ><a href='#' class='qt-action'>Quick Topic</a></li>");

    $("#topicToggle").click(function() {
        if ($('#quickTopic').length) { // Clicking quick topic while popup is open should close it
            $('#quickTopic').remove();
            return;
        }

        $.ajax({
            type: "POST",
            url: postUrl,
        }).done(function(response) {
            key = response.match(/key" value="([^"]*)"/)[1];
            $('#topicForm input:first').val(key);
        });

        var topicForm = '<div id="quickTopic" class="reg_dialog" style="position:fixed;left:25%;top:10%;width:50%">' +
                            '<form method="post" id="topicForm" action="' + postUrl + '"><input type="hidden" value="' + key + '" name="key">' +
                                '<div class="pod">' +
                                        '<div class="body">' +
                                            '<div class="details">' +
                                                '<p><b>Topic Title:</b>' +
                                                '<input id="quickTopicTitle" type="text" name="topictitle" maxlength="80" size="70"></p>' +
                                                '<p>' + tagButtons + '<textarea id="quickTopicPost" name="messagetext" rows="20" cols="100" style="width: 100%;"></textarea></p>' +
                                            '<div class="head"><h2 class="title" style="font-family: \'nimbus-sans\',\'Helvetica Neue\',\'HelveticaNeue\',Arial,sans-serif; font-weight: 700; letter-spacing: -1px; text-transform: none;">Custom Signature</h2></div>' +
                                            '<textarea cols="100" rows="2" name="custom_sig" style="width: 100%;"></textarea>' +
                                            '<input style="margin-top:10px;" type="submit" id="postMsg" name="post" value="Post without Preview" class="btn btn_primary">' +
                                            '<input style="margin-top:10px;" type="reset" onclick="return confirm(\'Are you sure? This will clear your entire post so far.\')" class="btn" name="reset" value="Reset">' +
                                            '<input style="margin-top:10px;" type="button" id="qt-close" class="btn" name="close" value="Close">' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</form>' +
                        '</div>';

        $("body").append(topicForm);
        $(".tagbuttons input").click($('#quickTopicPost')[0], addQuickTag);

        $("#qt-close").click(function() {
            $("#quickTopic").remove();
        });
    });
}

// --- SCRIPT EXECUTION STARTS HERE ---
if(jQuery) {

    var _SETTINGS_ = getSettings(); // All user settings are stored in _SETTINGS_
    var _USER_ = $(".welcome").text().slice(0, - 1).replace(/ /g,"_"); // Use _USER_ whenever you need the user's username
    var _AVATARDOMAIN_ = 'http://avatarfaqs.pcriot.com/'; //Moved up here for ease in changing if necessary
    var messageDisplayTop = ($('.msg_infobox').css('display') === 'block'); // Record whether they're using message display top or not

    addSettingsPageLink();

    if (onSettingsPage()) {
        createSettingsPage(_SETTINGS_, _USER_, _AVATARDOMAIN_);
        addSigImportExport(_SETTINGS_);

        addAvatarUploadHandlers(_USER_, _AVATARDOMAIN_);
        addSigChangeHandlers(_SETTINGS_);
        addAccountSwitcherHandlers(_SETTINGS_);

        loadNews();

        $("#update-general").click(_SETTINGS_, saveSettingsCheckboxes);
        loadSettingsCheckboxes(_SETTINGS_);

        $(function() {
            $("#xfaqs-tabs").tabs();
        });
    }

    // TODO: only run other functions on the pages they are needed?
    if(_SETTINGS_.settings[0].searchTopics)
        addTopicSearchBar();

    if(_SETTINGS_.settings[0].enableImages)
        addTtiImages();

    if(_SETTINGS_.settings[0].enableAMP)
        addAmpLink(_USER_);

    if(_SETTINGS_.settings[0].enablePopular)
        addPopularLink();

    if(_SETTINGS_.settings[0].enableWebm)
        embedVideos('a[href$=".webm"], a[href$=".WebM"], a[href$=".webM"]');

    if(_SETTINGS_.settings[0].enableGifv)
        embedVideos('a[href$=".gifv"]');

    if(_SETTINGS_.settings[0].enableYoutube)
        embedYoutube();

    if(_SETTINGS_.settings[0].enableFilter)
        filterMessages();

    if(_SETTINGS_.settings[0].msgBelowLeftOfPost)
        moveMsgBelow(messageDisplayTop);

    if (_SETTINGS_.settings[0].enableAvatars !== 'disabled')
        renderAvatars(_SETTINGS_.settings[0].enableAvatars, messageDisplayTop, _AVATARDOMAIN_);

    if (_SETTINGS_.settings[0].enableAccountSwitcher)
        addAccountSwitcher(_SETTINGS_.accounts);

    if (_SETTINGS_.settings[0].enableRotatingSigs)
        addRandomSigToPost(_SETTINGS_.signatures);

    if (_SETTINGS_.settings[0].enableHotkeys) {
        $("input[value='Post Message']").attr("accesskey", "z");
        $("input[value='Preview Message']").attr("accesskey", "x");
    }

    if(_SETTINGS_.settings[0].enableQuickTopic)
        addQuickTopic();
}
else
    alert("jQuery is Required to use xFAQs-Next.");