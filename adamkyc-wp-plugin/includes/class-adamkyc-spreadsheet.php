<?php

use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\IReader;

if (!class_exists('AdamkycSpreadsheet')) {
  class AdamkycSpreadsheet {
    public static function read (string $filePath): Exception | array {
      try {
        $spreadsheet = IOFactory::load($filePath, IReader::IGNORE_EMPTY_CELLS, [
          IOFactory::READER_CSV,
          IOFactory::READER_XLS,
          IOFactory::READER_XLSX,
        ]);

        $worksheet = $spreadsheet->getActiveSheet();
        $highestRow = $worksheet->getHighestDataRow();
        $result = [];

        for ($row = 1; $row <= $highestRow; $row++) {
          $value = $worksheet->getCell([1, $row])->getValue();

          if ($value != null) {
            $result[] = $value;
          }
        }

        return $result;
      } catch (Exception $err) {
        return $err;
      }
    }

    public static function readUpload (string $filePath): Exception | array {
      try {
        $spreadsheet = IOFactory::load($filePath, IReader::IGNORE_EMPTY_CELLS, [
          IOFactory::READER_CSV,
          IOFactory::READER_XLS,
          IOFactory::READER_XLSX,
        ]);

        $worksheet = $spreadsheet->getActiveSheet();
        $highestColumn = $worksheet->getHighestDataColumn();
        $highestColumnIndex = Coordinate::columnIndexFromString($highestColumn);
        $highestRow = $worksheet->getHighestDataRow();
        $header = [];

        for ($col = 1; $col <= $highestColumnIndex; $col++) {
          $value = trim($worksheet->getCell([$col, 1])->getValue());

          if (empty($value)) {
            break;
          }

          $header[$col] = $value;
        }

        if (empty($header)) {
          throw new Exception('Failed to read spreadsheet');
        }

        $result = [];

        for ($row = 2; $row <= $highestRow; $row++) {
          $item = [];

          for ($col = 1; $col <= $highestColumnIndex; $col++) {
            $value = trim($worksheet->getCell([$col, $row])->getValue());

            if (empty($value)) {
              continue;
            }

            $item[$header[$col]] = $value;
          }

          $result[] = $item;
        }

        return $result;
      } catch (Exception $err) {
        return $err;
      }
    }
  }
}
