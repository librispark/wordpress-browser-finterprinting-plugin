/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

debug = false;

var count = 1;

var ipdata = {};

var bigfonts;

$(document).ready(function () {
    var name;
    var flash = true;
    if (swfobject.getFlashPlayerVersion().major === 0) {
        flash = false;
    }
    if (flash === false) {
        name = Detector.getFontList();
        document.getElementById("flash_fonts").innerHTML += name;
        bigfonts = name;
        return;
    }
    name = "Flash:";
    
    var fontDetect = new FontDetect("font-detect-swf", "font-detect-js-master/flash/FontList.swf", function (fd) {
        var fonts = fd.fonts();
        name += fonts[0].fontName;
        for (var i = 1, length = fonts.length; i < length; i++) {
            name += "," + fonts[i].fontName;

        }

        document.getElementById("flash_fonts").innerHTML += name;
        
        bigfonts = name;

    });
    
    
});


function updateFingerprint() {
    document.getElementById('demo').innerHTML = getFingerprintString();
    document.getElementById('timestamp').innerHTML = "Time Stamp: " + (new Date()).toUTCString();
    document.getElementById('http_head').innerHTML = "HTTP_ACCEPT Header: " + getHTTPHeaders();
    document.getElementById('fonts').innerHTML = "Fonts: " + bigfonts;//+ Detector.getFontList();
    document.getElementById('ipaddress').innerHTML = "IP address : " + ipdata.ip;
    document.getElementById('country').innerHTML = "</br>Country : " + ipdata.country;
    document.getElementById('latitude').innerHTML = "</br>Latitude : " + ipdata.latitude;
    document.getElementById('longitude').innerHTML = "</br>Longitude : " + ipdata.longitude;
    document.getElementById('timezone').innerHTML = "</br>TimeZone : " + ipdata.timezone;
}


function getHTTPHeaders() {
    var req = new XMLHttpRequest();
    req.open('GET', document.location, false);
    req.send(null);
    var headers = req.getAllResponseHeaders().toLowerCase();
    return headers;
}

function getFingerprintString() {
    var s = "";
    s = s + attributeLine("appCodeName") + navigator.appCodeName;
    s = s + attributeLine("appName") + navigator.appName;
    s = s + attributeLine("appVersion") + navigator.appVersion;
    s = s + attributeLine("cookieEnabled") + navigator.cookieEnabled;
    s = s + attributeLine("language") + navigator.language;
    s = s + attributeLine("platform") + navigator.platform;
    s = s + attributeLine("plugins") + getPluginString();
    s = s + attributeLine("userAgent") + navigator.userAgent;
    s = s + attributeLine("Screen Size") + screen.width + 'x' + screen.height + 'x' + screen.colorDepth;
    return s;
}

function getPluginString() {
    var s = "";
    var plugins = navigator.plugins;
    for (var i = 0; i < plugins.length; i++) {
        s = s + plugins[i].name + ",";
        s = s + plugins[i].filename + ",";
        s = s + plugins[i].version + ";";
        if (debug)
            s = s + "<br/>";
    }
    return s;
}

function getgeoip(json) {
    ipdata = json;
}

function attributeLine(attribute) {
    if (!debug) {
        return "";
    } else {
        return "<br>" + attribute + ": ";
    }
}

function getPluginArray() {
    var parray = [];
    var pelt = [];
    var plugins = navigator.plugins;
    for (var i = 0; i < plugins.length; i++) {
        pelt[0] = plugins[i].name;
        pelt[1] = plugins[i].filename;
        pelt[2] = plugins[i].version;
        parray[i] = pelt;
        pelt = [];
    }

    return parray;
}
function getFingerJSON() {

    jsonfinger = jQuery.parseJSON("{}");
    jsonfinger.timestamp = (new Date()).toUTCString();
    jsonfinger.appCodeName = navigator.appCodeName;
    jsonfinger.appName = navigator.appName;
    jsonfinger.cookieEnabled = navigator.cookieEnabled;
    jsonfinger.language = navigator.language;
    jsonfinger.platform = navigator.platform;
    jsonfinger.userAgent = navigator.userAgent;
    jsonfinger.ip = ipdata.ip;
    jsonfinger.latitude = ipdata.latitude;
    jsonfinger.longitude = ipdata.longitude;
    jsonfinger.country = ipdata.country;
    jsonfinger.timezone = ipdata.timezone;
    jsonfinger.screenSize = screen.width + "x" + screen.height + "x" + screen.colorDepth;
    jsonfinger.plugins = getPluginArray();

    jsonfinger.fonts = bigfonts;
    //includes a bunch of stuff like timestamp so commented out for now (permanently?)
    // jsonfinger.httpheader = getHTTPHeaders();

    return jsonfinger;

}

function storeFinger() {
    var data = getFingerJSON();
    data.dbRequest = "storeFinger";
    console.log(data.fonts);
    data = JSON.stringify(data);
    var request = $.ajax({
        url: "http://volition.cs.umd.edu:8080",
        method: "POST",
        data: data,
        contentType: 'json',
        dataType: "html"
    });

    request.done(function (msg) {
        console.log(msg);
    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });

}


function clearDB() {
    data = jQuery.parseJSON("{}");
    data.dbRequest = "clearDB";
    data = JSON.stringify(data);

    var request = $.ajax({
        url: "http://volition.cs.umd.edu:8080",
        method: "POST",
        data: data,
        contentType: 'json',
        dataType: "html"
    });

    request.done(function (msg) {
        console.log(msg);
    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });

}

function showDB() {
    var counter = count;
    count++;
    var finger = getFingerprintString() + counter;
    data = jQuery.parseJSON("{}");
    data.dbRequest = "showDB";
    data.requestID = finger;

    data = JSON.stringify(data);

    var request = $.ajax({
        url: "http://volition.cs.umd.edu:8080",
        method: "POST",
        data: data,
        contentType: 'json',
        dataType: "html"
    });

    request.done(function (msg) {
        console.log(msg);

    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });


    setTimeout(function (ID) {

        resdata = jQuery.parseJSON("{}");
        resdata.dbRequest = "getResults";
        resdata.requestID = ID;
        resdata = JSON.stringify(resdata);

        var response = $.ajax({
            url: "http://volition.cs.umd.edu:8080",
            method: "POST",
            data: resdata,
            contentType: 'json',
            dataType: "json"
        });

        response.done(function (msg) {
            document.getElementById('responseText').innerHTML = JSON.stringify(msg.results);
        });

        response.fail(function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });



    }, 3000, finger);





}

