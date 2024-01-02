<?php

if (!class_exists('AdamkycTransformers')) {
  class AdamkycTransformers {
    public static function bulk_upload (mixed $data): array {
      return [
        'id' => intval($data->id),
        'entity_id' => $data->entity_id,
        'search' => $data->search,
        'type' => $data->type,
        'created_at' => $data->created_at,
      ];
    }

    public static function entity (mixed $data): array {
      return [
        'id' => intval($data->id),
        'user_id' => intval($data->user_id),
        'state' => $data->state,
        'status' => $data->status,
        'data' => json_decode($data->data),
        'views' => intval($data->views),
        'created_at' => $data->created_at,
        'updated_at' => $data->updated_at,
      ];
    }

    public static function history (mixed $data): array {
      return [
        'search' => $data->search,
        'type' => $data->type,
        'count' => $data->count,
        'created_at' => $data->created_at,
      ];
    }

    public static function report (mixed $data): array {
      return [
        'id' => intval($data->id),
        'entity_id' => $data->entity_id,
        'first_name' => $data->first_name,
        'last_name' => $data->last_name,
        'email' => $data->email,
        'phone' => $data->phone,
        'entity_name' => $data->entity_name,
        'entity_type' => $data->entity_type,
        'details' => $data->details,
        'relationship' => $data->relationship,
        'created_at' => $data->created_at,
        'state' => $data->deleted_at == null ? null : 'DELETED',
        'status' => $data->status,
      ];
    }

    public static function report_changelog (mixed $data): array {
      return [
        'id' => intval($data->id),
        'user_id' => intval($data->user_id),
        'report_id' => intval($data->report_id),
        'message' => $data->message,
        'created_at' => $data->created_at,
        'updated_at' => $data->updated_at,
      ];
    }

    public static function report_note (mixed $data): array {
      return [
        'id' => intval($data->id),
        'user_id' => intval($data->user_id),
        'report_id' => intval($data->report_id),
        'subject' => $data->subject,
        'note' => $data->note,
        'created_at' => $data->created_at,
        'updated_at' => $data->updated_at,
      ];
    }

    public static function upload (mixed $data): array {
      return [
        'id' => intval($data->id),
        'user_id' => intval($data->user_id),
        'count_rows' => intval($data->count_rows),
        'type' => $data->type,
        'status' => $data->status,
        'created_at' => $data->created_at,
        'updated_at' => $data->updated_at,
      ];
    }

    public static function user (mixed $data): array {
      return [
        'id' => intval($data->ID),
        'email' => $data->user_email,
        'name' => $data->display_name,
        'avatar' => get_avatar_url($data->ID, ['size' => 32]),
      ];
    }
  }
}
