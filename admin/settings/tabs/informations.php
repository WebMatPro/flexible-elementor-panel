<?php
namespace FEP\Admin\Settings\Tabs;

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
				$html_fep_informations .= '<h4>' . __('Thanks for using our plugin. It\'s free for all Wordpress and Elementor users.','flexible-elementor-panel') . '</h4>';
				$html_fep_informations .= '<p>' . __('Please give us 5 minutes of your time to support us.','flexible-elementor-panel') . '</p>';
				$html_fep_informations .= '<p><a href="' . __('https://wordpress.org/support/plugin/flexible-elementor-panel/reviews/?filter=5/#new-post','flexible-elementor-panel') . '" target="_blank">' . __('Give us a positive rating directly in the Wordpress plugin repository. Thanks!','flexible-elementor-panel') . '</a></p>';
				$html_fep_informations .= '<p>' . __('Don\'t forget, we are open to all helpful suggestions on our <a href="https://wordpress.org/support/plugin/flexible-elementor-panel/" target="_blank">support forum.</a>','flexible-elementor-panel') . '</p>';
			$html_fep_informations .= '</div>';
		$html_fep_informations .='</div>';

		/*$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-draggable.gif">';
		$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-editor-skin.gif">';
		$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-exit-button.gif">';
		$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-vertical-toggle.gif">';
		$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-flex-categories.gif">';
		$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-responsive-mode.gif">';
		$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-first-tab-close--accordion.gif">';
		$html_fep_informations .= '<img class="fep-gif" src="'. FEP_URL .'admin/assets/images/fep-go-to-settings.gif">';*/

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
