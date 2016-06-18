 var web_url = "http://volition.cs.umd.edu";
 var port_num = "8080";
 
 /* The above lines are generated using the config.h install script.
  * This allows a user to choose his server information on install.
  */
var server_url = web_url + ":" + port_num;


var $ = jQuery.noConflict(); // Needed for WP plugin

// Below is the geo/ip callback from the telize.com tool (below)
function getgeoip(json) {
    ipdata = json;
    callbacks_done++;
    callback_to_store();
}

var geoip_site = document.createElement("geoip_site");
geoip_site.type="application/javascript";
geoip_site.src="http://www.telize.com/geoip?callback=getgeoip";
document.body.appendChild(geoip_site);


/* This SWF element is used by the Flash font detection tool 
 * (JS for this tool included in this file)
 */
var div_swf = document.createElement("font-detect-swf");
div_swf.id = "font-detect-swf"
document.body.appendChild(div_swf);

debug = false;

var ipdata = {};

// bigfonts contains all of the fonts collected to be sent to the database server
var bigfonts;


/* callbacks_done is used to keep track of whether or not font detection AND 
 * geoip collection have finished. This is needed so that the fingerprint is
 *  only stored once the callbacks for these two tools have completed.
 */
var callbacks_done = 0;


 /* wp_info_php contains the wordpress username if this file is currently
  * being used as a wordpress plugin. If this is uninitialize, then this is
  * not a wp plugin use, and therefore should not collect username
  */
var wp_info_php;

// Used for determining presence of a control user
var control = false;

/* The function below is called when font detection and geoip exit.
 * once both of those tools are done, callbacks_done will be 2,
 * and therefore the fingerprint is ready to be stored.
 * Here, if there is a username (currently only wp can provide this)
 * the username is associated to the fingerprint before the store.
 * If it is a wordpress page, fingerprint is stored on login.
 */
function callback_to_store() {
    if (callbacks_done === 2) {
        if (wp_info_php !== undefined) {
            if (!wp_info_php.user) {
                // wordpress fingerprint is collected only on login
                console.log("skipping store (null user)");
                return;
            }
	    console.log(wp_info_php.user);
            storeFinger(empty_response, wp_info_php.user);
	} else {
            storeFinger(empty_response, 0);
	}
    }

}

// Empty callback for store. Can be changed for debugging
function empty_response() { 
}

$.when(
    /* When the document is ready, and the ShockWave Flash Object file has been
     * successfully loaded, continue on to retrieve fonts, geoip, other
     * fingerprint info, and store.
     */
    $(document).ready(),
    $.getScript("http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function() {
    /* the geoip tool does not cooperate when added above in the .when()
     * block. It was added here to enforce that the geoip tool is loaded and
     * and will trigger the geoip callback.
     */
    $.getScript("http://www.telize.com/geoip?callback=getgeoip");
    
    /* Below is the code corresponding to font collection. Originally, this was
     * in a helper function in order to further modularize the code, but this
     * caused dependency complications with respect to the getScript calls.
     * Therefore, the font detection placed here for simplicity. Also, this is
     * the only aspect of the fingerprint (other than geoip) which has more than
     * a simple navigator object access. The ShockWave Flash script must run, 
     * and then a callback is run when the script completes. Therefore, our code
     * enforces that the flash script completes before fingerprints are stored.
     */
    var name;
    var flash = true;
    if (swfobject.getFlashPlayerVersion().major === 0) {
        flash = false;
    }
    if (flash === false) {
        /* Here, flash is not enabled in the client's browser. So, a simpler
         * font detection tool must be used which manually checks for the
         * presence of common fonts.
         */
        name = Detector.getFontList();
        bigfonts = name; 
        callbacks_done++;
	callback_to_store();
        return;
    }
    name = "Flash:";
    var fontDetect = new FontDetect("font-detect-swf", "/FontList.swf", function (fd) {
        // this is the Shockwave Flash callback after font detection is complete
        var fonts = fd.fonts();
        name += fonts[0].fontName;
        for (var i = 1, length = fonts.length; i < length; i++) {
            name += "," + (fonts[i].fontName); // concatenate fonts for storage

        }
        callbacks_done++;
        bigfonts = name;
        callback_to_store();
    });
});


/* Collect browser's HTTP Headers to be stored as an element of the browser
 * fingerprint.
 *
 * @returns {String} - http headers
 */
function getHTTPHeaders() {
    var req = new XMLHttpRequest();
    req.open('GET', document.location, false);
    req.send(null);
    var headers = req.getAllResponseHeaders().toLowerCase();
    return headers;
}

/* Collects plugins detected in user's browser, returns as array
 * 
 * @returns {Array} - array of plugins
 */
function getPluginArray() {
    var parray = [];
    var pelt = [];
    var plugins = navigator.plugins;
    for (var i = 0; i < plugins.length; i++) {
        pelt[0] = (plugins[i].name);
        pelt[1] = (plugins[i].filename);
        pelt[2] = plugins[i].version;
        parray.push(pelt);
        pelt = [];
    }
    return parray;
}


// String version of the getPluginArray function used for pretty printing
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

// Helper function for printing fingerprint strings in a formatted manner
function attributeLine(attribute) {
    if (!debug) {
        return "";
    } else {
        return "<br>" + attribute + ": ";
    }
}

// Returns a formatted string of certain fingerprint fields
function getFingerprintString() {
    var s = "";
    s = s + (new Date()).toUTCString();
    s = s + attributeLine("appCodeName") + navigator.appCodeName;
    s = s + attributeLine("appName") + navigator.appName;
    //s = s + attributeLine("appVersion") + navigator.appVersion;
    s = s + attributeLine("cookieEnabled") + navigator.cookieEnabled;
    s = s + attributeLine("language") + navigator.language;
    s = s + attributeLine("platform") + navigator.platform;
    s = s + attributeLine("userAgent") +navigator.userAgent;
    s = s + attributeLine("ip") +ipdata.ip;
    s = s + attributeLine("latitude") +ipdata.latitude;
    s = s + attributeLine("longitude") + ipdata.longitude;
    s = s + attributeLine("country") + ipdata.country;
    s = s + attributeLine("timezone") + ipdata.timezone;
    s = s + attributeLine("screensize") + screen.width + 'x' + screen.height + 'x' + screen.colorDepth;
    s = s + attributeLine("plugins") + getPluginString();
    s = s + attributeLine("fonts") + bigfonts;
    // the item below is set by the control plugin if it exists
    control = localStorage.getItem("goldfinger_uid");
    s = s + attributeLine("control") + control;
    
    return s;
}


// Returns a JSON representation of the fingerprint
function getFingerJSON() {
    
    jsonfinger = {};
    jsonfinger.appCodeName = (navigator.appCodeName);
    jsonfinger.appName = (navigator.appName);
    jsonfinger.cookieEnabled = navigator.cookieEnabled;
    jsonfinger.language = navigator.language;
    jsonfinger.platform = navigator.platform;
    jsonfinger.userAgent = (navigator.userAgent);
    jsonfinger.ip = ipdata.ip;
    jsonfinger.latitude = ipdata.latitude;
    jsonfinger.longitude = ipdata.longitude;
    jsonfinger.country = ipdata.country;
    jsonfinger.timezone = ipdata.timezone;
    jsonfinger.screenSize = screen.width + "x" + screen.height + "x" + screen.colorDepth;
    jsonfinger.plugins = getPluginArray();
    jsonfinger.fonts = bigfonts;
    // the item below is set by the control plugin if it exists
    jsonfinger.control = localStorage.getItem("goldfinger_uid");
    return jsonfinger;

}


/*Stores a fingerprint in the database with a given username.
 * 
 * @param {function} callback
 * @param {string} username
 * @returns {null}
 * 
 * When the request finishes, it passes the message from the server to the callback
 * function provided.
 */

function storeFinger(callback, username) {
    var data = getFingerJSON();
    data.dbRequest = "storeFinger";
    if(username){
        data.username=username;
    }
    
    data = JSON.stringify(data);
    var request = $.ajax({
        url: server_url,
        method: "POST",
        data: data,
        contentType: 'application/json',
        dataType: "html"
    });

    request.done(function (msg) {
        callback(msg);
    });

    request.fail(function (jqXHR, textStatus) {
        callback(textStatus);
    });

}

/*Clears the database. Passes the confirmation/error from the server to the 
 * callback function in the parameters 
 * 
 * @param {function} callback
 * @returns {null}
 */


/*Upon success, passes an array of JSON stringsfrom the server to the callback function
 * Otherwise, passes a failure message to the callback function
 * 
 * @param {function} callback
 * @returns {null}
 */
function showDB(callback) {
    
    data = {};
    data.dbRequest = "showDB";

    data = JSON.stringify(data);

    var request = $.ajax({
        url: server_url,
        method: "POST",
        data: data,
        contentType: 'json',
        dataType: "json"
    });

    request.done(function (msg) {
        callback(msg);

    });

    request.fail(function (jqXHR, textStatus) {
        callback(textStatus);
    });

}

/*Filters elements in the database for specific attributes/values
 * The query parameter must be a well-formatted JSON string, i.e., all values
 * other than literal numbers or true/false must be in double-quotes, and the
 * entire query must begin with { (no quotes) and end with } (no quotes).
 * It also follows mongo query rules, so queries may contain ranges, "$exists",
 * and other 
 * e.g. a valid query coud be 
 * {"username":{"$exists":1, "$ne":"bob"}"}
 * Which would return all entries in the database that has a username field that
 * is not equal to the string "bob"
 * 
 * The response from the server is an array of JSON strings corresponding to the
 * elements in the database that matched the query. This is passed as a paramter
 * to the callback function provided.
 * 
 * @param {function} callback
 * @param {string} query
 * @returns {null}
 */
function filterDB(callback, query) {
    data = {};
    data.dbRequest = "filterDB";
    data.query = query;
    data = JSON.stringify(data);
    var request = $.ajax({
        url: server_url,
        method: "POST",
        data: data,
        contentType: 'json',
        dataType: "json"
    });
    request.done(function (msg) {
        callback(msg);

    });
    request.fail(function (jqXHR, textStatus) {
        callback(textStatus);
    });
    
}


/*Analyzes the uniqueness of the database among fingerprints that have a non-null
 * username field. Therefore, a fingerprint is defined as unique if given the 
 * fingerprint and ignoring the timestamp/username, the set of non-null users 
 * that have that fingerprint has a size of one. I.E, the fingerprint may appear
 * multiple times and still be unique, as long as the username is always null or
 * 1 other non-null username. The number of unique, nonunique, and percentage of
 * uniqueness is passed in JSON string format to the callback function provided
 * 
 * @param {function} callback
 * @returns {null}
 */
function getUniqueness(callback) {
    data = {};
    data.dbRequest = "getUniqueness";
    data = JSON.stringify(data);
    var request = $.ajax({
        url: server_url,
        method: "POST",
        data: data,
        contentType: 'json',
        dataType: "json"
    });
    request.done(function (msg) {
        callback(msg);

    });
    request.fail(function (jqXHR, textStatus) {
        callback(textStatus);
    });
}


function getTimeAverage(callback, username){
    data = {};
    data.dbRequest = "getTimeAverage";
    data.username = username;
    data = JSON.stringify(data);
    var request = $.ajax({
        url: server_url,
        method: "POST",
        data: data,
        contentType: 'json',
        dataType: "json"
    });
    request.done(function (msg) {
        callback(msg);

    });
    request.fail(function (jqXHR, textStatus) {
        callback(textStatus);
    });
    
    
}









/* The code below (until the next license comment) originates (with some 
 * modifications) from the links below and does not have license restrictions. 
 * The code is used for font detection when flash is not present in a client's 
 * browser.
 *
 * Code initially from: lalit.org/lab/javascript-css-font-detect
 * With modifications from: http://stackoverflow.com/questions/17271116/font-detection-through-javascript-only-no-flash
 */
var Detector =
     {
       init: function()
    {
    this.h = document.getElementsByTagName("BODY")[0];
    this.d = document.createElement("DIV");
    this.s = document.createElement("SPAN");
    this.d.appendChild(this.s);
    this.d.style.fontFamily = "sans";
    this.s.style.fontFamily = "sans";
    this.s.style.fontSize = "72px";
    this.s.innerHTML = "mmmmmmmmmmlil";
    this.h.appendChild(this.d);
    this.defaultWidth = this.s.offsetWidth;
    this.defaultHeight = this.s.offsetHeight;
    this.h.removeChild(this.d)
   },
   test: function(a)
   {
    this.h.appendChild(this.d);
    var b = [];
    b.name = this.s.style.fontFamily = a;
    b.width = this.s.offsetWidth;
    b.height = this.s.offsetHeight;
    this.h.removeChild(this.d);
    a = a.toLowerCase();
    if (a == "serif") {
        b.found = true
    } else {
        b.found = (b.width != this.defaultWidth || b.height != this.defaultHeight)
    }
    return b
   },

   getFontList: function()
   {
    this.init();
    var a = ["cursive", "monospace", "serif", "sans-serif", "fantasy", "default",      "Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT Bold", "Book Antiqua", "Bookman Old Style", "Bradley Hand ITC", "Bodoni MT", "Calibri", "Century", "Century Gothic", "Casual", "Comic Sans MS", "Consolas", "Copperplate Gothic Bold", "Courier", "Courier New", "English Text MT", "Felix Titling", "Futura", "Garamond", "Geneva", "Georgia", "Gentium", "Haettenschweiler", "Helvetica", "Impact", "Jokerman", "King", "Kootenay", "Latha", "Liberation Serif", "Lucida Console", "Lalit", "Lucida Grande", "Magneto", "Mistral", "Modena", "Monotype Corsiva", "MV Boli", "OCR A Extended", "Onyx", "Palatino Linotype", "Papyrus", "Parchment", "Pericles", "Playbill", "Segoe Print", "Shruti", "Tahoma", "TeX", "Times", "Times New Roman", "Trebuchet MS", "Verdana", "Verona"];
    var c = "";
    for (i = 0; i < a.length; ++i) {
        var b = this.test(a[i]);
        if (b.found) {
            c += b.name + ","
        }
    }
    return c.slice(0, - 1)
}
  };
  
  function get_fonts() { // from panopticlick
  // Try flash first
	var fonts = "";
	var obj = document.getElementById("flashfontshelper");
	if (obj && typeof(obj.GetVariable) != "undefined") {
		fonts = obj.GetVariable("/:user_fonts");
    fonts = fonts.replace(/,/g,", ");
    fonts += " (via Flash)";
	} else {
    // Try java fonts
    try {
      var javafontshelper = document.getElementById("javafontshelper");
      var jfonts = javafontshelper.getFontList();
      for (var n = 0; n < jfonts.length; n++) {
        fonts = fonts + jfonts[n] + ", ";
      }
    fonts += " (via Java)";
    } catch (ex) {}
  }
  if ("" == fonts)
    fonts = "No Flash or Java fonts detected";
  return fonts;
}



/* The code below is from an open tool. License information found in txt file
 * provided in the same directory as this file. This includes the rest of the
 * code in this file, and is all used for font detection using flash.
 */
/*
 * Javascript -> SWF -> Javascript font detection.
 *
 * @author Gabriel Handford
 * @website http://rel.me
 * 
 * @see http://www.lalit.org/lab/javascript-css-font-detect
 */

var FontDetect = function(swfId, swfLocation, onReady) {
  this._swfId = swfId;
  this._swfObjectId = swfId;
  this._swfLocation = swfLocation;
  this._onReady = onReady;
  this._fallbackWidthCache = null;
  
  this.loadSWF();
}

var FontDetectGlobal = (function() {
  var instance = {};
  return {
    register: function(id, object) {
      instance[id] = object;
    },    
    remove: function(id) {
      var object = instance[id];
      instance[id] = null;
      return object;
    }
  };
})();

FontDetect.prototype = {
  
  loadSWF: function() {
    var flashvars = { onReady: "onFontDetectReady", swfObjectId: this._swfObjectId };
    var params = { allowScriptAccess: "always", menu: "false" };
    var attributes = { id: this._swfObjectId, name: this._swfObjectId };
    swfobject.embedSWF(this._swfLocation, this._swfId, "1", "1", "9.0.0", false, flashvars, params, attributes);    
    
    FontDetectGlobal.register(this._swfObjectId, this);
    
    $(document).bind('swfLoaded', function(event, id) {
      var fontDetect = FontDetectGlobal.remove(id);
      fontDetect._onReady(fontDetect);
    });
  },
  
  checkOffsetWidth: function(family, size) {
    var node = document.createElement("p");        
    $(node).css("font-family", family);    
    $(node).css("font-size", size);
    $(node).css("display", "inline");
    $(node).addClass("font-test")
    
    // This was from http://www.lalit.org/lab/javascript-css-font-detect
    $(node).html("mmmmmmmmml"); // m or w take up max width
    $("body").append(node);
    var width = node.offsetWidth;
    $("body p.font-test").remove();
    return width;
  },

  fallbackWidth: function() {
    if (!this._fallbackWidthCache) this._fallbackWidthCache = this.checkOffsetWidth("Times New Roman", "120px");
    return this._fallbackWidthCache;
  },

  checkFont: function(family) {
    // We use Times New Roman as a fallback
    if (family == "Times New Roman") return true;    
  
    // Ignore fonts like: 'Arno Pro Semibold 18pt'
    if (/\d+pt\s*$/.test(family)) return false;
  
    var familyWidth = this.checkOffsetWidth("'" + family + "', Times New Roman", "120px");
    return (familyWidth != this.fallbackWidth());
  },
  
  filterFonts: function(fonts) {
    var filtered = []; 
    for (var i = 0, length = fonts.length; i < length; i++) {
      if (this.checkFont(fonts[i].fontName))
        filtered.push(fonts[i]);
    }
    return filtered;
  },
    
  fonts: function() {
    // Use when doing static publishing
    //var swf = swfobject.getObjectById(this._swfObjectId);
      
    // Works with dynamic publishing
    var swfElement = document.getElementById(this._swfObjectId);
    var fonts = swfElement.fonts();
    return this.filterFonts(fonts);
  }
  
};

// Callback for Flash
var onFontDetectReady = function(swfObjectId) {
  $(document).trigger('swfLoaded', [ swfObjectId ]);
};


