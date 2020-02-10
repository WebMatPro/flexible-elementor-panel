<?php

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
			$html_fep_how_to_configure .= '<p>' . __('We have placed the options for FEP directly in the Elementor editor for greater ease of use.','fep') . '</p>';
			$html_fep_how_to_configure .= '<p>' . __('All options is disabled by default, are you ready to enable them?','fep') . '</p>';
			$html_fep_how_to_configure .= '<img src="'. FEP_URL .'admin/assets/images/fep-howtosetting.gif">';
		$html_fep_how_to_configure .='</div>';

        $section['fep_how_to_configure'][] = [

            'name'               => 'fep_how_to_configure',
			'class'              => 'fep_how_to_configure',
            'desc'               => $html_fep_how_to_configure,
            'type'               => 'html',

        ];

        return $section;

    }

}
new FEP_HowToConfigure_Tab;
