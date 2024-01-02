<?php

require_once plugin_dir_path(__FILE__) . 'class-adamkyc-constants.php';
require_once plugin_dir_path(__FILE__) . 'class-adamkyc-db.php';
require_once plugin_dir_path(__FILE__) . 'class-adamkyc-spreadsheet.php';
require_once plugin_dir_path(__FILE__) . 'class-adamkyc-transformers.php';
require_once plugin_dir_path(__FILE__) . 'class-adamkyc-zip.php';

if (!class_exists('AdamkycRoutes')) {
  class AdamkycRoutes {
    public static array $bulk_upload_mime_types = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];

    public static array $search_collections = [
      'person',
      'legal-entity',
      'company',
      'organization',
      'vessel',
      'address',
      'bank-account',
      'crypto-wallet',
      'security',
      'airplane',
      'position',
    ];

    public static array $search_collections_map = [
      'airplane' => 'Airplane',
      'address' => 'Address',
      'bank-account' => 'BankAccount',
      'company' => 'Company',
      'crypto-wallet' => 'CryptoWallet',
      'legal-entity' => 'LegalEntity',
      'organization' => 'Organization',
      'person' => 'Person',
      'position' => 'Position',
      'security' => 'Security',
      'vessel' => 'Vessel',
    ];

    public static function search_metadata (string $type, string $keywords): array {
      if (empty($keywords)) {
        return [];
      }

      $query = new MongoDB\BSON\Regex($keywords, 'i');

      switch ($type) {
        case 'address': {
          return [
            '$and' => [
              [
                '$text' => [
                  '$search' => $keywords
                ]
              ],
              ['properties.full' => $query],
            ],
          ];
        }
        case 'airplane':
        case 'position': {
          return [
            '$and' => [
              [
                '$text' => [
                  '$search' => $keywords
                ]
              ],
              ['properties.name' => $query],
            ],
          ];
        }
        case 'bank-account': {
          return [
            '$and' => [
              [
                '$text' => [
                  '$search' => $keywords
                ]
              ],
              ['properties.iban' => $query],
            ],
          ];
        }
        case 'company':
        case 'organization':
        case 'person': {
          return [
            '$and' => [
              [
                '$text' => [
                  '$search' => $keywords
                ]
              ],
              [
                '$or' => [
                  ['properties.alias' => $query],
                  ['properties.description' => $query],
                  ['properties.email' => $query],
                  ['properties.keywords' => $query],
                  ['properties.name' => $query],
                  ['properties.notes' => $query],
                  ['properties.previousName' => $query],
                  ['properties.summary' => $query],
                ]
              ],
            ],
          ];
        }
        case 'crypto-wallet': {
          return [
            '$and' => [
              [
                '$text' => [
                  '$search' => $keywords
                ]
              ],
              [
                '$or' => [
                  ['properties.alias' => $query],
                  ['properties.publicKey' => $query],
                ]
              ],
            ],
          ];
        }
        case 'legal-entity': {
          return [
            '$and' => [
              [
                '$text' => [
                  '$search' => $keywords
                ]
              ],
              [
                '$or' => [
                  ['properties.alias' => $query],
                  ['properties.email' => $query],
                  ['properties.name' => $query],
                  ['properties.notes' => $query],
                  ['properties.previousName' => $query],
                ]
              ],
            ],
          ];
        }
        case 'security': {
          return [
            '$and' => [
              [
                '$text' => [
                  '$search' => $keywords
                ]
              ],
              [
                '$or' => [
                  ['properties.isin' => $query],
                  ['properties.name' => $query],
                ]
              ],
            ],
          ];
        }
        case 'vessel': {
          return [
            '$and' => [
              [
                '$text' => [
                  '$search' => $keywords
                ]
              ],
              [
                '$or' => [
                  ['properties.alias' => $query],
                  ['properties.description' => $query],
                  ['properties.name' => $query],
                  ['properties.notes' => $query],
                ]
              ],
            ],
          ];
        }
        default: {
          return [];
        }
      }
    }

    public AdamkycConstants $constants;
    public AdamkycDB $db;

    public function __construct () {
      $this->constants = new AdamkycConstants();
      $this->db = new AdamkycDB();
    }

    public function admin_bulk_upload (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      global $wpdb;

      $requestParams = $request->get_params();
      $requestFileParams = $request->get_file_params();

      if (!isset($requestFileParams['data'])) {
        return new WP_REST_Response($this->failure('Data file is not set.'));
      } else if (!in_array($requestFileParams['data']['type'], AdamkycRoutes::$bulk_upload_mime_types)) {
        return new WP_REST_Response($this->failure('Data file has invalid mime type.'));
      }

      $file = $requestFileParams['data'];
      $data = AdamkycSpreadsheet::readUpload($file['tmp_name']);

      if (!is_array($data) || empty($data)) {
        $wpdb->insert($this->constants->table_uploads, [
          'user_id' => get_current_user_id(),
          'type' => $requestParams['type'],
          'status' => 'FAILURE',
        ]);

        return new WP_REST_Response($this->success());
      }

      $wpdb->insert($this->constants->table_uploads, [
        'user_id' => get_current_user_id(),
        'type' => $requestParams['type'],
        'status' => 'SUCCESS'
      ]);

      $upload_id = $wpdb->insert_id;

      foreach ($data as $item) {
        $itemData = [
          'schema' => AdamkycRoutes::$search_collections_map[$requestParams['type']],
          'caption' => $item['name'],
          'properties' => $item,
          'first_seen' => current_time('mysql', 1),
          'last_change' => current_time('mysql', 1),
          'last_seen' => current_time('mysql', 1),
        ];

        $wpdb->insert($this->constants->table_entities, [
          'user_id' => get_current_user_id(),
          'upload_id' => $upload_id,
          'state' => 'DRAFT',
          'data' => json_encode($itemData),
        ]);

        $wpdb->update($this->constants->table_entities, [
          'data' => json_encode(array_merge($itemData, ['id' => $wpdb->insert_id])),
        ], ['id' => $wpdb->insert_id]);
      }

      return new WP_REST_Response($this->success());
    }

    public function admin_bulk_upload_history (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();
      $status = $requestParams['status'] ?? '';
      $entity_type = $requestParams['type'] ?? '';

      global $wpdb;

      $querySmall = "SELECT * " .
        "FROM {$this->constants->table_uploads} " .
        "WHERE 1 = 1";

      $query = "SELECT u.*, COUNT(e.id) AS count_rows " .
        "FROM {$this->constants->table_uploads} AS u " .
        "LEFT OUTER JOIN {$this->constants->table_entities} AS e ON e.upload_id = u.id AND e.deleted_at IS NULL " .
        "WHERE 1 = 1";

      if (!empty($status)) {
        $querySmall .= $wpdb->prepare(" AND status = %s", $status);
        $query .= $wpdb->prepare(" AND u.status = %s", $status);
      }

      if (!empty($entity_type)) {
        $querySmall .= $wpdb->prepare(" AND type = %s", $entity_type);
        $query .= $wpdb->prepare(" AND u.type = %s", $entity_type);
      }

      $paginatedQuery = $this->paginate($request, $query, false, 'u.id DESC', 'u.id', 'u');
      $results = $wpdb->get_results($paginatedQuery);
      $objects = [];

      foreach ($results as $result) {
        $objects[] = AdamkycTransformers::upload($result);
      }

      $this->attach_users($objects);
      $output = $this->paginated_output($request, $objects, $querySmall);
      return new WP_REST_Response($this->success($output));
    }

    public function admin_bulk_upload_delete (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();

      if (!is_numeric($requestParams['id'])) {
        return new WP_REST_Response($this->failure('Incorrect value for ID parameter.'));
      }

      global $wpdb;

      $wpdb->update($this->constants->table_entities, [
        'deleted_at' => current_time('mysql', 1),
      ], ['upload_id' => $requestParams['id']]);

      $wpdb->delete($this->constants->table_uploads, ['id' => $requestParams['id']]);
      return new WP_REST_Response($this->success());
    }

    public function admin_dataset_create (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();
      $country = $requestParams['country'] ?? '';
      $sourceUrl = $requestParams['source_url'] ?? '';
      $rawTags = trim($requestParams['tags'] ?? '');
      $tags = $rawTags == '' ? [] : explode(',', $rawTags);

      if (strlen($requestParams['description']) == 0) {
        return new WP_REST_Response($this->failure('Value of description is empty.'));
      } else if (strlen($requestParams['publisher_name']) == 0) {
        return new WP_REST_Response($this->failure('Value of publisher name is empty.'));
      } else if (strlen($requestParams['publisher_url']) == 0) {
        return new WP_REST_Response($this->failure('Value of publisher url is empty.'));
      } else if (strlen($requestParams['title']) == 0) {
        return new WP_REST_Response($this->failure('Value of title is empty.'));
      }

      if (strlen($country) > 255) {
        return new WP_REST_Response($this->failure('Value of country is too long.'));
      } else if (strlen($requestParams['description']) > 1000) {
        return new WP_REST_Response($this->failure('Value of description is too long.'));
      } else if (strlen($requestParams['publisher_name']) > 255) {
        return new WP_REST_Response($this->failure('Value of publisher name is too long.'));
      } else if (strlen($requestParams['publisher_url']) > 2048) {
        return new WP_REST_Response($this->failure('Value of publisher URL is too long.'));
      } else if (strlen($sourceUrl) > 2048) {
        return new WP_REST_Response($this->failure('Value of source URL is too long.'));
      } else if (strlen($requestParams['title']) > 255) {
        return new WP_REST_Response($this->failure('Value of title is too long.'));
      }

      if ($country != '' && !preg_match('/^[a-z\-]{2,7}$/', $country)) {
        return new WP_REST_Response($this->failure('Invalid value for country field.'));
      } else if ($sourceUrl != '' && !filter_var($sourceUrl, FILTER_VALIDATE_URL)) {
        return new WP_REST_Response($this->failure('Invalid value for source URL field.'));
      } else if (!filter_var($requestParams['publisher_url'], FILTER_VALIDATE_URL)) {
        return new WP_REST_Response($this->failure('Invalid value for publisher URL field.'));
      }

      if (!empty($tags)) {
        foreach ($tags as $tag) {
          if (!in_array($tag, ['external dataset', 'non-official source'], true)) {
            return new WP_REST_Response($this->failure('Invalid value for tags field.'));
          }
        }
      }

      $datasetId = strval(intval(get_option('adamkyc_last_dataset_id', '0')) + 1);

      $this->db->database->Dataset->insertOne([
        'id' => $datasetId,
        'country' => $country,
        'description' => $requestParams['description'],
        'publisher_name' => $requestParams['publisher_name'],
        'publisher_url' => $requestParams['publisher_url'],
        'source_url' => $sourceUrl,
        'tags' => $tags,
        'title' => $requestParams['title'],
      ]);

      update_option('adamkyc_last_dataset_id', $datasetId);
      $document = $this->db->database->Dataset->findOne(['id' => $datasetId]);
      $this->remove_mongo_id($document);

      return new WP_REST_Response($this->success($document));
    }

    public function admin_entities (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();
      $state = $requestParams['state'] ?? '';
      $status = $requestParams['status'] ?? '';
      $entity_type = $requestParams['type'] ?? '';
      $search = $requestParams['q'] ?? '';

      global $wpdb;

      $querySmall = "SELECT * " .
        "FROM {$this->constants->table_entities} " .
        "WHERE 1 = 1";

      $query = "SELECT e.*, COUNT(v.id) AS views " .
        "FROM {$this->constants->table_entities} AS e " .
        "LEFT OUTER JOIN {$this->constants->table_views} AS v ON v.entity_id = CAST(e.id AS CHAR) " .
        "WHERE 1 = 1";

      if ($state == 'DELETED') {
        $querySmall .= " AND deleted_at IS NOT NULL";
        $query .= " AND e.deleted_at IS NOT NULL";
      } else {
        $querySmall .= " AND deleted_at IS NULL";
        $query .= " AND e.deleted_at IS NULL";
      }

      if (!empty($state) && $state != 'DELETED') {
        $querySmall .= $wpdb->prepare(" AND state = %s", $state);
        $query .= $wpdb->prepare(" AND e.state = %s", $state);
      }

      if (!empty($status)) {
        $querySmall .= $wpdb->prepare(" AND status = %s", $status);
        $query .= $wpdb->prepare(" AND e.status = %s", $status);
      }

      if (!empty($entity_type)) {
        $querySmall .= $wpdb->prepare(" AND JSON_EXTRACT(data, \"$.schema\") = %s", AdamkycRoutes::$search_collections_map[$entity_type]);
        $query .= $wpdb->prepare(" AND JSON_EXTRACT(e.data, \"$.schema\") = %s", AdamkycRoutes::$search_collections_map[$entity_type]);
      }

      if (!empty($search)) {
        $querySmall .= $wpdb->prepare(" AND LOWER(JSON_EXTRACT(data, \"$.caption\")) LIKE %s", "%{$wpdb->esc_like(strtolower($search))}%");
        $query .= $wpdb->prepare(" AND LOWER(JSON_EXTRACT(e.data, \"$.caption\")) LIKE %s", "%{$wpdb->esc_like(strtolower($search))}%");
      }

      $paginatedQuery = $this->paginate($request, $query, false, 'e.id DESC', 'e.id', 'e');
      $results = $wpdb->get_results($paginatedQuery);
      $objects = [];

      foreach ($results as $result) {
        $objects[] = AdamkycTransformers::entity($result);
      }

      $this->attach_users($objects);
      $output = $this->paginated_output($request, $objects, $querySmall);
      return new WP_REST_Response($this->success($output));
    }

    public function admin_entities_delete (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      global $wpdb;
      $requestParams = $request->get_params();
      $identifiers = explode(',', $requestParams['identifiers']);

      foreach ($identifiers as $identifier) {
        if (!is_numeric($identifier)) {
          return new WP_REST_Response($this->failure('Incorrect value for query parameter identifiers. Expected list of comma separated integers.'));
        }
      }

      foreach ($identifiers as $identifier) {
        $wpdb->update($this->constants->table_entities, [
          'deleted_at' => current_time('mysql', 1),
        ], ['id' => $identifier]);
      }

      return new WP_REST_Response($this->success());
    }

    public function admin_entities_patch (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      global $wpdb;
      $requestParams = $request->get_params();
      $data = $requestParams['data'];

      foreach ($data as $item) {
        $wpdb->update($this->constants->table_entities, [
          'status' => empty($item['status']) ? null : $item['status']
        ], ['id' => $item['id']]);
      }

      return new WP_REST_Response($this->success());
    }

    public function admin_entity_create (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();
      $state = $requestParams['state'];
      $status = $requestParams['status'] ?? '';
      $data = $requestParams['data'];

      global $wpdb;

      $wpdb->insert($this->constants->table_entities, [
        'user_id' => get_current_user_id(),
        'state' => $state,
        'status' => empty($status) ? null : $status,
        'data' => json_encode($data),
      ]);

      $insertedId = $wpdb->insert_id;

      $wpdb->update($this->constants->table_entities, [
        'data' => json_encode(array_merge($data, ['id' => $insertedId])),
      ], ['id' => $insertedId]);

      $entityQuery = $wpdb->prepare("SELECT * FROM {$this->constants->table_entities} WHERE id = %d", $insertedId);
      $entity = $wpdb->get_row($entityQuery);
      return new WP_REST_Response($this->success(AdamkycTransformers::entity($entity)));
    }

    public function admin_entity_delete (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();

      if (!is_numeric($requestParams['id'])) {
        return new WP_REST_Response($this->failure('Incorrect value for ID parameter.'));
      }

      global $wpdb;

      $wpdb->update($this->constants->table_entities, [
        'deleted_at' => current_time('mysql', 1),
      ], ['id' => $requestParams['id']]);

      return new WP_REST_Response($this->success());
    }

    public function admin_entity_update (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();
      $state = $requestParams['state'];
      $status = $requestParams['status'] ?? '';
      $data = $requestParams['data'];

      if (!is_numeric($requestParams['id'])) {
        return new WP_REST_Response($this->failure('Incorrect value for ID parameter.'));
      }

      global $wpdb;

      $data['id'] = $requestParams['id'];

      $wpdb->update($this->constants->table_entities, [
        'state' => $state,
        'status' => empty($status) ? null : $status,
        'data' => json_encode($data),
      ], ['id' => $requestParams['id']]);

      $entityQuery = $wpdb->prepare("SELECT * FROM {$this->constants->table_entities} WHERE id = %d", $requestParams['id']);
      $entity = $wpdb->get_row($entityQuery);
      return new WP_REST_Response($this->success(AdamkycTransformers::entity($entity)));
    }

    public function admin_entity_patch (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();
      $status = $requestParams['status'] ?? '';

      if (!is_numeric($requestParams['id'])) {
        return new WP_REST_Response($this->failure('Incorrect value for ID parameter.'));
      }

      global $wpdb;

      $wpdb->update($this->constants->table_entities, [
        'status' => empty($status) ? null : $status,
      ], ['id' => $requestParams['id']]);

      return new WP_REST_Response($this->success());
    }

    public function admin_entity_view (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();

      if (!is_numeric($requestParams['id'])) {
        return new WP_REST_Response($this->failure('Incorrect value for ID parameter.'));
      }

      global $wpdb;

      $entityQuery = $wpdb->prepare("SELECT * FROM {$this->constants->table_entities} WHERE id = %d", $requestParams['id']);
      $entity = $wpdb->get_row($entityQuery);

      if ($entity == null) {
        return new WP_REST_Response($this->failure('Incorrect value for ID parameter.'));
      }

      return new WP_REST_Response($this->success(AdamkycTransformers::entity($entity)));
    }

    public function admin_reports (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();
      $state = $requestParams['state'] ?? '';
      $status = $requestParams['status'] ?? '';
      $entity_type = $requestParams['type'] ?? '';
      $search = $requestParams['q'] ?? '';

      global $wpdb;

      $query = "SELECT * " .
        "FROM {$this->constants->table_reports} " .
        "WHERE 1 = 1";

      if ($state == 'DELETED') {
        $query .= " AND deleted_at IS NOT NULL";
      } else {
        $query .= " AND deleted_at IS NULL";
      }

      if (!empty($status)) {
        $query .= $wpdb->prepare(" AND status = %s", $status);
      }

      if (!empty($entity_type)) {
        $query .= $wpdb->prepare(" AND entity_type = %s", $entity_type);
      }

      if (!empty($search)) {
        $like = "%{$wpdb->esc_like(strtolower($search))}%";

        $query .= $wpdb->prepare(
          " AND (LOWER(first_name) LIKE %s OR " .
          "LOWER(last_name) LIKE %s OR " .
          "LOWER(email) LIKE %s OR " .
          "LOWER(phone) LIKE %s OR " .
          "LOWER(entity_name) LIKE %s OR " .
          "LOWER(details) LIKE %s)",
          $like,
          $like,
          $like,
          $like,
          $like,
          $like,
        );
      }

      $paginatedQuery = $this->paginate($request, $query, false, 'id DESC');
      $results = $wpdb->get_results($paginatedQuery);
      $objects = [];

      foreach ($results as $result) {
        $objects[] = AdamkycTransformers::report($result);
      }

      $output = $this->paginated_output($request, $objects, $query);
      return new WP_REST_Response($this->success($output));
    }

    public function admin_reports_delete (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      global $wpdb;
      $requestParams = $request->get_params();
      $identifiers = explode(',', $requestParams['identifiers']);

      foreach ($identifiers as $identifier) {
        if (!is_numeric($identifier)) {
          return new WP_REST_Response($this->failure('Incorrect value for query parameter identifiers. Expected list of comma separated integers.'));
        }
      }

      foreach ($identifiers as $identifier) {
        $wpdb->update($this->constants->table_reports, [
          'deleted_at' => current_time('mysql', 1),
        ], ['id' => $identifier]);

        $wpdb->insert($this->constants->table_report_changelog, [
          'user_id' => get_current_user_id(),
          'report_id' => $identifier,
          'message' => 'Moved report to trash',
        ]);
      }

      return new WP_REST_Response($this->success());
    }

    public function admin_reports_update (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      global $wpdb;
      $requestParams = $request->get_params();
      $data = $requestParams['data'];

      foreach ($data as $item) {
        $wpdb->update($this->constants->table_reports, [
          'status' => empty($item['status']) ? null : $item['status']
        ], ['id' => $item['id']]);

        $wpdb->insert($this->constants->table_report_changelog, [
          'user_id' => get_current_user_id(),
          'report_id' => $item['id'],
          'message' => 'Changed report status',
        ]);
      }

      return new WP_REST_Response($this->success());
    }

    public function admin_report_view (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();

      if (!is_numeric($requestParams['id'])) {
        return new WP_REST_Response($this->failure('Incorrect value for ID parameter.'));
      }

      global $wpdb;

      $query = $wpdb->prepare("SELECT * FROM {$this->constants->table_reports} WHERE id = %d", $requestParams['id']);
      $result = $wpdb->get_row($query);

      if ($result == null) {
        return new WP_REST_Response($this->failure('Incorrect value for ID parameter.'));
      }

      return new WP_REST_Response($this->success(AdamkycTransformers::report($result)));
    }

    public function admin_report_update (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();

      if (!is_numeric($requestParams['id'])) {
        return new WP_REST_Response($this->failure('Incorrect value for ID parameter.'));
      }

      global $wpdb;

      $wpdb->update($this->constants->table_reports, [
        'status' => empty($requestParams['status']) ? null : $requestParams['status']
      ], ['id' => $requestParams['id']]);

      $wpdb->insert($this->constants->table_report_changelog, [
        'user_id' => get_current_user_id(),
        'report_id' => $requestParams['id'],
        'message' => 'Changed report status',
      ]);

      return new WP_REST_Response($this->success());
    }

    public function admin_report_delete (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();

      if (!is_numeric($requestParams['id'])) {
        return new WP_REST_Response($this->failure('Incorrect value for ID parameter.'));
      }

      global $wpdb;

      $wpdb->update($this->constants->table_reports, [
        'deleted_at' => current_time('mysql', 1),
      ], ['id' => $requestParams['id']]);

      $wpdb->insert($this->constants->table_report_changelog, [
        'user_id' => get_current_user_id(),
        'report_id' => $requestParams['id'],
        'message' => 'Moved report to trash',
      ]);

      return new WP_REST_Response($this->success());
    }

    public function admin_report_changelog (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();

      if (!is_numeric($requestParams['id'])) {
        return new WP_REST_Response($this->failure('Incorrect value for ID parameter.'));
      }

      global $wpdb;

      $query = $wpdb->prepare(
        "SELECT * " .
        "FROM {$this->constants->table_report_changelog} " .
        "WHERE report_id = %d " .
        "ORDER BY id DESC",
        $requestParams['id']
      );

      $results = $wpdb->get_results($query);
      $objects = [];

      foreach ($results as $result) {
        $objects[] = AdamkycTransformers::report_changelog($result);
      }

      $this->attach_users($objects);
      return new WP_REST_Response($this->success($objects));
    }

    public function admin_report_notes (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();

      if (!is_numeric($requestParams['id'])) {
        return new WP_REST_Response($this->failure('Incorrect value for ID parameter.'));
      }

      global $wpdb;

      $query = $wpdb->prepare(
        "SELECT * " .
        "FROM {$this->constants->table_report_notes} " .
        "WHERE report_id = %d",
        $requestParams['id']
      );

      $results = $wpdb->get_results($query);
      $objects = [];

      foreach ($results as $result) {
        $objects[] = AdamkycTransformers::report_note($result);
      }

      $this->attach_users($objects);
      return new WP_REST_Response($this->success($objects));
    }

    public function admin_report_note_create (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();

      if (!is_numeric($requestParams['id'])) {
        return new WP_REST_Response($this->failure('Incorrect value for ID parameter.'));
      }

      if (strlen($requestParams['subject']) == 0) {
        return new WP_REST_Response($this->failure('Value of subject is empty.'));
      } else if (strlen($requestParams['note']) == 0) {
        return new WP_REST_Response($this->failure('Value of notes is empty.'));
      }

      if (strlen($requestParams['subject']) > 255) {
        return new WP_REST_Response($this->failure('Value of subject is too long.'));
      } else if (strlen($requestParams['note']) > 65535) {
        return new WP_REST_Response($this->failure('Value of notes is too long.'));
      }

      global $wpdb;

      $wpdb->insert($this->constants->table_report_notes, [
        'user_id' => get_current_user_id(),
        'report_id' => $requestParams['id'],
        'subject' => $requestParams['subject'],
        'note' => $requestParams['note'],
      ]);

      $wpdb->insert($this->constants->table_report_changelog, [
        'user_id' => get_current_user_id(),
        'report_id' => $requestParams['id'],
        'message' => 'Created note',
      ]);

      return new WP_REST_Response($this->success());
    }

    public function admin_report_note_update (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();

      if (!is_numeric($requestParams['id'])) {
        return new WP_REST_Response($this->failure('Incorrect value for ID parameter.'));
      } else if (!is_numeric($requestParams['note_id'])) {
        return new WP_REST_Response($this->failure('Incorrect value for note ID parameter.'));
      }

      if (strlen($requestParams['subject']) == 0) {
        return new WP_REST_Response($this->failure('Value of subject is empty.'));
      } else if (strlen($requestParams['note']) == 0) {
        return new WP_REST_Response($this->failure('Value of notes is empty.'));
      }

      if (strlen($requestParams['subject']) > 255) {
        return new WP_REST_Response($this->failure('Value of subject is too long.'));
      } else if (strlen($requestParams['note']) > 65535) {
        return new WP_REST_Response($this->failure('Value of notes is too long.'));
      }

      global $wpdb;

      $wpdb->update($this->constants->table_report_notes, [
        'subject' => $requestParams['subject'],
        'note' => $requestParams['note'],
        'updated_at' => current_time('mysql', 1),
      ], ['id' => $requestParams['note_id']]);

      $wpdb->insert($this->constants->table_report_changelog, [
        'user_id' => get_current_user_id(),
        'report_id' => $requestParams['id'],
        'message' => 'Updated note',
      ]);

      return new WP_REST_Response($this->success());
    }

    public function admin_report_note_delete (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();

      if (!is_numeric($requestParams['id'])) {
        return new WP_REST_Response($this->failure('Incorrect value for ID parameter.'));
      } else if (!is_numeric($requestParams['note_id'])) {
        return new WP_REST_Response($this->failure('Incorrect value for note ID parameter.'));
      }

      global $wpdb;

      $wpdb->delete($this->constants->table_report_notes, ['id' => $requestParams['note_id']]);

      $wpdb->insert($this->constants->table_report_changelog, [
        'user_id' => get_current_user_id(),
        'report_id' => $requestParams['id'],
        'message' => 'Deleted note',
      ]);

      return new WP_REST_Response($this->success());
    }

    public function bookmark (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      global $wpdb;

      $data = [
        'user_id' => get_current_user_id(),
        'entity_id' => $request->get_param('id')
      ];

      $query = $wpdb->prepare(
        "SELECT * " .
        "FROM {$this->constants->table_bookmarks} " .
        "WHERE user_id = %d AND entity_id = %s",
        ...$data
      );

      $results = $wpdb->get_results($query);

      if (count($results) === 0) {
        $wpdb->insert($this->constants->table_bookmarks, $data);
      } else {
        $wpdb->delete($this->constants->table_bookmarks, $data);
      }

      return new WP_REST_Response($this->success());
    }

    public function bookmarks (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      global $wpdb;

      $query = $wpdb->prepare(
        "SELECT * " .
        "FROM {$this->constants->table_bookmarks} " .
        "WHERE user_id = %d",
        get_current_user_id()
      );

      $paginatedQuery = $this->paginate($request, $query);
      $results = $wpdb->get_results($paginatedQuery);
      $identifiers = [];

      foreach ($results as $result) {
        $identifiers[] = $result->entity_id;
      }

      $documents = $this->get_documents($identifiers);
      $output = $this->paginated_output($request, $documents, $query);
      return new WP_REST_Response($this->success($output));
    }

    public function bookmarks_clear (): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      global $wpdb;

      $wpdb->delete($this->constants->table_bookmarks, [
        'user_id' => get_current_user_id()
      ]);

      return new WP_REST_Response($this->success());
    }

    public function bulk_upload (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();
      $requestFileParams = $request->get_file_params();

      if (!isset($requestFileParams['data'])) {
        return new WP_REST_Response($this->failure('Data file is not set.'));
      } else if (!in_array($requestFileParams['data']['type'], AdamkycRoutes::$bulk_upload_mime_types)) {
        return new WP_REST_Response($this->failure('Data file has invalid mime type.'));
      }

      $file = $requestFileParams['data'];
      $data = AdamkycSpreadsheet::read($file['tmp_name']);

      if (!is_array($data)) {
        $err = $data;
        return new WP_REST_Response($this->failure($err->getMessage()));
      } else if (empty($data)) {
        return new WP_REST_Response($this->failure('Data file is empty.'));
      }

      global $wpdb;

      foreach ($data as $keyword) {
        $insert_data = [
          'user_id' => get_current_user_id(),
          'entity_id' => null,
          'search' => $keyword,
          'type' => $requestParams['type']
        ];

        $searchResult = $this->search_documents($requestParams['type'], $keyword, null, null, null, null, null, false);

        if ($searchResult['totalItems'] > 0) {
          $insert_data['entity_id'] = $searchResult['items'][0]['id'];
        }

        $wpdb->insert($this->constants->table_bulk_upload, $insert_data);
      }

      return new WP_REST_Response($this->success());
    }

    public function bulk_upload_delete (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();
      $identifiers = explode(',', $requestParams['identifiers']);

      foreach ($identifiers as $identifier) {
        if (!is_numeric($identifier)) {
          return new WP_REST_Response($this->failure('Incorrect value for query parameter identifiers. Expected list of comma separated integers.'));
        }
      }

      global $wpdb;

      foreach ($identifiers as $identifier) {
        $wpdb->delete($this->constants->table_bulk_upload, [
          'id' => $identifier,
          'user_id' => get_current_user_id(),
        ]);
      }

      return new WP_REST_Response($this->success());
    }

    public function bulk_upload_download (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();
      $identifiers = explode(',', $requestParams['identifiers']);

      foreach ($identifiers as $identifier) {
        if (!is_numeric($identifier)) {
          return new WP_REST_Response($this->failure('Incorrect value for query parameter identifiers. Expected list of comma separated integers.'));
        }
      }

      global $wpdb;

      $query = $wpdb->prepare(
        "SELECT * " .
        "FROM {$this->constants->table_bulk_upload} " .
        "WHERE id IN (" . implode(', ', array_fill(0, count($identifiers), '%d')) . ")",
        ...$identifiers
      );

      $results = $wpdb->get_results($query);
      $documentsIdentifiers = [];

      foreach ($results as $result) {
        if ($result->entity_id != null) {
          $documentsIdentifiers[] = $result->entity_id;
        }
      }

      $documents = $this->get_documents($documentsIdentifiers, false);
      $documentsObject = [];

      foreach ($documents as $document) {
        $documentsObject[$document['id'] . '.json'] = $document;
      }

      try {
        $zipFile = AdamkycZip::create($documentsObject);
      } catch (Exception $err) {
        return new WP_REST_Response($this->failure($err->getMessage()));
      }

      add_filter('rest_pre_serve_request', [$this, 'serve_zip'], 0, 2);

      return new WP_REST_Response(file_get_contents($zipFile), 200, [
        'Content-Type' => 'application/zip',
        'Content-Length' => filesize($zipFile),
        'Content-Disposition' => 'attachment; filename=entities.zip',
      ]);
    }

    public function bulk_upload_history (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      global $wpdb;

      $query = $wpdb->prepare(
        "SELECT * " .
        "FROM {$this->constants->table_bulk_upload} " .
        "WHERE user_id = %d",
        get_current_user_id()
      );

      $paginatedQuery = $this->paginate($request, $query, false, "id DESC");
      $results = $wpdb->get_results($paginatedQuery);
      $objects = [];

      foreach ($results as $result) {
        $objects[] = AdamkycTransformers::bulk_upload($result);
      }

      $output = $this->paginated_output($request, $objects, $query);
      return new WP_REST_Response($this->success($output));
    }

    public function connect (WP_REST_Request $request): WP_REST_Response {
      if ($this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is already connected.'));
      }

      $requestParams = $request->get_params();

      update_option('adamkyc_mongo_username', $requestParams['username']);
      update_option('adamkyc_mongo_password', $requestParams['password']);
      update_option('adamkyc_mongo_hostname', $requestParams['hostname']);
      update_option('adamkyc_mongo_database', $requestParams['database']);

      if (($err = $this->db->connect()) === null) {
        return new WP_REST_Response($this->success());
      } else {
        delete_option('adamkyc_mongo_username');
        delete_option('adamkyc_mongo_password');
        delete_option('adamkyc_mongo_hostname');
        delete_option('adamkyc_mongo_database');
        return new WP_REST_Response($this->failure($err->getMessage()));
      }
    }

    public function connection (): WP_REST_Response {
      return new WP_REST_Response($this->success([
        'connected' => $this->db->connected(),
        'username' => get_option('adamkyc_mongo_username', ''),
        'hostname' => get_option('adamkyc_mongo_hostname', ''),
        'database' => get_option('adamkyc_mongo_database', ''),
      ]));
    }

    public function datasets (): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $cursor = $this->db->database->Dataset->find([
        'id' => ['$ne' => '']
      ]);

      $documents = $this->cursor_documents($cursor);
      return new WP_REST_Response($this->success($documents));
    }

    public function disconnect (): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $this->db->disconnect();
      delete_option('adamkyc_mongo_username');
      delete_option('adamkyc_mongo_password');
      delete_option('adamkyc_mongo_hostname');
      delete_option('adamkyc_mongo_database');
      return new WP_REST_Response($this->success());
    }

    public function download (WP_REST_Request $request): WP_REST_Response {
      $data = $this->entity($request, false);

      if (!$data['status']) {
        return new WP_REST_Response($data);
      } else {
        return new WP_REST_Response($data['data'], 200, [
          'Content-Disposition' => 'attachment; filename=entity.json'
        ]);
      }
    }

    public function entity (WP_REST_Request $request, $sendResponse = true): WP_REST_Response | array {
      if (!$this->db->connected()) {
        $errorMessage = $this->failure('MongoDB is not connected, please contact system administrator.');
        return $sendResponse ? new WP_REST_Response($errorMessage) : $errorMessage;
      }

      $requestParams = $request->get_params();
      $document = $this->get_document($requestParams['id']);

      if ($document == null) {
        $errorMessage = $this->failure('Entity was not found.');
        return $sendResponse ? new WP_REST_Response($errorMessage) : $errorMessage;
      }

      $this->attach_relation_ids($document);
      global $wpdb;

      $wpdb->insert($this->constants->table_views, [
        'user_id' => get_current_user_id(),
        'entity_id' => $requestParams['id']
      ]);

      $data = $this->success($document);
      return $sendResponse ? new WP_REST_Response($data) : $data;
    }

    public function history (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      global $wpdb;

      $query = $wpdb->prepare(
        "SELECT * " .
        "FROM {$this->constants->table_history} " .
        "WHERE deleted_at IS NULL AND user_id = %d",
        get_current_user_id()
      );

      $paginatedQuery = $this->paginate($request, $query, false, "created_at DESC");
      $results = $wpdb->get_results($paginatedQuery);
      $objects = [];

      foreach ($results as $result) {
        $objects[] = AdamkycTransformers::history($result);
      }

      $output = $this->paginated_output($request, $objects, $query);
      return new WP_REST_Response($this->success($output));
    }

    public function history_clear (): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      global $wpdb;

      $wpdb->update($this->constants->table_history, [
        'deleted_at' => current_time('mysql', 1),
      ], ['user_id' => get_current_user_id()]);

      $wpdb->update($this->constants->table_views, [
        'deleted_at' => current_time('mysql', 1),
      ], ['user_id' => get_current_user_id()]);

      return new WP_REST_Response($this->success());
    }

    public function last_viewed (): WP_REST_Response | array {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      global $wpdb;

      $query = $wpdb->prepare(
        "SELECT user_id, entity_id " .
        "FROM {$this->constants->table_views} " .
        "WHERE deleted_at IS NULL AND user_id = %d " .
        "GROUP BY user_id, entity_id " .
        "ORDER BY created_at DESC " .
        "LIMIT 10",
        get_current_user_id()
      );

      $results = $wpdb->get_results($query);
      $identifiers = [];

      foreach ($results as $result) {
        $identifiers[] = $result->entity_id;
      }

      $documents = $this->get_documents($identifiers);
      return new WP_REST_Response($this->success($documents));
    }

    public function me (): WP_REST_Response {
      return new WP_REST_Response($this->success([
        'is_admin' => is_super_admin(),
      ]));
    }

    public function recent_search (): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      global $wpdb;

      $query = $wpdb->prepare(
        "SELECT user_id, search " .
        "FROM {$this->constants->table_history} " .
        "WHERE deleted_at IS NULL AND user_id = %d " .
        "GROUP BY user_id, search " .
        "ORDER BY created_at DESC " .
        "LIMIT 10",
        get_current_user_id()
      );

      $results = $wpdb->get_results($query);
      $keywords = [];

      foreach ($results as $result) {
        $keywords[] = $result->search;
      }

      return new WP_REST_Response($this->success($keywords));
    }

    public function report (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();

      if (strlen($requestParams['firstName']) == 0) {
        return new WP_REST_Response($this->failure('Value of first name is empty.'));
      } else if (strlen($requestParams['lastName']) == 0) {
        return new WP_REST_Response($this->failure('Value of last name is empty.'));
      } else if (strlen($requestParams['email']) == 0) {
        return new WP_REST_Response($this->failure('Value of email is empty.'));
      } else if (strlen($requestParams['details']) == 0) {
        return new WP_REST_Response($this->failure('Value of details is empty.'));
      } else if (strlen($requestParams['relationship']) == 0) {
        return new WP_REST_Response($this->failure('Value of relationship is empty.'));
      }

      if (strlen($requestParams['firstName']) > 255) {
        return new WP_REST_Response($this->failure('Value of first name is too long.'));
      } else if (strlen($requestParams['lastName']) > 255) {
        return new WP_REST_Response($this->failure('Value of last name is too long.'));
      } else if (strlen($requestParams['email']) > 255) {
        return new WP_REST_Response($this->failure('Value of email is too long.'));
      } else if (strlen($requestParams['phone']) > 255) {
        return new WP_REST_Response($this->failure('Value of phone number is too long.'));
      } else if (strlen($requestParams['details']) > 65535) {
        return new WP_REST_Response($this->failure('Value of details is too long.'));
      } else if (strlen($requestParams['relationship']) > 255) {
        return new WP_REST_Response($this->failure('Value of relationship is too long.'));
      }

      if (!filter_var($requestParams['email'], FILTER_VALIDATE_EMAIL)) {
        return new WP_REST_Response($this->failure('Invalid value for email field.'));
      } else if ($requestParams['phone'] != '' && !preg_match("/^\+?[\d\-)( ]+$/", $requestParams['phone'])) {
        return new WP_REST_Response($this->failure('Invalid value for phone number field.'));
      }

      $document = $this->get_document($requestParams['id']);

      if ($document == null) {
        return new WP_REST_Response($this->failure('Invalid entity id.'));
      }

      global $wpdb;

      $wpdb->insert($this->constants->table_reports, [
        'user_id' => get_current_user_id(),
        'entity_id' => $document['id'],
        'entity_name' => $document['caption'],
        'entity_type' => $document['schema'],
        'first_name' => $requestParams['firstName'],
        'last_name' => $requestParams['firstName'],
        'email' => $requestParams['email'],
        'phone' => $requestParams['phone'],
        'details' => $requestParams['details'],
        'relationship' => $requestParams['relationship'],
      ]);

      $wpdb->insert($this->constants->table_report_changelog, [
        'user_id' => get_current_user_id(),
        'report_id' => $wpdb->insert_id,
        'message' => 'Created report',
      ]);

      return new WP_REST_Response($this->success());
    }

    public function search (WP_REST_Request $request): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $requestParams = $request->get_params();

      $searchResult = $this->search_documents(
        $requestParams['type'] ?? '',
        $requestParams['q'] ?? '',
        $requestParams['page'],
        $requestParams['sort'] ?? null,
        $requestParams['country'] ?? null,
        $requestParams['topics'] ?? null,
        $requestParams
      );

      $this->assign_bookmarked($searchResult['items']);

      global $wpdb;

      $wpdb->insert($this->constants->table_history, [
        'user_id' => get_current_user_id(),
        'search' => $requestParams['q'] ?? '',
        'type' => $requestParams['type'] ?? '',
        'count' => $searchResult['totalItems']
      ]);

      return new WP_REST_Response($this->success($searchResult));
    }

    public function topics (): WP_REST_Response {
      if (!$this->db->connected()) {
        return new WP_REST_Response($this->failure('MongoDB is not connected, please contact system administrator.'));
      }

      $cursor = $this->db->database->Topic->find([
        'id' => ['$ne' => '']
      ]);

      $result = [];

      foreach ($cursor as $document) {
        $result[$document['id']] = $document['label'];
      }

      return new WP_REST_Response($this->success($result));
    }

    public function assign_bookmarked (mixed &$documents): void {
      global $wpdb;

      if (is_array($documents) && empty($documents)) {
        return;
      }

      $identifiers = [];

      if (is_array($documents)) {
        foreach ($documents as $document) {
          $identifiers[] = $document['id'];
        }
      } else {
        $identifiers[] = $documents['id'];
      }

      $query = $wpdb->prepare(
        "SELECT * " .
        "FROM {$this->constants->table_bookmarks} " .
        "WHERE user_id = %d AND entity_id IN (" . implode(', ', array_fill(0, count($identifiers), '%s')) . ")",
        get_current_user_id(),
        ...$identifiers
      );

      $results = $wpdb->get_results($query);

      if (is_array($documents)) {
        foreach ($documents as &$document) {
          $bookmarked = false;

          foreach ($results as $result) {
            if ($result->entity_id == $document['id']) {
              $bookmarked = true;
              break;
            }
          }

          $document['bookmarked'] = $bookmarked;
        }
      } else {
        $bookmarked = false;

        foreach ($results as $result) {
          if ($result->entity_id == $documents['id']) {
            $bookmarked = true;
            break;
          }
        }

        $documents['bookmarked'] = $bookmarked;
      }
    }

    public function attach_relation_ids (mixed &$document): void {
      if (!isset($document['relations'])) {
        return;
      }

      $properties = [
        'agent',
        'asset',
        'associate',
        'client',
        'director',
        'employee',
        'employer',
        'member',
        'object',
        'organization',
        'owner',
        'person',
        'post',
        'relative',
        'subject',
      ];

      $identifiers = [];

      foreach ($document['relations'] as $relation) {
        foreach ($properties as $property) {
          if (isset($relation['properties'][$property][0])) {
            $identifiers[] = $relation['properties'][$property][0];
          }
        }
      }

      $relationEntities = $this->get_documents($identifiers, false);

      foreach ($document['relations'] as &$relation) {
        foreach ($properties as $property) {
          if (!isset($relation['properties'][$property][0])) {
            continue;
          }

          foreach ($relationEntities as $relationEntity) {
            if ($relationEntity['id'] == $relation['properties'][$property][0]) {
              $relation['properties'][$property . 'Entity'] = $relationEntity;
              break;
            }
          }
        }
      }
    }

    public function attach_users (mixed &$documents): void {
      $identifiers = [];

      foreach ($documents as $document) {
        $identifiers[] = $document['user_id'];
      }

      $users = get_users(['include' => $identifiers]);

      foreach ($documents as &$document) {
        $document['user'] = null;

        foreach ($users as $user) {
          if ($user->ID == $document['user_id']) {
            $document['user'] = AdamkycTransformers::user($user);
            break;
          }
        }
      }
    }

    public function cursor_documents (mixed $cursor): array {
      $documents = [];

      foreach ($cursor as $document) {
        $documents[] = $document;
      }

      $this->remove_mongo_id($documents);
      return $documents;
    }

    public function search_documents (
      string $type,
      string $keywords,
      int | null $page,
      string | null $sort,
      string | null $country,
      string | null $topics,
      array | null $params,
      $multiple = true
    ): array {
      $sort = $sort == '' ? null : $sort;
      $page = $page ?? 1;
      $country = $country == null || $country == '' ? null : $country;
      $topics = $topics == null || $topics == '' ? null : array_map('trim', explode(',', strtolower($topics)));
      $collections = [$type];

      if ($type == 'legal-entity') {
        $collections = ['legal-entity', 'company', 'organization'];
      } else if ($type == 'vessel') {
        $collections = ['airplane', 'vessel'];
      } else if ($type == '') {
        $collections = AdamkycRoutes::$search_collections;
      }

      $perPage = 20;
      $offset = ($page - 1) * $perPage;
      $limit = $multiple ? $perPage : 1;
      $total = 0;
      $documents = [];

      // todo extend search to search for custom IDs too
      foreach ($collections as $collectionName) {
        $tableName = AdamkycRoutes::$search_collections_map[$collectionName];
        $collection = $this->db->database->{$tableName};
        $filter = AdamkycRoutes::search_metadata($collectionName, $keywords);

        $filter['$and'][] = ['id' => [
          '$exists' => true
        ]];

        if ($country != null) {
          $filter['$and'][] = ['properties.country' => $country];
        }

        if ($topics != null) {
          $filter['$and'][] = ['properties.topics' => [
            '$in' => $topics
          ]];
        }

        if ($params != null) {
          foreach (AdamkycConstants::search_properties() as $propertyName => $propertyData) {
            $paramPropertyName = str_replace('properties.', 'properties_', $propertyName);

            if (isset($params[$paramPropertyName])) {
              $values = explode(',', $params[$paramPropertyName]);

              // todo uncomment when indexes created are in crawler
              // foreach ($values as &$value) {
              //   $value = new MongoDB\BSON\Regex($value, 'i');
              // }

              $propertyData = [];
              $propertyData[$propertyName] = ['$in' => $values];
              $filter['$and'][] = $propertyData;
            }
          }
        }

        $collectionTotal = $collection->countDocuments($filter);
        $total += $collectionTotal;

        if (count($documents) != $perPage && ($collectionTotal - $offset) > 0) {
          $cursorQuery = [
            'skip' => $offset,
            'limit' => $limit - count($documents)
          ];

          if ($sort != null) {
            $cursorQuery['sort'] = ['last_change' => $sort == 'asc' ? 1 : -1];
          }

          $cursor = $collection->find($filter, $cursorQuery);
          array_push($documents, ...$this->cursor_documents($cursor));
        }

        if ($offset > 0) {
          $offset -= min($collectionTotal, $offset);
        }
      }

      return [
        'items' => $documents,
        'page' => $page,
        'totalItems' => $total,
        'totalPages' => ceil($total / $perPage),
      ];
    }

    public function get_document (string $identifier): mixed {
      foreach (AdamkycRoutes::$search_collections as $collectionName) {
        $tableName = AdamkycRoutes::$search_collections_map[$collectionName];
        $collection = $this->db->database->{$tableName};
        $document = $collection->findOne(['id' => $identifier]);

        if ($document == null) {
          continue;
        }

        $document['relations'] = [
          ...(
            isset($document['properties']['addressEntity'][0])
              ? $this->cursor_documents(
                $this->db->database->Address->find([
                  'id' => ['$in' => $document['properties']['addressEntity']]
                ])
              )
              : []
          ),
          ...(
            isset($document['properties']['holder'][0])
              ? [
                ...$this->cursor_documents(
                  $this->db->database->Company->find([
                    'id' => $document['properties']['holder'][0]
                  ])
                ),
                ...$this->cursor_documents(
                  $this->db->database->LegalEntity->find([
                    'id' => $document['properties']['holder'][0]
                  ])
                ),
                ...$this->cursor_documents(
                  $this->db->database->Organization->find([
                    'id' => $document['properties']['holder'][0]
                  ])
                ),
                ...$this->cursor_documents(
                  $this->db->database->Person->find([
                    'id' => $document['properties']['holder'][0]
                  ])
                )
              ]
              : []
          ),
          ...(
            isset($document['properties']['issuer'][0])
              ? [
                ...$this->cursor_documents(
                  $this->db->database->Company->find([
                    'id' => $document['properties']['issuer'][0]
                  ])
                ),
                ...$this->cursor_documents(
                  $this->db->database->LegalEntity->find([
                    'id' => $document['properties']['issuer'][0]
                  ])
                ),
                ...$this->cursor_documents(
                  $this->db->database->Organization->find([
                    'id' => $document['properties']['issuer'][0]
                  ])
                ),
                ...$this->cursor_documents(
                  $this->db->database->Person->find([
                    'id' => $document['properties']['issuer'][0]
                  ])
                )
              ]
              : []
          ),
          ...$this->cursor_documents(
            $this->db->database->Associate->find([
              '$or' => [
                ['properties.associate' => $document['id']],
                ['properties.person' => $document['id']],
              ]
            ])
          ),
          ...$this->cursor_documents(
            $this->db->database->CryptoWallet->find(['properties.holder' => $document['id']])
          ),
          ...$this->cursor_documents(
            $this->db->database->Directorship->find([
              '$or' => [
                ['properties.director' => $document['id']],
                ['properties.organization' => $document['id']],
              ]
            ])
          ),
          ...$this->cursor_documents(
            $this->db->database->Employment->find([
              '$or' => [
                ['properties.employee' => $document['id']],
                ['properties.employer' => $document['id']],
              ]
            ])
          ),
          ...$this->cursor_documents(
            $this->db->database->Family->find([
              '$or' => [
                ['properties.person' => $document['id']],
                ['properties.relative' => $document['id']],
              ]
            ])
          ),
          ...$this->cursor_documents(
            $this->db->database->Identification->find(['properties.holder' => $document['id']])
          ),
          ...$this->cursor_documents(
            $this->db->database->Membership->find([
              '$or' => [
                ['properties.member' => $document['id']],
                ['properties.organization' => $document['id']],
              ]
            ])
          ),
          ...$this->cursor_documents(
            $this->db->database->Occupancy->find([
              '$or' => [
                ['properties.holder' => $document['id']],
                ['properties.post' => $document['id']],
              ]
            ])
          ),
          ...$this->cursor_documents(
            $this->db->database->Ownership->find([
              '$or' => [
                ['properties.asset' => $document['id']],
                ['properties.owner' => $document['id']],
              ]
            ])
          ),
          ...$this->cursor_documents(
            $this->db->database->Passport->find(['properties.holder' => $document['id']])
          ),
          ...$this->cursor_documents(
            $this->db->database->Representation->find([
              '$or' => [
                ['properties.agent' => $document['id']],
                ['properties.client' => $document['id']],
              ]
            ])
          ),
          ...$this->cursor_documents(
            $this->db->database->Sanction->find(['properties.entity' => $document['id']])
          ),
          ...$this->cursor_documents(
            $this->db->database->Security->find(['properties.issuer' => $document['id']])
          ),
          ...$this->cursor_documents(
            $this->db->database->UnknownLink->find([
              '$or' => [
                ['properties.object' => $document['id']],
                ['properties.subject' => $document['id']],
              ]
            ])
          ),
        ];

        $this->remove_mongo_id($document);

        foreach ($document['relations'] as $relation) {
          $this->remove_mongo_id($relation);
        }

        return $document;
      }

      if (is_numeric($identifier)) {
        global $wpdb;

        $entityQuery = $wpdb->prepare("SELECT * FROM {$this->constants->table_entities} WHERE id = %d", $identifier);
        $entity = $wpdb->get_row($entityQuery);

        if ($entity != null) {
          return json_decode($entity->data, true);
        }
      }

      return null;
    }

    public function get_documents (array $identifiers, $with_bookmarked = true): array {
      $documents = [];

      foreach (AdamkycRoutes::$search_collections as $collectionName) {
        $tableName = AdamkycRoutes::$search_collections_map[$collectionName];
        $collection = $this->db->database->{$tableName};

        $cursor = $collection->find([
          'id' => [
            '$in' => $identifiers,
          ],
        ]);

        array_push($documents, ...$this->cursor_documents($cursor));
      }

      if ($with_bookmarked) {
        $this->assign_bookmarked($documents);
      }

      return $documents;
    }

    public function remove_mongo_id (mixed &$documents): void {
      if (is_array($documents)) {
        foreach ($documents as $document) {
          unset($document['_id']);
        }
      } else {
        unset($documents['_id']);
      }
    }

    public function paginate (WP_REST_Request $request, string $query, $count = false, $sortBy = "", $groupBy = "", $prefix = ""): string {
      global $wpdb;
      $requestParams = $request->get_params();

      $statement = '';
      $replacements = [];

      if (isset($requestParams['after'])) {
        $statement .= " AND " . (empty($prefix) ? "" : $prefix . ".") . "created_at >= %s";
        $replacements[] = $requestParams['after'];
      }

      if (isset($requestParams['before'])) {
        $statement .= " AND " . (empty($prefix) ? "" : $prefix . ".") . "created_at <= %s";
        $replacements[] = $requestParams['before'];
      }

      if (!empty($groupBy)) {
        $statement .= " GROUP BY " . $groupBy;
      }

      if (!empty($sortBy)) {
        $statement .= " ORDER BY " . $sortBy;
      }

      if (!$count) {
        $statement .= " LIMIT 20 OFFSET %d";
        $replacements[] = ($requestParams['page'] - 1) * 20;
      }

      return $query . $wpdb->prepare($statement, ...$replacements);
    }

    public function paginated_output (WP_REST_Request $request, array $items, string $query): array {
      global $wpdb;

      $requestParams = $request->get_params();
      $paginatedCountQuery = $this->paginate($request, $query, true);
      $total = (int) $wpdb->get_var(str_replace("SELECT * ", "SELECT COUNT(*) ", $paginatedCountQuery));

      return [
        'items' => $items,
        'page' => $requestParams['page'],
        'totalItems' => $total,
        'totalPages' => ceil($total / 20)
      ];
    }

    public function failure (string $message): array {
      return [
        'status' => false,
        'message' => $message
      ];
    }

    public function success (mixed $data = null): array {
      return [
        'status' => true,
        'data' => $data,
      ];
    }

    public function serve_zip ($served, $result) {
      $is_zip = false;
      $zip_data = null;

      foreach ($result->get_headers() as $header => $value) {
        if (strtolower($header) == 'content-type') {
          $is_zip = $value == 'application/zip';
          $zip_data = $result->get_data();
          break;
        }
      }

      if ($is_zip && is_string($zip_data)) {
        echo $zip_data;
        return true;
      }

      return $served;
    }
  }
}
