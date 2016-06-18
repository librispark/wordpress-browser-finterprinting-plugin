/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* Code initially from: lalit.org/lab/javascript-css-font-detect
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
