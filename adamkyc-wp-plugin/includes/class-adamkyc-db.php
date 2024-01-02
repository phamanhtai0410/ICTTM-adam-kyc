<?php

if (!class_exists('AdamkycDB')) {
  class AdamkycDB {
    public MongoDB\Client | null $connection = null;
    public MongoDB\Database | null $database = null;

    public function __construct () {
      $this->connect();
    }

    public function connect (): null | Exception {
      try {
        $username = get_option('adamkyc_mongo_username');
        $password = get_option('adamkyc_mongo_password');
        $hostname = get_option('adamkyc_mongo_hostname');
        $database = get_option('adamkyc_mongo_database');
        $url = "mongodb://$username:$password@$hostname:27017/$database";
        $this->connection = new MongoDB\Client($url);
        $this->database = $this->connection->{$database};
        $this->database->command(['ping' => 1]);

        return null;
      } catch (Exception $err) {
        return $err;
      }
    }

    public function connected (): bool {
      if (!$this->connection) {
        return false;
      }

      try {
        $this->database->command(['ping' => 1]);
        return true;
      } catch (Exception) {
        return false;
      }
    }

    public function disconnect (): void {
      $this->connection = null;
      $this->database = null;
    }
  }
}
