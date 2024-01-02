<?php

/**
 * Plugin Name: Adamkyc
 * Description: WordPress Plugin
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 8.0
 * Author: DeltaPlata
 * Author URI: https://deltaplata.com
 * License: GPLv2 or later
 */

if (!defined('ABSPATH')) {
  exit;
}

require_once plugin_dir_path(__FILE__) . 'vendor/autoload.php';

define('ADAMKYC_VERSION', '1.0.0');

function activate_adamkyc () {
  require_once plugin_dir_path(__FILE__) . 'includes/class-adamkyc-orchestration.php';
  AdamkycOrchestration::activate();
}

function deactivate_adamkyc () {
  require_once plugin_dir_path(__FILE__) . 'includes/class-adamkyc-orchestration.php';
  AdamkycOrchestration::deactivate();
}

function update_adamkyc () {
  require_once plugin_dir_path(__FILE__) . 'includes/class-adamkyc-orchestration.php';
  AdamkycOrchestration::update();
}

register_activation_hook(__FILE__, 'activate_adamkyc');
register_deactivation_hook(__FILE__, 'deactivate_adamkyc');
add_action('plugins_loaded', 'update_adamkyc');

require_once plugin_dir_path(__FILE__) . 'includes/class-adamkyc.php';

$plugin = new Adamkyc();
$plugin->run();
