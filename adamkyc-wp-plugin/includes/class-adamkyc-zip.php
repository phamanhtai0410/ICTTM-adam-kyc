<?php

if (!class_exists('AdamkycZip')) {
  class AdamkycZip {
    public static function create (array $data): string {
      $file = tempnam('/tmp', 'adamkyc-');
      $zip = new ZipArchive();

      if (count($data) == 0) {
        file_put_contents($file, base64_decode('UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA=='));
        register_shutdown_function('unlink', $file);
        return $file;
      }

      if (!$zip->open($file, ZipArchive::OVERWRITE)) {
        register_shutdown_function('unlink', $file);
        throw new Exception('Failed to create Zip archive');
      }

      foreach ($data as $name => $content) {
        $zip->addFromString($name, json_encode($content));
      }

      if (!$zip->close()) {
        throw new Exception('Failed to create Zip archive');
      }

      register_shutdown_function('unlink', $file);
      return $file;
    }
  }
}
