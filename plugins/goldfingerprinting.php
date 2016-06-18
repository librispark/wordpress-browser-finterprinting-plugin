<?php
/**
 * @package goldfingerprint
 * @version .1
 */
/*
Plugin Name: Gold Fingerprint
Plugin URI: http://wordpress.org/plugins/hello-dolly/
Description: This will fingerprint anyone who visits the page, and send a REST request to our server
Author: Group 12
Version: .1
Author URI:
*/

function login() {
       
    //initialize the login object
       
    
    $fields = array(
        'username'     =>0, 
        'password'     =>0,
        'timestamp'    =>0
        
     );
    //create a login dialogg

    foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
    rtrim($fields_string, '&');
    //create a connection to the server
    $url = 'http://volition.cs.umd.edu:8080'; 
    $ch = curl_init();

    //set the url, number of POST vars, POST data
    curl_setopt($ch,CURLOPT_URL, $url);
    curl_setopt($ch,CURLOPT_POST, count($fields));
    curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

   // $result = curl_exec($ch);
    
    return;
}




//when plugins are loaded, IE when the user opens the page, run the fingerprint method
add_action( 'init', 'fingerprint' );

add_action( 'wp_enqueue_scripts', 'my_enqueued_assets' );
    function my_enqueued_assets() {
        wp_enqueue_script( 'browser-fingerprint-script', plugin_dir_url( __FILE__ ) . '/js/browser-fingerprint-script.js', array('jquery' ), '1.0', true );
    }

?>
