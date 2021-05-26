<?php
// die when the file is called directly
if (!defined('WP_UNINSTALL_PLUGIN')) {
    die;
}
//define a vairbale and store an option name as the value.
$box_color = 'mch_color';
$box_url = 'mch_url';
$box_time = 'mch_time';
$box_type = 'mch_type_money';
$box_list = 'mch_list';
$box_btn_url = 'mch_url_btn';
$box_success = 'mch_msg_success';
$box_error = 'mch_msg_error';
//call delete option and use the vairable inside the quotations
delete_option($box_color);
delete_option($box_url);
delete_option($box_time);
delete_option($box_type);
delete_option($box_list);
delete_option($box_btn_url);
delete_option($box_success);
delete_option($box_error);