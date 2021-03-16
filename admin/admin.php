<?php
namespace FEP\Admin\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class FEP_Admin {

    public static $instance;

    /**
    *
    * Run on class construct
    *
    */
    public function __construct() {
        self::$instance = $this;

        add_action( 'init', [ $this, 'admin_init' ] );

    }

    static function get_instance() {
        return self::$instance;
    }


    public function admin_init() {

        // Include all admin files
        $this->admin_includes();

    }

    private function admin_includes() {

        require_once FEP_PATH . 'admin/api.settings.php';
        require_once FEP_PATH . 'admin/settings.php';

        //tabs
        require_once FEP_PATH . 'admin/settings/tabs/informations.php';
		require_once FEP_PATH . 'admin/settings/tabs/how-to-configure.php';
		require_once FEP_PATH . 'admin/settings/tabs/divers.php';
		require_once FEP_PATH . 'admin/settings/tabs/debug.php';

    }

}
new FEP_Admin();
