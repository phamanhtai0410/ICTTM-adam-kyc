<?php

if (!class_exists('AdamkycConstants')) {
  class AdamkycConstants {
    public static function search_properties () {
      $columns = [
        'address',
        'addressEntity',
        'agent',
        'alias',
        'amount',
        'amountUsd',
        'asset',
        'associate',
        'authority',
        'authorityId',
        'balance',
        'bikCode',
        'birthCountry',
        'birthDate',
        'birthPlace',
        'buildDate',
        'callSign',
        'city',
        'classification',
        'client',
        'country',
        'createdAt',
        'currency',
        'date',
        'deathDate',
        'description',
        'director',
        'dissolutionDate',
        'dunsCode',
        'duration',
        'education',
        'email',
        'employee',
        'employer',
        'endDate',
        'entity',
        'ethnicity',
        'fatherName',
        'firstName',
        'flag',
        'full',
        'gender',
        'grossRegisteredTonnage',
        'holder',
        'iban',
        'icijId',
        'idNumber',
        'imoNumber',
        'incorporationDate',
        'innCode',
        'isin',
        'issueDate',
        'issuer',
        'jurisdiction',
        'keywords',
        'kppCode',
        'lastName',
        'legalForm',
        'leiCode',
        'listingDate',
        'mainCountry',
        'maturityDate',
        'member',
        'middleName',
        'mmsi',
        'model',
        'modifiedAt',
        'motherName',
        'name',
        'nameSuffix',
        'namesMentioned',
        'nationality',
        'notes',
        'number',
        'object',
        'ogrnCode',
        'okpoCode',
        'opencorporatesUrl',
        'organization',
        'owner',
        'passportNumber',
        'pastFlags',
        'percentage',
        'person',
        'phone',
        'political',
        'position',
        'post',
        'postOfficeBox',
        'postalCode',
        'previousName',
        'program',
        'proof',
        'provisions',
        'publicKey',
        'publisher',
        'reason',
        'recordId',
        'region',
        'registrationNumber',
        'relationship',
        'relative',
        'religion',
        'remarks',
        'role',
        'secondName',
        'sector',
        'serialNumber',
        'sharesCount',
        'sharesCurrency',
        'sharesValue',
        'sourceUrl',
        'startDate',
        'state',
        'status',
        'street',
        'subject',
        'summary',
        'swiftBic',
        'taxNumber',
        'ticker',
        'title',
        'tonnage',
        'topics',
        'type',
        'unscId',
        'vatCode',
        'weakAlias',
        'website',
        'wikidataId',
      ];

      $result = [];

      foreach ($columns as $column) {
        $result['properties.' . $column] = [
          'type' => 'string',
          'validate_callback' => 'rest_validate_request_arg',
        ];
      }

      return $result;
    }

    public string $charset_collate;
    public string $table_bookmarks;
    public string $table_bulk_upload;
    public string $table_entities;
    public string $table_history;
    public string $table_report_changelog;
    public string $table_report_notes;
    public string $table_reports;
    public string $table_uploads;
    public string $table_views;

    public function __construct () {
      global $wpdb;

      $this->charset_collate = $wpdb->get_charset_collate();
      $this->table_bookmarks = $wpdb->prefix . 'adamkyc_bookmarks';
      $this->table_bulk_upload = $wpdb->prefix . 'adamkyc_bulk_upload';
      $this->table_entities = $wpdb->prefix . 'adamkyc_entities';
      $this->table_history = $wpdb->prefix . 'adamkyc_history';
      $this->table_reports = $wpdb->prefix . 'adamkyc_reports';
      $this->table_report_changelog = $wpdb->prefix . 'adamkyc_report_changelog';
      $this->table_report_notes = $wpdb->prefix . 'adamkyc_report_notes';
      $this->table_uploads = $wpdb->prefix . 'adamkyc_uploads';
      $this->table_views = $wpdb->prefix . 'adamkyc_views';
    }
  }
}
