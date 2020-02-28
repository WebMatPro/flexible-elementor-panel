<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class FEP_Informations_Tab {

    public function __construct() {

        //add_action( 'admin_init', [ $this, 'admin_init' ] );

    }

    //public function admin_init() {

    //}

    public static function section() {

        $section = [];

		$html_fep_informations = '<div class="content-helpus">';
			$html_fep_informations .= '<div class="col1">';
				$html_fep_informations .= '<img src="'. FEP_URL .'admin/assets/images/review-fep-thanks.png">';
			$html_fep_informations .= '</div>';
			$html_fep_informations .= '<div class="col2">';
				$html_fep_informations .= '<h4>' . __('Thanks to use our plugin, we make it free for the users of Wordpress and Elementor.','fep') . '</h4>';
				$html_fep_informations .= '<p>' . __('After used it, do you will can take 5 minutes of your time for help us?','fep') . '</p>';
				$html_fep_informations .= '<p><a href="' . __('https://wordpress.org/support/plugin/flexible-elementor-panel/reviews/?filter=5/#new-post','fep') . '" target="_blank">' . __('Write your rating directly in plugin repository Wordpress','fep') . '</a></p>';
				$html_fep_informations .= '<p>' . __('Don\'t forget, we are open to any subjection on our <a href="https://wordpress.org/support/plugin/flexible-elementor-panel/" target="_blank">support forum.</a>','fep') . '</p>';
			$html_fep_informations .= '</div>';
		$html_fep_informations .='</div>';

		$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-draggable.gif">';
		$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-editor-skin.gif">';
		$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-exit-button.gif">';
		$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-vertical-toggle.gif">';
		$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-flex-categories.gif">';
		$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-responsive-mode.gif">';
		$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-first-tab-close--accordion.gif">';
		$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-go-to-settings.gif">';

        $section['fep_informations'][] = [

            'name'               => 'fep_informations',
			'class'              => 'fep-informations',
            'desc'               => $html_fep_informations,
            'type'               => 'html',

        ];

        return $section;

    }

}
new FEP_Informations_Tab;
