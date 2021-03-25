<?php
namespace FEP\Inc\Settings;

use FEP\Inc\Settings\Model as FEP_Model;

use Elementor\Controls_Manager;
use Elementor\Core\Settings\Base\Manager as BaseManager;
use Elementor\Core\Settings\Base\Model as BaseModel;


if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Manager extends BaseManager {

	const OPTIONS_KEY = '_elementor_fep_settings';

	/**
	 * Get model for config.
	 *
	 * Retrieve the model for settings configuration.
	 *
	 * @since 2.8.0
	 * @access public
	 *
	 * @return BaseModel The model object.
	 *
	 */
	public function get_model_for_config() {
		return $this->get_model();
	}

	public function __construct() {
		parent::__construct();

		$this->add_panel_tabs();
	}

	public function get_name() {
		return 'fep';
	}

	// add the FEP settings to editor panel
	private function add_panel_tabs() {
		Controls_Manager::add_tab( 'fep_settings', __( 'Settings', 'flexible-elementor-panel' ) );
	}

	// get saved settings for apply it to load
	protected function get_saved_settings( $id ) {

		$settings = []; // create the table

		$options = get_option( self::OPTIONS_KEY, null );
		if( $options !== null ) {

			foreach ( $options as $option => $value) {

				$settings[ $option ] = $value;

			}

		}

		return $settings;
	}

	// save settings when some option fep is changed
	protected function save_settings_to_db(array $settings, $id) {

		$model_controls = FEP_Model::get_controls_list();

		$one_list_settings = [];

		foreach ( $model_controls as $tab_name => $sections ) {

			foreach ( $sections as $section_name => $section_data ) {

				foreach ( $section_data['controls'] as $control_name => $control_data ) {

					if ( isset( $settings[ $control_name ] ) ) {
					//si le controle est sans valuer (yes ou par default dans elementor), il doit retourner son default

						$one_list_control_name = str_replace( 'elementor_', '', $control_name ); // remove the slug before option 'elementor_'
						$one_list_settings[ $one_list_control_name ] = $settings[ $control_name ]; // add to table

					} else {

						if ( isset($control_data['default']) ) {
							$one_list_control_name = str_replace( 'elementor_', '', $control_name ); // remove the slug before option 'elementor_'
							$one_list_settings[ $one_list_control_name ] = $control_data['default']; // add to table (default value if not set)
						}

					}

				}
			}
		}

		// Save all settings in one list
		if ( ! empty( $one_list_settings ) ) {
			update_option( self::OPTIONS_KEY, $one_list_settings ); // update the single option fep and include the table
		}

	}

	// get settings from database to share in javascript
	public static function get_settings() {

		$settings = []; // create the table

		$options = get_option( self::OPTIONS_KEY, null );

		if( $options !== null ) {

			foreach ( $options as $option => $value) {

				$settings[ $option ] = $value;

			}

		} else {

			// there to get all control FEP with default value if any database exist
			$model_controls = FEP_Model::get_controls_list();

			foreach ( $model_controls as $tab_name => $sections ) {

				foreach ( $sections as $section_name => $section_data ) {

					foreach ( $section_data['controls'] as $control_name => $control_data ) {

						if ( isset($control_data['default']) ) {
							$one_list_control_name = str_replace( 'elementor_', '', $control_name ); // remove the slug before option 'elementor_'
							$settings[ $one_list_control_name ] = $control_data['default']; // add to table
						}

					}
				}
			}


		}

		return $settings;

	}

}
