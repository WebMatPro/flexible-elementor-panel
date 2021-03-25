<?php
namespace FEP\Admin\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class FEP_Admin_Settings {

    private $settings_tabs;

    public function __construct() {

        $this->settings_tabs = new FEP_Settings_API;

        add_action( 'admin_init', [ $this, 'admin_init' ], 10 );
        add_action( 'admin_menu', [ $this, 'admin_menu' ], 20 );

		add_filter( 'plugin_action_links_' . constant('FEP_BASENAME'), [ $this, 'add_action_links'] );

    }

    public function admin_init() {

        //set the settings
        $this->settings_tabs->set_sections( $this->fep_admin_sections() );
        $this->settings_tabs->set_fields( $this->fep_admin_settings() );

        //initialize settings
        $this->settings_tabs->admin_init();

    }

    public function admin_menu() {

        $my_page = add_submenu_page(
            'elementor',
            __( 'Flexible Elementor Panel', 'flexible-elementor-panel' ),
    		__( 'FEP Settings', 'flexible-elementor-panel' ),
            'manage_options',
            'fep-options',
            [ $this, 'plugin_page' ]

        );

		// Load the JS conditionally
		add_action( 'load-' . $my_page, [ $this, 'load_admin_enqueue' ] );

    }

	// Add link to configuration page into plugin
	public static function add_action_links( $links ) {
	    $mylinks = array(
			'settings' => '<a href="' . admin_url( 'admin.php?page=fep-options' ) . '">' . __( 'Settings', 'flexible-elementor-panel' ) . '</a>',
		);
	    return array_merge( $links, $mylinks );
	}

	// This function is only called when our plugin's page loads!
    public function load_admin_enqueue(){

        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_fep_admin' ] );

    }

    private function fep_admin_sections() {

        $sections = [

            [

                'id'     => 'fep_informations',
                'title'  => esc_html__( 'Informations', 'flexible-elementor-panel' ),
				'submit' => false,

            ],
			[

				'id'     => 'fep_how_to_configure',
				'title'  => esc_html__( 'How to configure', 'flexible-elementor-panel' ),
				'submit' => false,

			],
			[

				'id'     => 'fep_divers',
				'title'  => esc_html__( 'Divers', 'flexible-elementor-panel' ),
				'submit' => true,

			],
			[

				'id'     => 'fep_debug',
				'title'  => esc_html__( 'Debug', 'flexible-elementor-panel' ),
				'submit' => false,

			],
        ];

        return array_merge( $sections );

    }



    private function fep_admin_settings() {

		$settings1 = Tabs\FEP_Informations_Tab::section();
		$settings2 = Tabs\FEP_HowToConfigure_Tab::section();
		$settings3 = Tabs\FEP_Divers_Tab::section();
		$settings4 = Tabs\FEP_Debug_Tab::section();

        return array_merge( $settings1, $settings2, $settings3, $settings4 );

    }





    public function plugin_page() {

		$html_fep_title = '<div class="title">';
			$html_fep_title .= '<h1>' . __('Flexible Elementor Panel','flexible-elementor-panel') . '</h1>';
			$html_fep_title .= '<h3>' . __('Makes the Elementor editor panel flexible, draggable, resizable, folding and more opportunities.','flexible-elementor-panel') . '</h3>';
		$html_fep_title .='</div>';

        echo '<div class="wrap" id="fep-admin">';
	        echo $html_fep_title;
	        $this->save_message();
	        $this->settings_tabs->show_navigation();
	        $this->settings_tabs->show_forms();
	        //$this->footer_info();
        echo '</div>';

    }

    public function save_message() {

        if( isset($_GET['settings-updated']) ) { ?>

            <div class="updated notice is-dismissible">

                <p><strong><?php esc_html_e('Your settings have been saved.', 'flexible-elementor-panel') ?></strong></p>

            </div>

            <?php

        }

    }


    public function footer_info() {

        ?>

        <div class="fep-options-footer-info">

			<p><?php //_e('footer text', 'flexible-elementor-panel'); ?></p>

        </div>

        <?php

    }


	/**
	* Register and enqueue a custom stylesheet in the WordPress admin.
	*/
	public function enqueue_fep_admin() {

		// style
		wp_enqueue_style( 'flexible-elementor-panel-admin', FEP_URL . '/admin/assets/css/flexible-elementor-panel-admin.css', array(), FEP_VERSION, 'all' );

		// scripts
		wp_enqueue_script( 'fep-functions-admin', FEP_URL . '/admin/assets/js/fep-functions-admin.js', false, FEP_VERSION, true );
		wp_localize_script('fep-functions-admin', 'ajax_var', array(
			'url' => admin_url('admin-ajax.php'),
			'nonce' => wp_create_nonce('fep-nonce-admin'),
			)
		);

		wp_enqueue_script( 'flexible-elementor-panel-admin', FEP_URL . '/admin/assets/js/flexible-elementor-panel-admin.js', false, FEP_VERSION, true );
		wp_localize_script('flexible-elementor-panel-admin', 'text_var', array(
			'confirm' => __('Do you confirm that action?', 'flexible-elementor-panel')
			)
		);

	}

}
new FEP_Admin_Settings();
