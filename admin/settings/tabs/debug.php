<?php
namespace FEP\Admin\Settings\Tabs;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class FEP_Debug_Tab {

	public function __construct() {
		add_action('wp_ajax_fep_get_options', [ $this, 'get_row_sql' ]);
		add_action('wp_ajax_fep_reset_options', [ $this, 'delete_row_sql' ]);
	}

	public static function section() {
		return [
			'fep_debug' => [
				[
					'name' => 'fep_check-options',
					'label' => __( 'Check the user preferences', 'flexible-editor-panel' ),
					'class' => 'fep-check-options',
					'after' => '<pre class="fep-check-options-notice"></pre>',
					'label_button' => __( 'CHECK THE OPTIONS USED BY FEP FROM THE DATABASE AND LOCAL STORAGE', 'flexible-editor-panel' ),
					'type' => 'button',
				],
				[
					'name' => 'fep_reset_panel',
					'label' => __( 'Reset Editor Panel', 'flexible-editor-panel' ),
					'class' => 'fep-reset-panel',
					'after' => '<span class="fep-reset-panel-notice" style="opacity:0">' . __('The position/size of the Elementor editor panel has been reset!', 'flexible-editor-panel') . '</span>',
					'label_button' => __( 'RESET THE POSITION/SIZE OF THE ELEMENTOR EDITOR PANEL.', 'flexible-editor-panel' ),
					'desc' => __( 'FEP uses the local storage of your navigator to save the position of the Elementor editor panel. Reset to default with this button.', 'flexible-editor-panel' ),
					'type' => 'button',
				],
				[
					'name' => 'fep_reset_options',
					'label' => __( 'Reset FEP Options', 'flexible-editor-panel' ),
					'class' => 'fep-reset-options',
					'after' => '<span class="fep-reset-options-notice" style="opacity:0">' . __('The FEP options have been removed from the database!', 'flexible-editor-panel') . '</span>',
					'label_button' => __( 'DELETE THE FEP OPTIONS FROM THE DATABASE.', 'flexible-editor-panel' ),
					'desc' => __( 'FEP saves these options with the native saving of the Elementor options. Delete FEP options with this button. <red>Please backup your database before deletion of the FEP options.</red>', 'flexible-editor-panel' ),
					'type' => 'button',
				],
			],
		];
	}

	public static function get_row_sql() {
		self::authorize_ajax_request();

		$submitted_values = [];
		foreach (['panel_size_width', 'panel_size_height', 'panel_pos_top', 'panel_pos_left', 'panel_pos_right', 'in_move'] as $key) {
			$value = $_POST[$key] ?? '';
			$submitted_values[$key] = is_scalar($value)
				? sanitize_text_field(wp_unslash((string) $value))
				: '';
		}

		$html = '';
		$legacy_settings = get_option('_elementor_fep_settings', []);
		if (is_array($legacy_settings)) {
			foreach ($legacy_settings as $key => $value) {
				$value = empty($value) ? 'no' : self::format_debug_value($value);
				$html .= '<b>(' . esc_html('_elementor_fep_settings') . ') ' . esc_html((string) $key) . '</b><small> '
					. esc_html__('with the value', 'flexible-editor-panel') . ' </small><b>' . esc_html($value) . '</b><br>';
			}
		}

		$settings = get_user_meta(get_current_user_id(), 'elementor_preferences', true);
		if (is_array($settings) && $settings !== []) {
			$elementor_preferences_html = '';
			foreach ($settings as $key => $value) {
				$value = empty($value) ? 'no' : self::format_debug_value($value);
				$elementor_preferences_html .= '<b>user_meta_(elementor_preferences) ' . esc_html((string) $key)
					. '</b><small> ' . esc_html__('with the value', 'flexible-editor-panel') . ' </small><b>'
					. esc_html($value) . '</b><br>';
			}
			$html .= '<center>/********* START DEBUG SQL ELEMENTOR 3.0+ AND FEP 2.2+ *********\\</center><br><br>';
			$html .= $elementor_preferences_html . '<br><br>';
			$html .= esc_html__('Note: all settings saved, will be print above. If the settings not appear, it means it is configured by default', 'flexible-editor-panel') . '<br><br>';
			$html .= '<center>/********* END DEBUG SQL ELEMENTOR 3.0+ AND FEP 2.2+ *********\\</center><br><br>';
		}

		if ($legacy_settings !== []) {
			$html .= '<center>/********* START DEBUG SQL (Deprecated) *********\\</center><br><br>';
			$html .= '<br>' . esc_html__('Note: all settings saved, will be print above. If the settings not appear, it means it is configured by default', 'flexible-editor-panel') . '<br><br>';
			$html .= '<center>/********* END DEBUG SQL (Deprecated) *********\\</center><br><br>';
		}

		$labels = [
			'panel_size_width' => __('Size of "Width Panel"', 'flexible-editor-panel'),
			'panel_size_height' => __('Size of "Height Panel"', 'flexible-editor-panel'),
			'panel_pos_top' => __('Position of "Top Panel"', 'flexible-editor-panel'),
			'panel_pos_left' => __('Position of "Left Panel"', 'flexible-editor-panel'),
			'panel_pos_right' => __('Position of "Right Panel"', 'flexible-editor-panel'),
			'in_move' => __('Value of "Move Panel"', 'flexible-editor-panel'),
		];
		$html .= '<center>/********* START DEBUG LOCAL STORAGE *********</center><br><br>';
		foreach ($labels as $key => $label) {
			$value = $submitted_values[$key] !== '' ? $submitted_values[$key] : __('no value', 'flexible-editor-panel');
			$html .= esc_html($label) . ' <b>' . esc_html($value) . '</b><br>';
		}
		$html .= '<br>' . esc_html__('Note: These value save automatically from your navigator after move and resize the editor panel', 'flexible-editor-panel') . '<br><br>';
		$html .= '<center>/********* END DEBUG LOCAL STORAGE *********</center><br><br>';

		echo $html;
		wp_die();
	}

	public static function delete_row_sql() {
		self::authorize_ajax_request();

		if (get_option('_elementor_fep_settings')) {
			delete_option('_elementor_fep_settings');
		}
		$user_id = get_current_user_id();
		$preferences = get_user_meta($user_id, 'elementor_preferences', true);
		if (is_array($preferences)) {
			$fep_controls = \FEP\Inc\Settings\FEP_Controls::get_controls_list();
			foreach ($fep_controls as $sections) {
				foreach ($sections as $section) {
					foreach (array_keys($section['controls']) as $control_name) {
						unset($preferences[$control_name]);
					}
				}
			}

			if ($preferences === []) {
				delete_user_meta($user_id, 'elementor_preferences');
			} else {
				update_user_meta($user_id, 'elementor_preferences', $preferences);
			}
		}
		if (get_option('fep_informations')) {
			delete_option('fep_informations');
		}
		if (get_option('fep_how_to_configure')) {
			delete_option('fep_how_to_configure');
		}
		if (get_option('fep_debug')) {
			delete_option('fep_debug');
		}

		wp_die();
	}

	private static function authorize_ajax_request(): void {
		if (! check_ajax_referer('fep-nonce-admin', 'nonce', false) || ! current_user_can('manage_options')) {
			wp_die(-1, '', ['response' => 403]);
		}
	}

	private static function format_debug_value($value): string {
		if (is_scalar($value)) {
			return (string) $value;
		}

		$encoded = wp_json_encode($value);
		return $encoded === false ? '' : $encoded;
	}
}
