<?php

require_once plugin_dir_path(__FILE__) . 'class-adamkyc-constants.php';
require_once plugin_dir_path(__FILE__) . 'class-adamkyc-routes.php';

if (!class_exists('Adamkyc')) {
  class Adamkyc {
    public string $routeNamespace = 'adamkyc/v1';
    public AdamkycRoutes $routes;

    public function __construct () {
      $this->routes = new AdamkycRoutes();
    }

    public function load_menus (): void {
      add_menu_page('ADAMKYC', 'ADAMKYC', 'read', 'adamkyc', [$this, 'page']);
      add_submenu_page("adamkyc", "Bookmarks", "Bookmarks", 'read', "adamkyc#/bookmarks", [$this, 'page']);
      add_submenu_page("adamkyc", "Bulk Upload", "Bulk Upload", 'read', "adamkyc#/bulk-upload", [$this, 'page']);
      add_submenu_page("adamkyc", "History", "History", 'read', "adamkyc#/history", [$this, 'page']);
      add_submenu_page("adamkyc", "Search", "Search", 'read', "adamkyc#/search", [$this, 'page']);
      add_submenu_page("adamkyc", "Database", "Database", 'delete_users', "adamkyc#/admin/database", [$this, 'page']);
      add_submenu_page("adamkyc", "All Entities", "All Entities", 'delete_users', "adamkyc#/admin/entities", [$this, 'page']);
      add_submenu_page("adamkyc", "Entities Upload", "Entities Upload", 'delete_users', "adamkyc#/admin/bulk-upload", [$this, 'page']);
      add_submenu_page("adamkyc", "Reports", "Reports", 'delete_users', "adamkyc#/admin/reports", [$this, 'page']);
      add_submenu_page("adamkyc", "Dashboard", "Dashboard", 'delete_users', "adamkyc#/admin/dashboard", [$this, 'page']);
    }

    public function load_routes (): void {
      header("Access-Control-Allow-Origin: *");
      header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, HEAD");

      register_rest_route($this->routeNamespace, '/admin-bulk-upload', [
        'methods' => 'POST',
        'callback' => [$this->routes, 'admin_bulk_upload'],
        'args' => [
          'type' => [
            'type' => 'string',
            'enum' => ['address', 'bank-account', 'crypto-wallet', 'legal-entity', 'person', 'security', 'vessel'],
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-bulk-upload/history', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'admin_bulk_upload_history'],
        'args' => [
          'status' => [
            'type' => 'string',
            'enum' => ['', 'FAILURE', 'SUCCESS'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'type' => [
            'type' => 'string',
            'enum' => ['', 'address', 'bank-account', 'crypto-wallet', 'legal-entity', 'person', 'security', 'vessel'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
          ...$this->params_pagination()
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-bulk-upload/(?P<id>\d{1,20})', [
        'methods' => 'DELETE',
        'callback' => [$this->routes, 'admin_bulk_upload_delete'],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-dataset', [
        'methods' => 'POST',
        'callback' => [$this->routes, 'admin_dataset_create'],
        'args' => [
          'country' => [
            'type' => 'string',
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'description' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'publisher_name' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'publisher_url' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'source_url' => [
            'type' => 'string',
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'tags' => [
            'type' => 'string',
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'title' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-entities', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'admin_entities'],
        'args' => [
          'q' => [
            'type' => 'string',
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'state' => [
            'type' => 'string',
            'enum' => ['', 'DELETED', 'DRAFT', 'PRIVATE', 'PUBLIC'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'status' => [
            'type' => 'string',
            'enum' => ['', 'VERIFIED', 'INCORRECT', 'UNVERIFIED'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'type' => [
            'type' => 'string',
            'enum' => ['', 'address', 'bank-account', 'crypto-wallet', 'legal-entity', 'person', 'security', 'vessel'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
          ...$this->params_pagination()
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-entities/delete', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'admin_entities_delete'],
        'args' => [
          'identifiers' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-entities/update', [
        'methods' => 'POST',
        'callback' => [$this->routes, 'admin_entities_patch'],
        'args' => [
          'data' => [
            'type' => 'array',
            'required' => true,
            'items' => [
              'type' => 'object',
              'required' => true,
              'properties' => [
                'id'  => [
                  'type' => 'integer',
                  'required' => true,
                ],
                'status' => [
                  'type' => 'string',
                  'enum' => ['', 'VERIFIED', 'INCORRECT', 'UNVERIFIED'],
                  'validate_callback' => 'rest_validate_request_arg',
                ],
              ],
              'validate_callback' => 'rest_validate_request_arg',
            ],
            'validate_callback' => 'rest_validate_request_arg',
          ]
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-entity/create', [
        'methods' => 'POST',
        'callback' => [$this->routes, 'admin_entity_create'],
        'args' => [
          'state' => [
            'type' => 'string',
            'enum' => ['', 'DRAFT', 'PRIVATE', 'PUBLIC'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'status' => [
            'type' => 'string',
            'enum' => ['', 'VERIFIED', 'INCORRECT', 'UNVERIFIED'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'data' => [
            'type' => 'object',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ]
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-entity/(?P<id>\d{1,20})', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'admin_entity_view'],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-entity/(?P<id>\d{1,20})', [
        'methods' => 'DELETE',
        'callback' => [$this->routes, 'admin_entity_delete'],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-entity/(?P<id>\d{1,20})', [
        'methods' => 'PATCH',
        'callback' => [$this->routes, 'admin_entity_patch'],
        'args' => [
          'status' => [
            'type' => 'string',
            'enum' => ['', 'VERIFIED', 'INCORRECT', 'UNVERIFIED'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-entity/(?P<id>\d{1,20})', [
        'methods' => 'PUT',
        'callback' => [$this->routes, 'admin_entity_update'],
        'args' => [
          'state' => [
            'type' => 'string',
            'enum' => ['', 'DRAFT', 'PRIVATE', 'PUBLIC'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'status' => [
            'type' => 'string',
            'enum' => ['', 'VERIFIED', 'INCORRECT', 'UNVERIFIED'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'data' => [
            'type' => 'object',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ]
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-reports', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'admin_reports'],
        'args' => [
          'q' => [
            'type' => 'string',
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'state' => [
            'type' => 'string',
            'enum' => ['', 'DELETED'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'status' => [
            'type' => 'string',
            'enum' => ['', 'APPROVED', 'DENIED', 'REVIEWING'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'type' => [
            'type' => 'string',
            'enum' => ['', 'address', 'bank-account', 'crypto-wallet', 'legal-entity', 'person', 'security', 'vessel'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
          ...$this->params_pagination()
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-reports/delete', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'admin_reports_delete'],
        'args' => [
          'identifiers' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-reports/update', [
        'methods' => 'POST',
        'callback' => [$this->routes, 'admin_reports_update'],
        'args' => [
          'data' => [
            'type' => 'array',
            'required' => true,
            'items' => [
              'type' => 'object',
              'required' => true,
              'properties' => [
                'id'  => [
                  'type' => 'integer',
                  'required' => true,
                ],
                'status' => [
                  'type' => 'string',
                  'enum' => ['', 'APPROVED', 'DENIED', 'REVIEWING'],
                  'validate_callback' => 'rest_validate_request_arg',
                ],
              ],
              'validate_callback' => 'rest_validate_request_arg',
            ],
            'validate_callback' => 'rest_validate_request_arg',
          ]
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-report/(?P<id>\d{1,20})', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'admin_report_view'],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-report/(?P<id>\d{1,20})', [
        'methods' => 'POST',
        'callback' => [$this->routes, 'admin_report_update'],
        'args' => [
          'status' => [
            'type' => 'string',
            'enum' => ['', 'APPROVED', 'DENIED', 'REVIEWING'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-report/(?P<id>\d{1,20})', [
        'methods' => 'DELETE',
        'callback' => [$this->routes, 'admin_report_delete'],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-report/(?P<id>\d{1,20})/changelog', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'admin_report_changelog'],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-report/(?P<id>\d{1,20})/notes', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'admin_report_notes'],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-report/(?P<id>\d{1,20})/note', [
        'methods' => 'POST',
        'callback' => [$this->routes, 'admin_report_note_create'],
        'args' => [
          'subject' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'note' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-report/(?P<id>\d{1,20})/note/(?P<note_id>\d{1,20})', [
        'methods' => 'PUT',
        'callback' => [$this->routes, 'admin_report_note_update'],
        'args' => [
          'subject' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'note' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/admin-report/(?P<id>\d{1,20})/note/(?P<note_id>\d{1,20})', [
        'methods' => 'DELETE',
        'callback' => [$this->routes, 'admin_report_note_delete'],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/bookmark/(?P<id>[\w-]{1,255})', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'bookmark'],
        'args' => [
          'id' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => [$this, 'check_permission_user'],
      ]);

      register_rest_route($this->routeNamespace, '/bookmarks', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'bookmarks'],
        'args' => $this->params_pagination(),
        'permission_callback' => [$this, 'check_permission_user'],
      ]);

      register_rest_route($this->routeNamespace, '/bookmarks/clear', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'bookmarks_clear'],
        'permission_callback' => [$this, 'check_permission_user'],
      ]);

      register_rest_route($this->routeNamespace, '/bulk-upload', [
        'methods' => 'POST',
        'callback' => [$this->routes, 'bulk_upload'],
        'args' => [
          'type' => [
            'type' => 'string',
            'enum' => ['address', 'bank-account', 'crypto-wallet', 'legal-entity', 'person', 'security', 'vessel'],
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => [$this, 'check_permission_user'],
      ]);

      register_rest_route($this->routeNamespace, '/bulk-upload/delete', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'bulk_upload_delete'],
        'args' => [
          'identifiers' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => [$this, 'check_permission_user'],
      ]);

      register_rest_route($this->routeNamespace, '/bulk-upload/download', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'bulk_upload_download'],
        'args' => [
          'identifiers' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => '__return_true',
      ]);

      register_rest_route($this->routeNamespace, '/bulk-upload/history', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'bulk_upload_history'],
        'args' => $this->params_pagination(),
        'permission_callback' => [$this, 'check_permission_user'],
      ]);

      register_rest_route($this->routeNamespace, '/connect', [
        'methods' => 'POST',
        'callback' => [$this->routes, 'connect'],
        'args' => [
          'database' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'hostname' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'password' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'username' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/connection', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'connection'],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/datasets', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'datasets'],
        'permission_callback' => [$this, 'check_permission_user'],
      ]);

      register_rest_route($this->routeNamespace, '/disconnect', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'disconnect'],
        'permission_callback' => [$this, 'check_permission_admin'],
      ]);

      register_rest_route($this->routeNamespace, '/download/(?P<id>[\w-]{1,255})', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'download'],
        'args' => [
          'id' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => '__return_true',
      ]);

      register_rest_route($this->routeNamespace, '/entity/(?P<id>[\w-]{1,255})', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'entity'],
        'args' => [
          'id' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => [$this, 'check_permission_user'],
      ]);

      register_rest_route($this->routeNamespace, '/history', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'history'],
        'args' => $this->params_pagination(),
        'permission_callback' => [$this, 'check_permission_user'],
      ]);

      register_rest_route($this->routeNamespace, '/history/clear', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'history_clear'],
        'permission_callback' => [$this, 'check_permission_user'],
      ]);

      register_rest_route($this->routeNamespace, '/last-viewed', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'last_viewed'],
        'permission_callback' => [$this, 'check_permission_user'],
      ]);

      register_rest_route($this->routeNamespace, '/me', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'me'],
        'permission_callback' => [$this, 'check_permission_user'],
      ]);

      register_rest_route($this->routeNamespace, '/recent-search', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'recent_search'],
        'permission_callback' => [$this, 'check_permission_user'],
      ]);

      register_rest_route($this->routeNamespace, '/report/(?P<id>[\w-]{1,255})', [
        'methods' => 'POST',
        'callback' => [$this->routes, 'report'],
        'args' => [
          'firstName' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'lastName' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'email' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'phone' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'details' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'relationship' => [
            'type' => 'string',
            'required' => true,
            'validate_callback' => 'rest_validate_request_arg',
          ],
        ],
        'permission_callback' => [$this, 'check_permission_user'],
      ]);

      register_rest_route($this->routeNamespace, '/search', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'search'],
        'args' => [
          'country' => [
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'validate_callback' => [$this, 'validate_country'],
          ],
          'page' => [
            'type' => 'integer',
            'default' => 1,
            'sanitize_callback' => 'absint',
            'validate_callback' => 'rest_validate_request_arg',
            'minimum' => 1,
          ],
          'q' => [
            'type' => 'string',
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'sort' => [
            'type' => 'string',
            'enum' => ['', 'asc', 'desc'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'topics' => [
            'type' => 'string',
            'validate_callback' => 'rest_validate_request_arg',
          ],
          'type' => [
            'type' => 'string',
            'enum' => ['', 'address', 'bank-account', 'crypto-wallet', 'legal-entity', 'person', 'position', 'security', 'vessel'],
            'validate_callback' => 'rest_validate_request_arg',
          ],
          ...AdamkycConstants::search_properties(),
        ],
        'permission_callback' => [$this, 'check_permission_user'],
      ]);

      register_rest_route($this->routeNamespace, '/topics', [
        'methods' => 'GET',
        'callback' => [$this->routes, 'topics'],
        'permission_callback' => [$this, 'check_permission_user'],
      ]);
    }

    public function check_permission_admin (): bool {
      return is_super_admin();
    }

    public function check_permission_user (): bool {
      return is_user_logged_in();
    }

    public function params_pagination (): array {
      return [
        'after' => [
          'type' => 'string',
          'sanitize_callback' => 'sanitize_text_field',
          'validate_callback' => [$this, 'validate_date'],
        ],
        'before' => [
          'type' => 'string',
          'sanitize_callback' => 'sanitize_text_field',
          'validate_callback' => [$this, 'validate_date'],
        ],
        'page' => [
          'type' => 'integer',
          'default' => 1,
          'sanitize_callback' => 'absint',
          'validate_callback' => 'rest_validate_request_arg',
          'minimum' => 1,
        ],
      ];
    }

    public function validate_date (mixed $value): bool {
      return is_string($value) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $value);
    }

    public function validate_country (mixed $value): bool {
      return $value == '' || (is_string($value) && preg_match('/^[a-z\-]{2,7}$/', $value));
    }

    public function run (): void {
      add_action('admin_menu', [$this, 'load_menus']);
      add_action('rest_api_init', [$this, 'load_routes']);
    }

    public function page (): void {
      $pluginDir = plugin_dir_url(__DIR__);

      $scriptVer = strval(filemtime(plugin_dir_path(__FILE__) . '../static/js/main.js'));
      $stylesVer = strval(filemtime(plugin_dir_path(__FILE__) . '../static/css/main.css'));

      wp_enqueue_script('adamkyc-script', $pluginDir . 'static/js/main.js', '', $scriptVer, true);
      wp_enqueue_style('adamkyc-style', $pluginDir . 'static/css/main.css', '', $stylesVer);
      wp_enqueue_style('adamkyc-admin-style', $pluginDir . 'static/admin-css/main.css');

      wp_localize_script('adamkyc-script', 'adamkyc_frontend_nonce', [
        'nonce' => wp_create_nonce('wp_rest'),
      ]);

      echo '<script>var adamkyc_plugin_prefix = "' . $pluginDir . '";</script>';
      echo '<div id="root"></div>';
    }
  }
}
