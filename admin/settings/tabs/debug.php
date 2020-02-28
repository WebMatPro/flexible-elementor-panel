<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class FEP_Debug_Tab {

    public function __construct() {

        //add_action( 'admin_init', [ $this, 'admin_init' ] );

		add_action ('wp_ajax_fep_get_options', [ $this, 'get_row_sql' ]);
		add_action( 'wp_ajax_nopriv_fep_get_options', [ $this, 'get_row_sql' ]);

		add_action ('wp_ajax_fep_reset_options', [ $this, 'delete_row_sql' ]);
		add_action( 'wp_ajax_nopriv_fep_reset_options', [ $this, 'delete_row_sql' ]);

    }

	//public function admin_init() {

    //}

    public static function section() {

        $section = [];

		$section = [
            'fep_debug' => [
				[
					'name'               => 'fep_check-options',
					'label' 			 => __( 'Check what FEP saved', 'fep' ),
					'class'              => 'fep-check-options',
					'after'              => '<pre class="fep-check-options-notice"></pre>',
					'label_button'       => __( 'Check the options used by FEP from the database and local storage', 'fep' ),
					//'desc'               => __( '', 'fep' ),
					'type'               => 'button',
				],
				[
					'name'               => 'fep_reset_panel',
					'label' 			 => __( 'Reset Editor Panel', 'fep' ),
					'class'              => 'fep-reset-panel',
					'after'              => '<span class="fep-reset-panel-notice" style="opacity:0">' . __('The position/size of the editor panel Elementor is reset!', 'fep') . '</span>',
					'label_button'       => __( 'Reset the position/size of Editor Panel Elementor', 'fep' ),
					'desc'               => __( 'FEP use the local storage of your navigator for save the position of your editor panel Elementor, clean all these with this button.', 'fep' ),
					'type'               => 'button',
				],
				[
					'name'               => 'fep_reset_options',
					'label' 			 => __( 'Reset FEP Options', 'fep' ),
					'class'              => 'fep-reset-options',
					'after'              => '<span class="fep-reset-options-notice" style="opacity:0">' . __('The FEP options has removed from the database!', 'fep') . '</span>',
					'label_button'       => __( 'Delete the options FEP from database', 'fep' ),
					'desc'               => __( 'FEP save these options with the saving native of Elementor options, delete these with this button. <red>Save your database before please!</red>', 'fep' ),
					'type'               => 'button',
				],
        	]
        ];

        return $section;

    }


	public static function get_row_sql() {

		$nonce = $_POST['nonce'];

		if ( wp_verify_nonce( $nonce, 'fep-nonce-admin' ) ) {

			$panel_size_width 	= $_POST['panel_size_width'] != '' ? $_POST['panel_size_width'] : __('no value','fep');
			$panel_size_height 	= $_POST['panel_size_height'] != '' ? $_POST['panel_size_height'] : __('no value','fep');
			$panel_pos_top 		= $_POST['panel_pos_top'] != '' ? $_POST['panel_pos_top'] : __('no value','fep');
			$panel_pos_left 	= $_POST['panel_pos_left'] != '' ? $_POST['panel_pos_left'] : __('no value','fep');
			$panel_pos_right	= $_POST['panel_pos_right'] != '' ? $_POST['panel_pos_right'] : __('no value','fep');
			$in_move 			= $_POST['in_move'] != '' ? $_POST['in_move'] : __('no value','fep') . $_POST['in_move'];

			//$_elementor_fep_settings_html = ''; //start

			$options = [
				'_elementor_fep_settings',
				/*'fep_informations',
				'fep_how_to_configure',
				'fep_divers',
				'fep_debug',*/
			];

			//echo var_dump($options);
			//exit;

			foreach ($options as $option => $name) {

				if ( !get_option( $name ) ) {

					$_elementor_fep_settings_html .= __('Options FEP not exist in the database','fep') . ' (' . $name . ')<br>';

				} else {

					if ( $name == '_elementor_fep_settings' ) {
						foreach (get_option( $name ) as $key => $value) {

							if ( !$value ) {
								$value = __('no', 'fep');
							}

							$_elementor_fep_settings_html .= '<b>(' . $name . ') ' . $key . '</b><small> ' . __('with the value', 'fep') . ' </small><b>' . $value . '</b><br>';

						}
					} else {

						$_elementor_fep_settings_html .= '<b>' . $name . '</b><small> ' . __('with the value', 'fep') . ' </small><b>' . get_option( $name ) . '</b><br>';

					}

				}
			}


			$html = '<center>/********* START DEBUG SQL *********\</center><br><br>';
			$html .= $_elementor_fep_settings_html . '<br><br>';
			$html .= __('Note: all settings saved, will be print above. If the setting not appear, it means it is configured by default', 'fep') . '<br><br>';
			$html .= '<center>/********* END DEBUG SQL *********\</center><br><br>';
			$html .= '<center>/********* START DEBUG LOCAL STORAGE *********\</center><br><br>';
			$html .= __('Size of "Width Panel"', 'fep') .' <b>'. $panel_size_width.'</b><br>';
			$html .= __('Size of "Height Panel"', 'fep') .' <b>'. $panel_size_height.'</b><br>';
			$html .= __('Position of "Top Panel"', 'fep') .' <b>'. $panel_pos_top.'</b><br>';
			$html .= __('Position of "Left Panel"', 'fep') .' <b>'. $panel_pos_left.'</b><br>';
			$html .= __('Position of "Right Panel"', 'fep') .' <b>'. $panel_pos_right.'</b><br>';
			$html .= __('Value of "Move Panel"', 'fep') .' <b>'. $in_move .'</b><br><br>';
			$html .= __('Note: These value save automatically from your navigator after move and resize the editor panel', 'fep') . '<br><br>';
			$html .= '<center>/********* END DEBUG LOCAL STORAGE *********\</center><br><br>';

			echo $html;

			die; //stop there

		}

	}

	public static function delete_row_sql() {

		$nonce = $_POST['nonce'];

	    if ( wp_verify_nonce( $nonce, 'fep-nonce-admin' ) ) {

	        delete_option( '_elementor_fep_settings' ); //options fep settings in editor panel
			delete_option( 'fep_informations' ); //tab
			delete_option( 'fep_how_to_configure' ); //tab
			delete_option( 'fep_divers' ); //tab
			delete_option( 'fep_debug' ); //tab

	        die; //stop there

	    }

	}

}
new FEP_Debug_Tab;
