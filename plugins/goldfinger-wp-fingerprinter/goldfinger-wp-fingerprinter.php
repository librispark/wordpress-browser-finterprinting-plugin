<?php
/**
* Plugin Name: goldfinger browser fingerprinter
* Plugin URI: http://volition.cs.umd.edu
* Description: This plugin adds some browser fingerprinting capability to your wordpress site.
* Version: 1.0.0
* Author: Team Goldfinger CMSC435
* Author URI: http://volition.cs.umd.edu
* License: GPL2
*/

function my_custom_js1() {
    wp_enqueue_script( 'script-name', plugins_url() . '/goldfinger-wp-fingerprinter/js/bfp.js', array(), '1.0.0', true );
}

function my_custom_js2() {
    echo '<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>';
	echo '<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>';
    echo '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">';
    echo '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">';
    echo '<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>';
    echo '<script type="text/javascript" src="' . plugins_url() . '/goldfinger-wp-fingerprinter/js/bfp.js"></script>';
    echo '<script language="javascript" type="text/javascript"> function resizeIframe(obj) {obj.style.height = obj.contentWindow.document.body.scrollHeight + "px";}</script>';    
}

/* Add hook for admin <head></head> */
add_action('admin_head', 'my_custom_js1'); 

/* Add hook for front-end <head></head> */
add_action('wp_head', 'my_custom_js2');


/* Add the frame when the wordpress theme calls it to the test page as an iFrame */
add_action('goldfinger_test_frame_hook', 'goldfinger_test_frame_callback');

function goldfinger_test_frame_callback() {
    echo '<div class="modal fade bs-example-modal-sm" id="checkUserPopup"><div class="modal-dialog"><div class="modal-content"><div class="modal-header">'
            . '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
            . '<h2 class="modal-title">Browser Fingerprinting Plugin</h2></div><div class="modal-body">'
        . '<form id="participateForm" class="form-horizontal"><fieldset><legend>User Participation Form</legend>'
        . '<div class="control-group"><label class="control-label" for="email">Email</label><div class="controls">'
            . '<input id="email" name="email" type="text" placeholder="Email" class="input-xlarge" required="">'
            . '<p class="help-block">Please enter your email to participate</p></div></div>'
        . '<div class="control-group"><label class="control-label" for="emailConfirm">Confirm Email</label><div class="controls">'
            . '<input id="emailConfirm" name="emailConfirm" type="text" placeholder="Confirm Email" class="input-xlarge" required="">'
            . '<p class="help-block">Please confirm your email</p></div></div></fieldset></form>'
        . '</div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" id="participateFormSaveButton" class="btn btn-primary">Save changes</button>'
        . '</div></div></div></div>';
    echo '<script language="javascript" type="text/javascript"> setTimeout(function resizeIframe(obj) { $("#checkUserPopup").modal("show") },5000);</script>'; 
	echo '<iframe frameborder="0" scrolling="yes" width="100%" height="500" src="' . plugins_url() . '/goldfinger-wp-fingerprinter/groupA/fingerprint_test.html" name="fingerprintFrame" id="fingerprintFrame" onload="javascript:resizeIframe(this);"> <p>iframes are not supported.</p> </iframe><br />';
}

function goldfinger_test_frame() {
do_action('goldfinger_test_frame_hook');
}


?>