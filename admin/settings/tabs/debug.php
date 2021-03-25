<?php
namespace FEP\Admin\Settings\Tabs;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class FEP_Debug_Tab {

    public function __construct() {

        //add_action( 'admin_init', [ $this, 'admin_init' ] );

		add_action('wp_ajax_fep_get_options', [ $this, 'get_row_sql' ]);
		add_action( 'wp_ajax_nopriv_fep_get_options', [ $this, 'get_row_sql' ]);

		add_action('wp_ajax_fep_reset_options', [ $this, 'delete_row_sql' ]);
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
					'label' 			 => __( 'Check the user preferences', 'flexible-elementor-panel' ),
					'class'              => 'fep-check-options',
					'after'              => '<pre class="fep-check-options-notice"></pre>',
					'label_button'       => __( 'CHECK THE OPTIONS USED BY FEP FROM THE DATABASE AND LOCAL STORAGE', 'flexible-elementor-panel' ),
					//'desc'               => __( '', 'flexible-elementor-panel' ),
					'type'               => 'button',
				],
				[
					'name'               => 'fep_reset_panel',
					'label' 			 => __( 'Reset Editor Panel', 'flexible-elementor-panel' ),
					'class'              => 'fep-reset-panel',
					'after'              => '<span class="fep-reset-panel-notice" style="opacity:0">' . __('The position/size of the Elementor editor panel has been reset!', 'flexible-elementor-panel') . '</span>',
					'label_button'       => __( 'RESET THE POSITION/SIZE OF THE ELEMENTOR EDITOR PANEL.', 'flexible-elementor-panel' ),
					'desc'               => __( 'FEP uses the local storage of your navigator to save the position of the Elementor editor panel. Reset to default with this button.', 'flexible-elementor-panel' ),
					'type'               => 'button',
				],
				[
					'name'               => 'fep_reset_options',
					'label' 			 => __( 'Reset FEP Options', 'flexible-elementor-panel' ),
					'class'              => 'fep-reset-options',
					'after'              => '<span class="fep-reset-options-notice" style="opacity:0">' . __('The FEP options have been removed from the database!', 'flexible-elementor-panel') . '</span>',
					'label_button'       => __( 'DELETE THE FEP OPTIONS FROM THE DATABASE.', 'flexible-elementor-panel' ),
					'desc'               => __( 'FEP saves these options with the native saving of the Elementor options. Delete FEP options with this button. <red>Please backup your database before deletion of the FEP options.</red>', 'flexible-elementor-panel' ),
					'type'               => 'button',
				],
        	]
        ];

        return $section;

    }


	public static function get_row_sql() {

		$nonce = $_POST['nonce'];

		if ( wp_verify_nonce( $nonce, 'fep-nonce-admin' ) ) {

			// init
			$html = '';

			$panel_size_width 	= $_POST['panel_size_width'] != '' ? $_POST['panel_size_width'] : __('no value','flexible-elementor-panel');
			$panel_size_height 	= $_POST['panel_size_height'] != '' ? $_POST['panel_size_height'] : __('no value','flexible-elementor-panel');
			$panel_pos_top 		= $_POST['panel_pos_top'] != '' ? $_POST['panel_pos_top'] : __('no value','flexible-elementor-panel');
			$panel_pos_left 	= $_POST['panel_pos_left'] != '' ? $_POST['panel_pos_left'] : __('no value','flexible-elementor-panel');
			$panel_pos_right	= $_POST['panel_pos_right'] != '' ? $_POST['panel_pos_right'] : __('no value','flexible-elementor-panel');
			$in_move 			= $_POST['in_move'] != '' ? $_POST['in_move'] : __('no value','flexible-elementor-panel') . $_POST['in_move'];

			$_elementor_fep_settings_html = ''; //start

			$options = [
				'_elementor_fep_settings',
				/*'fep_informations',
				'fep_how_to_configure',
				'fep_debug',*/
			];

			//echo var_dump($options);
			//exit;

			foreach ($options as $option => $name) {

				if ( get_option( $name ) ) {

					if ( $name == '_elementor_fep_settings' ) {
						foreach (get_option( $name ) as $key => $value) {

							if ( !$value ) {
								$value = 'no';
							}

							$_elementor_fep_settings_html .= '<b>(' . $name . ') ' . $key . '</b><small> ' . __('with the value', 'flexible-elementor-panel') . ' </small><b>' . $value . '</b><br>';

						}
					} else {

						$_elementor_fep_settings_html .= '<b>' . $name . '</b><small> ' . __('with the value', 'flexible-elementor-panel') . ' </small><b>' . get_option( $name ) . '</b><br>';

					}

				}
			}

			//echo var_dump(array( 0 => get_option('_elementor_fep_settings')) );

			$settings = get_user_meta( get_current_user_id(), 'elementor_preferences', false );
			if ( $settings ) {
				foreach ($settings[0] as $key => $value) {

					if ( !$value ) {
						$value = 'no';
					}

					$elementor_preferences_html .= '<b>user_meta_(elementor_preferences) ' . $key . '</b><small> ' . __('with the value', 'flexible-elementor-panel') . ' </small><b>' . $value . '</b><br>';

				}
				$html .= '<center>/********* START DEBUG SQL ELEMENTOR 3.0+ AND FEP 2.2+ *********\</center><br><br>';
				$html .= $elementor_preferences_html . '<br><br>';
				$html .= __('Note: all settings saved, will be print above. If the settings not appear, it means it is configured by default', 'flexible-elementor-panel') . '<br><br>';
				$html .= '<center>/********* END DEBUG SQL ELEMENTOR 3.0+ AND FEP 2.2+ *********\</center><br><br>';

				//echo var_dump($settings);
				//exit;
			}

			if ( !empty($_elementor_fep_settings_html) ) {
				$html .= '<center>/********* START DEBUG SQL (Deprecated) *********\</center><br><br>';
				$html .= $_elementor_fep_settings_html . '<br><br>';
				$html .= __('Note: all settings saved, will be print above. If the settings not appear, it means it is configured by default', 'flexible-elementor-panel') . '<br><br>';
				$html .= '<center>/********* END DEBUG SQL (Deprecated) *********\</center><br><br>';
			}
			$html .= '<center>/********* START DEBUG LOCAL STORAGE *********\</center><br><br>';
			$html .= __('Size of "Width Panel"', 'flexible-elementor-panel') .' <b>'. $panel_size_width.'</b><br>';
			$html .= __('Size of "Height Panel"', 'flexible-elementor-panel') .' <b>'. $panel_size_height.'</b><br>';
			$html .= __('Position of "Top Panel"', 'flexible-elementor-panel') .' <b>'. $panel_pos_top.'</b><br>';
			$html .= __('Position of "Left Panel"', 'flexible-elementor-panel') .' <b>'. $panel_pos_left.'</b><br>';
			$html .= __('Position of "Right Panel"', 'flexible-elementor-panel') .' <b>'. $panel_pos_right.'</b><br>';
			$html .= __('Value of "Move Panel"', 'flexible-elementor-panel') .' <b>'. $in_move .'</b><br><br>';
			$html .= __('Note: These value save automatically from your navigator after move and resize the editor panel', 'flexible-elementor-panel') . '<br><br>';
			$html .= '<center>/********* END DEBUG LOCAL STORAGE *********\</center><br><br>';

			echo $html;

			die; //stop there

		}

	}

	public static function delete_row_sql() {

		$nonce = $_POST['nonce'];

	    if ( wp_verify_nonce( $nonce, 'fep-nonce-admin' ) ) {

			if( get_option( '_elementor_fep_settings' ) ) {
				delete_option( '_elementor_fep_settings' ); //options fep settings in editor panel // version old 2.2.0 FEP
			}
			if( get_user_meta( get_current_user_id(), 'elementor_preferences', true ) ) {
				delete_user_meta(get_current_user_id(), 'elementor_preferences'); //options user preferences in editor panel // version up 2.2.0 FEP and Elementor 3.0
			}
			if( get_option( 'fep_informations' ) ) {
				delete_option( 'fep_informations' ); //tab
			}
			if( get_option( 'fep_how_to_configure' ) ) {
				delete_option( 'fep_how_to_configure' ); //tab
			}
			if( get_option( 'fep_debug' ) ) {
				delete_option( 'fep_debug' ); //tab
			}

	        die; //stop there

	    }

	}

}
new FEP_Debug_Tab;
