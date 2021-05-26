<?php

add_action( 'admin_init', 'wpmch_admin_init', 10, 0 );

function wpmch_admin_init() {
	do_action( 'wpmch_admin_init' );
}

add_action( 'admin_menu', 'wpmch_admin_menu', 9, 0 );
if( !function_exists("wpmch_admin_menu") ) { 
    function wpmch_admin_menu() {
        do_action( 'wpmch_admin_menu' );
        $page_title = 'Tipo de cambio';  
        $menu_title = 'Tipo de Cambio';
        $capability = 'manage_options';
        $menu_slug  = 'money-changer';
        $function   = 'moneychanger_page';
        $icon_url   = 'dashicons-money-alt';
        $position   = null;
        add_menu_page( 
            $page_title,                 
            $menu_title,                   
            $capability,                  
            $menu_slug,                   
            $function,               
            $icon_url,   
            $position 
        );
        add_action( 'admin_init', 'update_money_changer_settings' );
    } 
}

if ( !function_exists("moneychanger_page") ) {
    function moneychanger_page() {
        ?>
        <div style="width: 100%; max-width: 600px;">
            <h1>Wp Tipo de cambio</h1>
            <p>shortcode [tipo-cambio]</p>
            <form method="post" action="options.php">
                <?php settings_fields( 'money-changer-settings' ); ?>
                <?php do_settings_sections( 'money-changer-settings' ); ?>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Url api:</th>
                        <td>
                            <input required type="url" name="mch_url" value="<?php echo get_option('mch_url'); ?>" style="width:100%"/>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Moneda:</th>
                        <td>
                            <input type="checkbox" id="dolar" name="mch_type_money[]" value="2" <?php echo (get_option('mch_type_money')[0] == 2) ? 'checked' : ''; ?>>
                            <label for="dolar"> Dólares</label><br>
                            <input type="checkbox" id="euro" name="mch_type_money[]" value="3" <?php echo (get_option('mch_type_money')[1] == 3) ? 'checked' : ''; ?>>
                            <label for="euro"> Euros</label><br>
                            <!-- <input required type="checkbox" id="otro" name="mch_type_money[]" value="4" <?php echo (get_option('mch_type_money')[2] == 4) ? 'checked' : ''; ?>>
                            <label for="otro"> Otro</label><br> -->
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Actualización en minutos:</th>
                        <td>
                            <input required type="number" step="1" min="1" name="mch_time" value="<?php echo get_option('mch_time'); ?>" style="width:100%"/>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Color:</th>
                        <td>
                            <input required type="color" name="mch_color" value="<?php echo get_option('mch_color'); ?>"/>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">url botón "Iniciar operación":</th>
                        <td>
                            <input required type="text" name="mch_url_btn" placeholder="/" value="<?php echo get_option('mch_url_btn'); ?>" style="width:100%"/>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Lista:</th>
                        <td>
                            <textarea name="mch_list" cols="30" rows="5" placeholder="- Lista uno&#10;- Lista dos #tooltip#" style="width:100%"><?php echo get_option('mch_list'); ?></textarea>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Mensaje de cupón válido:</th>
                        <td>
                            <input type="text" name="mch_msg_success" value="<?php echo get_option('mch_msg_success'); ?>" style="width:100%"/>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Mensaje de cupón inválido:</th>
                        <td>
                            <input type="text" name="mch_msg_error" value="<?php echo get_option('mch_msg_error'); ?>" style="width:100%"/>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php 
    }
}

if( !function_exists("update_money_changer_settings") ) { 
    function update_money_changer_settings() {
        register_setting( 'money-changer-settings', 'mch_url' );
        register_setting( 'money-changer-settings', 'mch_type_money' );
        register_setting( 'money-changer-settings', 'mch_color' );
        register_setting( 'money-changer-settings', 'mch_url_btn' );
        register_setting( 'money-changer-settings', 'mch_time' );
        register_setting( 'money-changer-settings', 'mch_list' );
        register_setting( 'money-changer-settings', 'mch_msg_success' );
        register_setting( 'money-changer-settings', 'mch_msg_error' );
    }
}
