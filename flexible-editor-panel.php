<?php

/**
 * @wordpress-plugin
 * Plugin Name:         Flexible Editor Panel for Elementor
 * Plugin URI:          https://wordpress.org/plugins/flexible-elementor-panel/
 * Description:         An add-on for the Elementor page builder. Makes the editor panel flexible, draggable, resizable, foldable and adds many productivity features.
 * Short Description:   Makes the Elementor editor panel flexible, draggable, resizable, foldable and more.
 * Version:             2.6.0
 * Author:              WebMat
 * Author URI:          https://webmat.pro
 * License:             GPL-2.0+
 * License URI:         http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:         flexible-editor-panel
 * Domain Path:         /languages
 * Requires PHP:        7.4
 * Requires at least:   5.9
 * Elementor tested up to: 3.50.0
 * Elementor Pro tested up to: 3.50.0
 */

if (! defined('ABSPATH')) {
	exit;
}

// ─── Plugin Constants ────────────────────────────────────────────────
define('FEP_VERSION', '2.6.0');
define('FEP_FILE', __FILE__);
define('FEP_URL', plugins_url('/', __FILE__));
define('FEP_PATH', plugin_dir_path(__FILE__));
define('FEP_BASENAME', plugin_basename(__FILE__));

use FEP\Inc\Settings\FEP_Controls;

/**
 * Main Flexible Editor Panel Plugin Class.
 *
 * @since 1.0.0
 * @since 2.6.0 Rewritten — dropped Elementor < 3.0 support, PHP 7.4 minimum.
 */
final class Flexible_Editor_Panel
{

	private const MINIMUM_ELEMENTOR_VERSION = '3.21.0';
	private const MINIMUM_PHP_VERSION       = '7.4';

	private static ?self $_instance = null;

	public static function instance(): self
	{
		if (is_null(self::$_instance)) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	private function __construct()
	{
		add_action('init', [$this, 'load_textdomain']);
		add_action('plugins_loaded', [$this, 'init']);
	}

	/**
	 * Load plugin localisation files.
	 */
	public function load_textdomain(): void
	{
		load_plugin_textdomain(
			'flexible-editor-panel',
			false,
			dirname(plugin_basename(__FILE__)) . '/languages'
		);
	}

	/**
	 * Initialise the plugin after all plugins are loaded.
	 */
	public function init(): void
	{

		// ── Requirement checks ───────────────────────────────────────
		if (! did_action('elementor/loaded')) {
			add_action('admin_notices', [$this, 'notice_missing_elementor']);
			return;
		}

		if (! version_compare(ELEMENTOR_VERSION, self::MINIMUM_ELEMENTOR_VERSION, '>=')) {
			add_action('admin_notices', [$this, 'notice_minimum_elementor_version']);
			return;
		}

		if (version_compare(PHP_VERSION, self::MINIMUM_PHP_VERSION, '<')) {
			add_action('admin_notices', [$this, 'notice_minimum_php_version']);
			return;
		}

		// ── Bootstrap ────────────────────────────────────────────────
		$this->includes();

		// Activation notice
		add_action('admin_notices', [$this, 'notice_activation']);
		add_action('admin_init', [$this, 'admin_init_dismiss_notices']);

		// Editor assets
		add_action('elementor/editor/after_enqueue_styles', [$this, 'enqueue_editor_styles']);
		add_action('elementor/preview/enqueue_styles', [$this, 'enqueue_preview_styles']);
		add_action('elementor/editor/before_enqueue_scripts', [$this, 'enqueue_editor_scripts']);


		// Register FEP controls inside Elementor User Preferences
		new FEP_Controls();

		// Migrate legacy option to user meta (one-time)
		$this->maybe_migrate_legacy_options();
	}

	// ─── Includes ────────────────────────────────────────────────────

	private function includes(): void
	{

		if (is_admin()) {
			require_once FEP_PATH . 'admin/admin.php';
		}

		require_once FEP_PATH . 'inc/settings/controls.php';
	}

	// ─── Legacy migration (from pre-3.0 option to user meta) ─────────

	private function maybe_migrate_legacy_options(): void
	{
		$options = get_option('_elementor_fep_settings');
		if ($options !== false) {
			$this->migrate_user_preferences(get_current_user_id());
		}
	}

	public function migrate_user_preferences(int $user_id): void
	{
		$options = get_option('_elementor_fep_settings');
		if ($options === false) {
			return;
		}

		delete_user_meta($user_id, 'elementor_preferences');
		update_user_meta($user_id, 'elementor_preferences', $options);
		delete_option('_elementor_fep_settings');

		set_transient('fep-admin-notice-migration-done', true, 0);
	}

	// ─── Activation ──────────────────────────────────────────────────

	public static function on_activation(): void
	{
		set_transient('fep-admin-notice-activation', true, 3);
	}

	// ─── Admin Notices ───────────────────────────────────────────────

	public function notice_missing_elementor(): void
	{
		if (isset($_GET['activate'])) {
			unset($_GET['activate']);
		}

		printf(
			'<div class="notice notice-warning is-dismissible"><p>%s</p></div>',
			sprintf(
				esc_html__('"%1$s" requires "%2$s" to be installed and activated.', 'flexible-editor-panel'),
				'<strong>' . esc_html__('Flexible Editor Panel', 'flexible-editor-panel') . '</strong>',
				'<strong>Elementor</strong>'
			)
		);
	}

	public function notice_minimum_elementor_version(): void
	{
		if (isset($_GET['activate'])) {
			unset($_GET['activate']);
		}

		printf(
			'<div class="notice notice-warning is-dismissible"><p>%s</p></div>',
			sprintf(
				esc_html__('"%1$s" requires "%2$s" version %3$s or greater.', 'flexible-editor-panel'),
				'<strong>' . esc_html__('Flexible Editor Panel', 'flexible-editor-panel') . '</strong>',
				'<strong>Elementor</strong>',
				self::MINIMUM_ELEMENTOR_VERSION
			)
		);
	}

	public function notice_minimum_php_version(): void
	{
		if (isset($_GET['activate'])) {
			unset($_GET['activate']);
		}

		printf(
			'<div class="notice notice-warning is-dismissible"><p>%s</p></div>',
			sprintf(
				esc_html__('"%1$s" requires "%2$s" version %3$s or greater.', 'flexible-editor-panel'),
				'<strong>' . esc_html__('Flexible Editor Panel', 'flexible-editor-panel') . '</strong>',
				'<strong>PHP</strong>',
				self::MINIMUM_PHP_VERSION
			)
		);
	}

	public function notice_activation(): void
	{

		// Activation welcome notice
		if (get_transient('fep-admin-notice-activation')) {
			printf(
				'<div class="notice notice-info is-dismissible"><p>%s</p></div>',
				sprintf(
					esc_html__('Thank you for using %1$s! %2$s', 'flexible-editor-panel'),
					'<strong>' . esc_html__('Flexible Editor Panel', 'flexible-editor-panel') . '</strong>',
					'<a href="' . esc_url(admin_url('admin.php?page=fep-options')) . '">'
						. esc_html__('Visit the settings page to learn how to configure it.', 'flexible-editor-panel')
						. '</a>'
				)
			);
			delete_transient('fep-admin-notice-activation');
		}

		// Migration completed notice
		if (get_transient('fep-admin-notice-migration-done')) {
			printf(
				'<div class="notice notice-success is-dismissible"><p>%s</p></div>',
				esc_html__('FEP settings have been migrated to Elementor User Preferences.', 'flexible-editor-panel')
			);
			delete_transient('fep-admin-notice-migration-done');
		}
	}

	public function admin_init_dismiss_notices(): void
	{
		$nonce = isset($_GET['fep_notice_nonce']) ? sanitize_text_field($_GET['fep_notice_nonce']) : '';

		if (
			wp_verify_nonce($nonce, 'fep_notice_preferences_nonce')
			&& isset($_GET['fep-admin-notice-update-user-preferences-dismissed'])
		) {
			delete_transient('fep-admin-notice-update-user-preferences');
		}
	}

	// ─── Editor Styles ───────────────────────────────────────────────

	public function enqueue_editor_styles(): void
	{
		wp_enqueue_style(
			'fep-editor',
			FEP_URL . 'assets/css/editor.css',
			[],
			FEP_VERSION
		);
	}

	// ─── Preview Styles ──────────────────────────────────────────────

	public function enqueue_preview_styles(): void
	{
		wp_enqueue_style(
			'fep-preview',
			FEP_URL . 'assets/css/preview.css',
			[],
			FEP_VERSION
		);
	}

	// ─── Editor Scripts ──────────────────────────────────────────────

	public function enqueue_editor_scripts(): void
	{

		$rtl      = is_rtl();
		$settings = FEP_Controls::get_settings();

		if (! is_array($settings)) {
			$settings = [];
		}

		// Functions JS (editor v2 only)
		wp_register_script(
			'fep-functions',
			FEP_URL . 'assets/js/functions.js',
			['jquery', 'jquery-ui-draggable', 'jquery-ui-resizable', 'jquery-ui-sortable'],
			FEP_VERSION,
			true
		);

		wp_localize_script('fep-functions', 'FEP', [
			'Permalink' => get_permalink(),
			'PostType'  => get_post_type(get_the_ID()),
			'rtl'       => $rtl,
		]);

		wp_localize_script('fep-functions', 'fepConfig', $settings);
		wp_enqueue_script('fep-functions');

		// Main JS
		wp_register_script(
			'fep-editor',
			FEP_URL . 'assets/js/editor.js',
			['fep-functions'],
			FEP_VERSION,
			true
		);

		wp_localize_script('fep-editor', 'fepConfig', $settings);
		wp_localize_script('fep-editor', 'fep', [
			'exit_tooltip'      => __('Exit', 'flexible-editor-panel'),
			'reset_panel'       => __('Reset Panel', 'flexible-editor-panel'),
			'collapse_vertical' => __('Collapse Vertical', 'flexible-editor-panel'),
			'collapse_categories' => __('Collapse categories', 'flexible-editor-panel'),
		]);

		wp_enqueue_script('fep-editor');
	}
}

// ─── Boot ────────────────────────────────────────────────────────────
Flexible_Editor_Panel::instance();

register_activation_hook(__FILE__, ['Flexible_Editor_Panel', 'on_activation']);
