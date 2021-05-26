<?php

/*
Plugin Name: Tipo de cambio
Description: Plugin para conocer el tipo de cambio con la ultima actualización de la fecha.
Author: StartWebConsulting
Author URI: https://startwebconsulting.com/
Text Domain: EdsonDev
Domain Path: /
Version: 0.01
*/

//Plugin Settings Page
function my_plugin_settings_link($links) { 
    $settings_link = '<a href="admin.php?page=money-changer">Ajustes</a>'; 
    array_unshift($links, $settings_link); 
    return $links; 
}
$plugin = plugin_basename(__FILE__);
add_filter("plugin_action_links_$plugin", 'my_plugin_settings_link' );

defined('ABSPATH') or die("Bye bye");
define( 'WPMCH_PLUGIN', __FILE__ );
define( 'WPMCH_PLUGIN_BASENAME', plugin_basename( WPMCH_PLUGIN ) );
define( 'WPMCH_PLUGIN_NAME', trim( dirname( WPMCH_PLUGIN_BASENAME ), '/' ) );
define( 'WPMCH_PLUGIN_DIR', untrailingslashit( dirname( WPMCH_PLUGIN ) ) );

require_once WPMCH_PLUGIN_DIR . '/load.php';

?>