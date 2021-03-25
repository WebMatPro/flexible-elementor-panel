<?php
namespace FEP\Admin\Settings\Tabs;

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

		$section = [
            'fep_divers' => [
				[
					'name'               => 'fep_frontend_accordion_close',
					'label' 			 => __( 'Check to close the first tab on all Elementor accordions', 'flexible-elementor-panel' ),
					'class'              => 'fep_frontend_accordion_close',
					'type'               => 'checkbox',
				],
        	]
        ];

        return $section;

    }


}
new FEP_Divers_Tab;
