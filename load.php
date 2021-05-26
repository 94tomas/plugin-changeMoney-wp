<?php

if ( is_admin() ) {
	require_once WPMCH_PLUGIN_DIR . '/admin/admin.php';
} else {
	// require_once WPMCH_PLUGIN_DIR . '/includes/controller.php';
}

function func_load_vuescripts() {
    // wp_register_script( 'wpvue_vuejs', 'https://cdn.jsdelivr.net/npm/vue/dist/vue.js');
    wp_register_script('wpvue_vuejs', plugin_dir_url( __FILE__ ).'vue.min.js');
    wp_register_script('my_vuecode', plugin_dir_url( __FILE__ ).'code.min.js');
    // wp_register_script('my_vuecode', plugin_dir_url( __FILE__ ).'code.js');
    wp_register_style( 'my_styles', plugin_dir_url( __FILE__ ).'style.min.css' );
}
add_action('wp_enqueue_scripts', 'func_load_vuescripts');

//Add shortscode
function func_wp_vue(){

    $box_color = get_option( 'mch_color' );
    $box_url = get_option( 'mch_url' );
    $box_time = get_option( 'mch_time' );
    $box_type = get_option( 'mch_type_money' );
    $box_list = get_option( 'mch_list' );
    $box_btn_url = get_option( 'mch_url_btn' );
    $box_success = get_option( 'mch_msg_success' );
    $box_error = get_option( 'mch_msg_error' );
    //Add Vue.js
    wp_enqueue_script('wpvue_vuejs');
    wp_enqueue_script('my_vuecode');
    wp_enqueue_style( 'my_styles' );
    $str = "<div id='app'>"
            ."<money-changer "
                ."wpcolor='".$box_color."' "
                ."wpurl='".$box_url."' "
                ."wptime='".$box_time."' "
                ."wptype='".json_encode($box_type)."' "
                ."wplist='".$box_list."'"
                ."wpbtn='".$box_btn_url."'"
                ."wpok='".$box_success."'"
                ."wperror='".$box_error."'"
            ."></money-changer>"
            ."</div>";
    return $str;
} // end function

add_shortcode( 'tipo-cambio', 'func_wp_vue' );