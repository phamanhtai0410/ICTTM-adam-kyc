<?php

require_once plugin_dir_path(__FILE__) . 'class-adamkyc-constants.php';

if (!class_exists('AdamkycOrchestration')) {
  class AdamkycOrchestration {
    public static string $adamkyc_db_version = '1.6';

    public static function activate (): void {
      $constants = new AdamkycConstants();

      AdamkycOrchestration::install1_0($constants);
      AdamkycOrchestration::install1_1($constants);
      AdamkycOrchestration::install1_2($constants);
      AdamkycOrchestration::install1_3($constants);
      AdamkycOrchestration::install1_4($constants);
      AdamkycOrchestration::install1_5($constants);
      AdamkycOrchestration::install1_6($constants);

      add_option('adamkyc_db_version', AdamkycOrchestration::$adamkyc_db_version);
    }

    public static function deactivate (): void {
      global $wpdb;
      $constants = new AdamkycConstants();

      $wpdb->query("DROP TABLE IF EXISTS {$constants->table_bookmarks}");
      $wpdb->query("DROP TABLE IF EXISTS {$constants->table_bulk_upload}");
      $wpdb->query("DROP TABLE IF EXISTS {$constants->table_entities}");
      $wpdb->query("DROP TABLE IF EXISTS {$constants->table_history}");
      $wpdb->query("DROP TABLE IF EXISTS {$constants->table_report_changelog}");
      $wpdb->query("DROP TABLE IF EXISTS {$constants->table_report_notes}");
      $wpdb->query("DROP TABLE IF EXISTS {$constants->table_reports}");
      $wpdb->query("DROP TABLE IF EXISTS {$constants->table_uploads}");
      $wpdb->query("DROP TABLE IF EXISTS {$constants->table_views}");

      delete_option('adamkyc_db_version');
    }

    public static function install1_0 (AdamkycConstants $constants): void {
      require_once ABSPATH . 'wp-admin/includes/upgrade.php';

      $sql = "CREATE TABLE IF NOT EXISTS {$constants->table_bookmarks} (
  user_id bigint(20) unsigned NOT NULL,
  entity_id varchar(255) NOT NULL,
  created_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  UNIQUE KEY {$constants->table_bookmarks}_ukey (user_id, entity_id)
) {$constants->charset_collate};";

      dbDelta($sql);
    }

    public static function install1_1 (AdamkycConstants $constants): void {
      require_once ABSPATH . 'wp-admin/includes/upgrade.php';

      $sql = "CREATE TABLE IF NOT EXISTS {$constants->table_history} (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  user_id bigint(20) unsigned NOT NULL,
  search varchar(255) NOT NULL,
  type varchar(255) NOT NULL,
  count mediumint(9) NOT NULL,
  created_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) {$constants->charset_collate};";

      dbDelta($sql);

      $sql = "CREATE TABLE IF NOT EXISTS {$constants->table_views} (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  user_id bigint(20) unsigned NOT NULL,
  entity_id varchar(255) NOT NULL,
  created_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) {$constants->charset_collate};";

      dbDelta($sql);
    }

    public static function install1_2 (AdamkycConstants $constants): void {
      require_once ABSPATH . 'wp-admin/includes/upgrade.php';

      $sql = "CREATE TABLE IF NOT EXISTS {$constants->table_bulk_upload} (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  user_id bigint(20) unsigned NOT NULL,
  entity_id varchar(255),
  search varchar(255) NOT NULL,
  type varchar(255) NOT NULL,
  created_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) {$constants->charset_collate};";

      dbDelta($sql);
    }

    public static function install1_3 (AdamkycConstants $constants): void {
      require_once ABSPATH . 'wp-admin/includes/upgrade.php';

      $sql = "CREATE TABLE IF NOT EXISTS {$constants->table_reports} (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  user_id bigint(20) unsigned NOT NULL,
  entity_id varchar(255),
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  phone varchar(255) NOT NULL,
  entity_name varchar(255) NOT NULL,
  register_url varchar(255) NOT NULL,
  details text NOT NULL,
  relationship varchar(255) NOT NULL,
  created_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) {$constants->charset_collate};";

      dbDelta($sql);
    }

    public static function install1_4 (AdamkycConstants $constants): void {
      global $wpdb;

      $wpdb->query("ALTER TABLE {$constants->table_reports} ADD deleted_at timestamp NULL DEFAULT NULL");
      $wpdb->query("ALTER TABLE {$constants->table_reports} ADD status enum('APPROVED', 'DENIED', 'REVIEWING') NULL DEFAULT NULL");
    }

    public static function install1_5 (AdamkycConstants $constants): void {
      require_once ABSPATH . 'wp-admin/includes/upgrade.php';
      global $wpdb;

      $wpdb->query("ALTER TABLE {$constants->table_history} ADD deleted_at timestamp NULL DEFAULT NULL");
      $wpdb->query("ALTER TABLE {$constants->table_views} ADD deleted_at timestamp NULL DEFAULT NULL");
      $wpdb->query("ALTER TABLE {$constants->table_reports} ADD entity_type varchar(255) NOT NULL DEFAULT ''");
      $wpdb->query("ALTER TABLE {$constants->table_reports} MODIFY entity_type varchar(255) NOT NULL");
      $wpdb->query("ALTER TABLE {$constants->table_reports} DROP COLUMN register_url");

      $sql = "CREATE TABLE IF NOT EXISTS {$constants->table_report_notes} (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  user_id bigint(20) unsigned NOT NULL,
  report_id bigint(20) unsigned NOT NULL,
  subject varchar(255) NOT NULL,
  note text NOT NULL,
  created_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) {$constants->charset_collate};";

      dbDelta($sql);

      $sql = "CREATE TABLE IF NOT EXISTS {$constants->table_report_changelog} (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  user_id bigint(20) unsigned NOT NULL,
  report_id bigint(20) unsigned NOT NULL,
  message varchar(255) NOT NULL,
  created_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) {$constants->charset_collate};";

      dbDelta($sql);
    }

    public static function install1_6 (AdamkycConstants $constants): void {
      require_once ABSPATH . 'wp-admin/includes/upgrade.php';

      $sql = "CREATE TABLE IF NOT EXISTS {$constants->table_uploads} (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  user_id bigint(20) unsigned NOT NULL,
  type varchar(255) NOT NULL,
  status enum('FAILURE', 'SUCCESS') NOT NULL,
  created_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) {$constants->charset_collate};";

      dbDelta($sql);

      $sql = "CREATE TABLE IF NOT EXISTS {$constants->table_entities} (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  user_id bigint(20) unsigned NOT NULL,
  upload_id bigint(20) unsigned NULL,
  state enum('DRAFT', 'PRIVATE', 'PUBLIC') NOT NULL,
  status enum('VERIFIED', 'INCORRECT', 'UNVERIFIED') NULL,
  data JSON NOT NULL,
  created_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  deleted_at timestamp NULL DEFAULT NULL,
  PRIMARY KEY (id)
) {$constants->charset_collate};";

      dbDelta($sql);
    }

    public static function update (): void {
      $current_version = get_option('adamkyc_db_version', '1.0');

      if ($current_version === AdamkycOrchestration::$adamkyc_db_version) {
        return;
      }

      $constants = new AdamkycConstants();

      if (version_compare($current_version, '1.0', 'eq')) {
        AdamkycOrchestration::install1_1($constants);
        update_option('adamkyc_db_version', '1.1');
      }

      if (version_compare($current_version, '1.1', 'eq')) {
        AdamkycOrchestration::install1_2($constants);
        update_option('adamkyc_db_version', '1.2');
      }

      if (version_compare($current_version, '1.2', 'eq')) {
        AdamkycOrchestration::install1_3($constants);
        update_option('adamkyc_db_version', '1.3');
      }

      if (version_compare($current_version, '1.3', 'eq')) {
        AdamkycOrchestration::install1_4($constants);
        update_option('adamkyc_db_version', '1.4');
      }

      if (version_compare($current_version, '1.4', 'eq')) {
        AdamkycOrchestration::install1_5($constants);
        update_option('adamkyc_db_version', '1.5');
      }

      if (version_compare($current_version, '1.5', 'eq')) {
        AdamkycOrchestration::install1_6($constants);
        update_option('adamkyc_db_version', '1.6');
      }

      update_option('adamkyc_db_version', AdamkycOrchestration::$adamkyc_db_version);
    }

    public static function random_ver (): string {
      return random_int(0, 100) . '.' . random_int(0, 100) . '.' . random_int(0, 100);
    }
  }
}
