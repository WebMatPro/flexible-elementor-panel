<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class FEP_Divers_Tab {

    public function __construct() {

        //add_action( 'admin_init', [ $this, 'admin_init' ] );

    }

	//public function admin_init() {

    //}

    public static function section() {

        $section = [];

		$html_fep_divers = '<div class="content-reset">';
			$html_fep_divers .= '<button class="reset-fep-admin">' . __( 'Reset the position/size of Editor Panel Elementor', 'fep' ) . '</button>';
			$html_fep_divers .= '<span class="reset-fep-admin-notice" style="opacity:0">' . __('The position/size of the editor panel Elementor is reset!', 'fep') . '</span>';
		$html_fep_divers .='</div>';

        $section['fep_divers'][] = [

            'name'               => 'fep_reset_panel',
			'label' 			 => __( 'Reset Editor Panel', 'fep' ),
			'class'              => 'fep-divers',
            'desc'               => $html_fep_divers,
            'type'               => 'html',

        ];

        return $section;

    }

}
new FEP_Divers_Tab;
