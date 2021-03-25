<?php
namespace FEP\Admin\Settings\Tabs;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class FEP_HowToConfigure_Tab {

    public function __construct() {

        //add_action( 'admin_init', [ $this, 'admin_init' ] );

    }

	//public function admin_init() {

    //}

    public static function section() {

        $section = [];

		$html_fep_how_to_configure = '<div class="content-howtodo">';
			$html_fep_how_to_configure .= '<p>' . __('The FEP settings can be found in Elementor. Open Elementor and you will find the FEP settings in the User Preferences.','flexible-elementor-panel') . '</p>';
			$html_fep_how_to_configure .= '<p>' . __('All options are enabled by default. Take a look!','flexible-elementor-panel') . '</p>';

			//if Elementor is version 3.0.0 or more
			if ( version_compare( ELEMENTOR_VERSION, '3.0.0', '>=' ) ) {
				$html_fep_how_to_configure .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-go-to-settings-2.2.gif" style="max-height: 500px;">';
			} else {
				$html_fep_how_to_configure .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-go-to-settings.gif" style="max-height: 500px;">';
			}


		$html_fep_how_to_configure .='</div>';

        $section['fep_how_to_configure'][] = [

            'name'               => 'fep_how_to_configure',
			'class'              => 'fep-how-to-configure',
            'desc'               => $html_fep_how_to_configure,
            'type'               => 'html',

        ];

        return $section;

    }

}
new FEP_HowToConfigure_Tab;
