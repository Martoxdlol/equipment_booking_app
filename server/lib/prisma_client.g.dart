// GENERATED CODE - DO NOT MODIFY BY HAND

part of prisma.client;

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AggregateSignInIntent _$AggregateSignInIntentFromJson(
        Map<String, dynamic> json) =>
    AggregateSignInIntent(
      $count: json['_count'] == null
          ? null
          : SignInIntentCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : SignInIntentMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : SignInIntentMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$AggregateSignInIntentToJson(
        AggregateSignInIntent instance) =>
    <String, dynamic>{
      '_count': instance.$count?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

SignInIntentGroupByOutputType _$SignInIntentGroupByOutputTypeFromJson(
        Map<String, dynamic> json) =>
    SignInIntentGroupByOutputType(
      key: json['key'] as String,
      $count: json['_count'] == null
          ? null
          : SignInIntentCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : SignInIntentMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : SignInIntentMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$SignInIntentGroupByOutputTypeToJson(
        SignInIntentGroupByOutputType instance) =>
    <String, dynamic>{
      'key': instance.key,
      '_count': instance.$count?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

AggregateSession _$AggregateSessionFromJson(Map<String, dynamic> json) =>
    AggregateSession(
      $count: json['_count'] == null
          ? null
          : SessionCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : SessionMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : SessionMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$AggregateSessionToJson(AggregateSession instance) =>
    <String, dynamic>{
      '_count': instance.$count?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

SessionGroupByOutputType _$SessionGroupByOutputTypeFromJson(
        Map<String, dynamic> json) =>
    SessionGroupByOutputType(
      key: json['key'] as String,
      user_id: json['user_id'] as String,
      $count: json['_count'] == null
          ? null
          : SessionCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : SessionMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : SessionMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$SessionGroupByOutputTypeToJson(
        SessionGroupByOutputType instance) =>
    <String, dynamic>{
      'key': instance.key,
      'user_id': instance.user_id,
      '_count': instance.$count?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

AggregateUser _$AggregateUserFromJson(Map<String, dynamic> json) =>
    AggregateUser(
      $count: json['_count'] == null
          ? null
          : UserCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : UserMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : UserMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$AggregateUserToJson(AggregateUser instance) =>
    <String, dynamic>{
      '_count': instance.$count?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

UserGroupByOutputType _$UserGroupByOutputTypeFromJson(
        Map<String, dynamic> json) =>
    UserGroupByOutputType(
      id: json['id'] as String,
      email: json['email'] as String,
      name: json['name'] as String,
      $count: json['_count'] == null
          ? null
          : UserCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : UserMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : UserMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$UserGroupByOutputTypeToJson(
        UserGroupByOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'name': instance.name,
      '_count': instance.$count?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

AggregateEquipmentRequest _$AggregateEquipmentRequestFromJson(
        Map<String, dynamic> json) =>
    AggregateEquipmentRequest(
      $count: json['_count'] == null
          ? null
          : EquipmentRequestCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $avg: json['_avg'] == null
          ? null
          : EquipmentRequestAvgAggregateOutputType.fromJson(
              json['_avg'] as Map<String, dynamic>),
      $sum: json['_sum'] == null
          ? null
          : EquipmentRequestSumAggregateOutputType.fromJson(
              json['_sum'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : EquipmentRequestMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : EquipmentRequestMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$AggregateEquipmentRequestToJson(
        AggregateEquipmentRequest instance) =>
    <String, dynamic>{
      '_count': instance.$count?.toJson(),
      '_avg': instance.$avg?.toJson(),
      '_sum': instance.$sum?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

EquipmentRequestGroupByOutputType _$EquipmentRequestGroupByOutputTypeFromJson(
        Map<String, dynamic> json) =>
    EquipmentRequestGroupByOutputType(
      id: json['id'] as int,
      requester_id: json['requester_id'] as String,
      notes: json['notes'] as String,
      time_start: DateTime.parse(json['time_start'] as String),
      time_end: DateTime.parse(json['time_end'] as String),
      createdAt: DateTime.parse(json['createdAt'] as String),
      $count: json['_count'] == null
          ? null
          : EquipmentRequestCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $avg: json['_avg'] == null
          ? null
          : EquipmentRequestAvgAggregateOutputType.fromJson(
              json['_avg'] as Map<String, dynamic>),
      $sum: json['_sum'] == null
          ? null
          : EquipmentRequestSumAggregateOutputType.fromJson(
              json['_sum'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : EquipmentRequestMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : EquipmentRequestMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$EquipmentRequestGroupByOutputTypeToJson(
        EquipmentRequestGroupByOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'requester_id': instance.requester_id,
      'notes': instance.notes,
      'time_start': instance.time_start.toIso8601String(),
      'time_end': instance.time_end.toIso8601String(),
      'createdAt': instance.createdAt.toIso8601String(),
      '_count': instance.$count?.toJson(),
      '_avg': instance.$avg?.toJson(),
      '_sum': instance.$sum?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

AggregateRequestItem _$AggregateRequestItemFromJson(
        Map<String, dynamic> json) =>
    AggregateRequestItem(
      $count: json['_count'] == null
          ? null
          : RequestItemCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $avg: json['_avg'] == null
          ? null
          : RequestItemAvgAggregateOutputType.fromJson(
              json['_avg'] as Map<String, dynamic>),
      $sum: json['_sum'] == null
          ? null
          : RequestItemSumAggregateOutputType.fromJson(
              json['_sum'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : RequestItemMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : RequestItemMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$AggregateRequestItemToJson(
        AggregateRequestItem instance) =>
    <String, dynamic>{
      '_count': instance.$count?.toJson(),
      '_avg': instance.$avg?.toJson(),
      '_sum': instance.$sum?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

RequestItemGroupByOutputType _$RequestItemGroupByOutputTypeFromJson(
        Map<String, dynamic> json) =>
    RequestItemGroupByOutputType(
      id: json['id'] as int,
      request_id: json['request_id'] as int,
      quantity: json['quantity'] as int,
      asset_type_id: json['asset_type_id'] as String,
      $count: json['_count'] == null
          ? null
          : RequestItemCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $avg: json['_avg'] == null
          ? null
          : RequestItemAvgAggregateOutputType.fromJson(
              json['_avg'] as Map<String, dynamic>),
      $sum: json['_sum'] == null
          ? null
          : RequestItemSumAggregateOutputType.fromJson(
              json['_sum'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : RequestItemMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : RequestItemMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$RequestItemGroupByOutputTypeToJson(
        RequestItemGroupByOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'request_id': instance.request_id,
      'quantity': instance.quantity,
      'asset_type_id': instance.asset_type_id,
      '_count': instance.$count?.toJson(),
      '_avg': instance.$avg?.toJson(),
      '_sum': instance.$sum?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

AggregateAssetType _$AggregateAssetTypeFromJson(Map<String, dynamic> json) =>
    AggregateAssetType(
      $count: json['_count'] == null
          ? null
          : AssetTypeCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $avg: json['_avg'] == null
          ? null
          : AssetTypeAvgAggregateOutputType.fromJson(
              json['_avg'] as Map<String, dynamic>),
      $sum: json['_sum'] == null
          ? null
          : AssetTypeSumAggregateOutputType.fromJson(
              json['_sum'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : AssetTypeMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : AssetTypeMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$AggregateAssetTypeToJson(AggregateAssetType instance) =>
    <String, dynamic>{
      '_count': instance.$count?.toJson(),
      '_avg': instance.$avg?.toJson(),
      '_sum': instance.$sum?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

AssetTypeGroupByOutputType _$AssetTypeGroupByOutputTypeFromJson(
        Map<String, dynamic> json) =>
    AssetTypeGroupByOutputType(
      id: json['id'] as String,
      title: json['title'] as String,
      unique: json['unique'] as bool,
      quantity: json['quantity'] as int?,
      $count: json['_count'] == null
          ? null
          : AssetTypeCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $avg: json['_avg'] == null
          ? null
          : AssetTypeAvgAggregateOutputType.fromJson(
              json['_avg'] as Map<String, dynamic>),
      $sum: json['_sum'] == null
          ? null
          : AssetTypeSumAggregateOutputType.fromJson(
              json['_sum'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : AssetTypeMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : AssetTypeMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$AssetTypeGroupByOutputTypeToJson(
        AssetTypeGroupByOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'unique': instance.unique,
      'quantity': instance.quantity,
      '_count': instance.$count?.toJson(),
      '_avg': instance.$avg?.toJson(),
      '_sum': instance.$sum?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

AggregateAsset _$AggregateAssetFromJson(Map<String, dynamic> json) =>
    AggregateAsset(
      $count: json['_count'] == null
          ? null
          : AssetCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $avg: json['_avg'] == null
          ? null
          : AssetAvgAggregateOutputType.fromJson(
              json['_avg'] as Map<String, dynamic>),
      $sum: json['_sum'] == null
          ? null
          : AssetSumAggregateOutputType.fromJson(
              json['_sum'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : AssetMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : AssetMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$AggregateAssetToJson(AggregateAsset instance) =>
    <String, dynamic>{
      '_count': instance.$count?.toJson(),
      '_avg': instance.$avg?.toJson(),
      '_sum': instance.$sum?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

AssetGroupByOutputType _$AssetGroupByOutputTypeFromJson(
        Map<String, dynamic> json) =>
    AssetGroupByOutputType(
      id: json['id'] as String,
      type_id: json['type_id'] as String,
      deployed_to_id: json['deployed_to_id'] as int?,
      $count: json['_count'] == null
          ? null
          : AssetCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $avg: json['_avg'] == null
          ? null
          : AssetAvgAggregateOutputType.fromJson(
              json['_avg'] as Map<String, dynamic>),
      $sum: json['_sum'] == null
          ? null
          : AssetSumAggregateOutputType.fromJson(
              json['_sum'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : AssetMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : AssetMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$AssetGroupByOutputTypeToJson(
        AssetGroupByOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type_id': instance.type_id,
      'deployed_to_id': instance.deployed_to_id,
      '_count': instance.$count?.toJson(),
      '_avg': instance.$avg?.toJson(),
      '_sum': instance.$sum?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

AggregateFutureActionEvent _$AggregateFutureActionEventFromJson(
        Map<String, dynamic> json) =>
    AggregateFutureActionEvent(
      $count: json['_count'] == null
          ? null
          : FutureActionEventCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $avg: json['_avg'] == null
          ? null
          : FutureActionEventAvgAggregateOutputType.fromJson(
              json['_avg'] as Map<String, dynamic>),
      $sum: json['_sum'] == null
          ? null
          : FutureActionEventSumAggregateOutputType.fromJson(
              json['_sum'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : FutureActionEventMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : FutureActionEventMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$AggregateFutureActionEventToJson(
        AggregateFutureActionEvent instance) =>
    <String, dynamic>{
      '_count': instance.$count?.toJson(),
      '_avg': instance.$avg?.toJson(),
      '_sum': instance.$sum?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

FutureActionEventGroupByOutputType _$FutureActionEventGroupByOutputTypeFromJson(
        Map<String, dynamic> json) =>
    FutureActionEventGroupByOutputType(
      id: json['id'] as int,
      user_id: json['user_id'] as String,
      user_email: json['user_email'] as String,
      type: json['type'] as String,
      details: json['details'] as String?,
      created_at: DateTime.parse(json['created_at'] as String),
      completed_at: json['completed_at'] == null
          ? null
          : DateTime.parse(json['completed_at'] as String),
      $count: json['_count'] == null
          ? null
          : FutureActionEventCountAggregateOutputType.fromJson(
              json['_count'] as Map<String, dynamic>),
      $avg: json['_avg'] == null
          ? null
          : FutureActionEventAvgAggregateOutputType.fromJson(
              json['_avg'] as Map<String, dynamic>),
      $sum: json['_sum'] == null
          ? null
          : FutureActionEventSumAggregateOutputType.fromJson(
              json['_sum'] as Map<String, dynamic>),
      $min: json['_min'] == null
          ? null
          : FutureActionEventMinAggregateOutputType.fromJson(
              json['_min'] as Map<String, dynamic>),
      $max: json['_max'] == null
          ? null
          : FutureActionEventMaxAggregateOutputType.fromJson(
              json['_max'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$FutureActionEventGroupByOutputTypeToJson(
        FutureActionEventGroupByOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'user_id': instance.user_id,
      'user_email': instance.user_email,
      'type': instance.type,
      'details': instance.details,
      'created_at': instance.created_at.toIso8601String(),
      'completed_at': instance.completed_at?.toIso8601String(),
      '_count': instance.$count?.toJson(),
      '_avg': instance.$avg?.toJson(),
      '_sum': instance.$sum?.toJson(),
      '_min': instance.$min?.toJson(),
      '_max': instance.$max?.toJson(),
    };

AffectedRowsOutput _$AffectedRowsOutputFromJson(Map<String, dynamic> json) =>
    AffectedRowsOutput(
      count: json['count'] as int,
    );

Map<String, dynamic> _$AffectedRowsOutputToJson(AffectedRowsOutput instance) =>
    <String, dynamic>{
      'count': instance.count,
    };

SignInIntentCountAggregateOutputType
    _$SignInIntentCountAggregateOutputTypeFromJson(Map<String, dynamic> json) =>
        SignInIntentCountAggregateOutputType(
          key: json['key'] as int,
          $all: json['_all'] as int,
        );

Map<String, dynamic> _$SignInIntentCountAggregateOutputTypeToJson(
        SignInIntentCountAggregateOutputType instance) =>
    <String, dynamic>{
      'key': instance.key,
      '_all': instance.$all,
    };

SignInIntentMinAggregateOutputType _$SignInIntentMinAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    SignInIntentMinAggregateOutputType(
      key: json['key'] as String?,
    );

Map<String, dynamic> _$SignInIntentMinAggregateOutputTypeToJson(
        SignInIntentMinAggregateOutputType instance) =>
    <String, dynamic>{
      'key': instance.key,
    };

SignInIntentMaxAggregateOutputType _$SignInIntentMaxAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    SignInIntentMaxAggregateOutputType(
      key: json['key'] as String?,
    );

Map<String, dynamic> _$SignInIntentMaxAggregateOutputTypeToJson(
        SignInIntentMaxAggregateOutputType instance) =>
    <String, dynamic>{
      'key': instance.key,
    };

SessionCountAggregateOutputType _$SessionCountAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    SessionCountAggregateOutputType(
      key: json['key'] as int,
      user_id: json['user_id'] as int,
      $all: json['_all'] as int,
    );

Map<String, dynamic> _$SessionCountAggregateOutputTypeToJson(
        SessionCountAggregateOutputType instance) =>
    <String, dynamic>{
      'key': instance.key,
      'user_id': instance.user_id,
      '_all': instance.$all,
    };

SessionMinAggregateOutputType _$SessionMinAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    SessionMinAggregateOutputType(
      key: json['key'] as String?,
      user_id: json['user_id'] as String?,
    );

Map<String, dynamic> _$SessionMinAggregateOutputTypeToJson(
        SessionMinAggregateOutputType instance) =>
    <String, dynamic>{
      'key': instance.key,
      'user_id': instance.user_id,
    };

SessionMaxAggregateOutputType _$SessionMaxAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    SessionMaxAggregateOutputType(
      key: json['key'] as String?,
      user_id: json['user_id'] as String?,
    );

Map<String, dynamic> _$SessionMaxAggregateOutputTypeToJson(
        SessionMaxAggregateOutputType instance) =>
    <String, dynamic>{
      'key': instance.key,
      'user_id': instance.user_id,
    };

UserCountOutputType _$UserCountOutputTypeFromJson(Map<String, dynamic> json) =>
    UserCountOutputType(
      requests: json['requests'] as int,
      sessions: json['sessions'] as int,
    );

Map<String, dynamic> _$UserCountOutputTypeToJson(
        UserCountOutputType instance) =>
    <String, dynamic>{
      'requests': instance.requests,
      'sessions': instance.sessions,
    };

UserCountAggregateOutputType _$UserCountAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    UserCountAggregateOutputType(
      id: json['id'] as int,
      email: json['email'] as int,
      name: json['name'] as int,
      $all: json['_all'] as int,
    );

Map<String, dynamic> _$UserCountAggregateOutputTypeToJson(
        UserCountAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'name': instance.name,
      '_all': instance.$all,
    };

UserMinAggregateOutputType _$UserMinAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    UserMinAggregateOutputType(
      id: json['id'] as String?,
      email: json['email'] as String?,
      name: json['name'] as String?,
    );

Map<String, dynamic> _$UserMinAggregateOutputTypeToJson(
        UserMinAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'name': instance.name,
    };

UserMaxAggregateOutputType _$UserMaxAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    UserMaxAggregateOutputType(
      id: json['id'] as String?,
      email: json['email'] as String?,
      name: json['name'] as String?,
    );

Map<String, dynamic> _$UserMaxAggregateOutputTypeToJson(
        UserMaxAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'name': instance.name,
    };

EquipmentRequestCountOutputType _$EquipmentRequestCountOutputTypeFromJson(
        Map<String, dynamic> json) =>
    EquipmentRequestCountOutputType(
      items: json['items'] as int,
      asset: json['asset'] as int,
    );

Map<String, dynamic> _$EquipmentRequestCountOutputTypeToJson(
        EquipmentRequestCountOutputType instance) =>
    <String, dynamic>{
      'items': instance.items,
      'asset': instance.asset,
    };

EquipmentRequestCountAggregateOutputType
    _$EquipmentRequestCountAggregateOutputTypeFromJson(
            Map<String, dynamic> json) =>
        EquipmentRequestCountAggregateOutputType(
          id: json['id'] as int,
          requester_id: json['requester_id'] as int,
          notes: json['notes'] as int,
          time_start: json['time_start'] as int,
          time_end: json['time_end'] as int,
          createdAt: json['createdAt'] as int,
          $all: json['_all'] as int,
        );

Map<String, dynamic> _$EquipmentRequestCountAggregateOutputTypeToJson(
        EquipmentRequestCountAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'requester_id': instance.requester_id,
      'notes': instance.notes,
      'time_start': instance.time_start,
      'time_end': instance.time_end,
      'createdAt': instance.createdAt,
      '_all': instance.$all,
    };

EquipmentRequestAvgAggregateOutputType
    _$EquipmentRequestAvgAggregateOutputTypeFromJson(
            Map<String, dynamic> json) =>
        EquipmentRequestAvgAggregateOutputType(
          id: (json['id'] as num?)?.toDouble(),
        );

Map<String, dynamic> _$EquipmentRequestAvgAggregateOutputTypeToJson(
        EquipmentRequestAvgAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
    };

EquipmentRequestSumAggregateOutputType
    _$EquipmentRequestSumAggregateOutputTypeFromJson(
            Map<String, dynamic> json) =>
        EquipmentRequestSumAggregateOutputType(
          id: json['id'] as int?,
        );

Map<String, dynamic> _$EquipmentRequestSumAggregateOutputTypeToJson(
        EquipmentRequestSumAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
    };

EquipmentRequestMinAggregateOutputType
    _$EquipmentRequestMinAggregateOutputTypeFromJson(
            Map<String, dynamic> json) =>
        EquipmentRequestMinAggregateOutputType(
          id: json['id'] as int?,
          requester_id: json['requester_id'] as String?,
          notes: json['notes'] as String?,
          time_start: json['time_start'] == null
              ? null
              : DateTime.parse(json['time_start'] as String),
          time_end: json['time_end'] == null
              ? null
              : DateTime.parse(json['time_end'] as String),
          createdAt: json['createdAt'] == null
              ? null
              : DateTime.parse(json['createdAt'] as String),
        );

Map<String, dynamic> _$EquipmentRequestMinAggregateOutputTypeToJson(
        EquipmentRequestMinAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'requester_id': instance.requester_id,
      'notes': instance.notes,
      'time_start': instance.time_start?.toIso8601String(),
      'time_end': instance.time_end?.toIso8601String(),
      'createdAt': instance.createdAt?.toIso8601String(),
    };

EquipmentRequestMaxAggregateOutputType
    _$EquipmentRequestMaxAggregateOutputTypeFromJson(
            Map<String, dynamic> json) =>
        EquipmentRequestMaxAggregateOutputType(
          id: json['id'] as int?,
          requester_id: json['requester_id'] as String?,
          notes: json['notes'] as String?,
          time_start: json['time_start'] == null
              ? null
              : DateTime.parse(json['time_start'] as String),
          time_end: json['time_end'] == null
              ? null
              : DateTime.parse(json['time_end'] as String),
          createdAt: json['createdAt'] == null
              ? null
              : DateTime.parse(json['createdAt'] as String),
        );

Map<String, dynamic> _$EquipmentRequestMaxAggregateOutputTypeToJson(
        EquipmentRequestMaxAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'requester_id': instance.requester_id,
      'notes': instance.notes,
      'time_start': instance.time_start?.toIso8601String(),
      'time_end': instance.time_end?.toIso8601String(),
      'createdAt': instance.createdAt?.toIso8601String(),
    };

RequestItemCountAggregateOutputType
    _$RequestItemCountAggregateOutputTypeFromJson(Map<String, dynamic> json) =>
        RequestItemCountAggregateOutputType(
          id: json['id'] as int,
          request_id: json['request_id'] as int,
          quantity: json['quantity'] as int,
          asset_type_id: json['asset_type_id'] as int,
          $all: json['_all'] as int,
        );

Map<String, dynamic> _$RequestItemCountAggregateOutputTypeToJson(
        RequestItemCountAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'request_id': instance.request_id,
      'quantity': instance.quantity,
      'asset_type_id': instance.asset_type_id,
      '_all': instance.$all,
    };

RequestItemAvgAggregateOutputType _$RequestItemAvgAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    RequestItemAvgAggregateOutputType(
      id: (json['id'] as num?)?.toDouble(),
      request_id: (json['request_id'] as num?)?.toDouble(),
      quantity: (json['quantity'] as num?)?.toDouble(),
    );

Map<String, dynamic> _$RequestItemAvgAggregateOutputTypeToJson(
        RequestItemAvgAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'request_id': instance.request_id,
      'quantity': instance.quantity,
    };

RequestItemSumAggregateOutputType _$RequestItemSumAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    RequestItemSumAggregateOutputType(
      id: json['id'] as int?,
      request_id: json['request_id'] as int?,
      quantity: json['quantity'] as int?,
    );

Map<String, dynamic> _$RequestItemSumAggregateOutputTypeToJson(
        RequestItemSumAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'request_id': instance.request_id,
      'quantity': instance.quantity,
    };

RequestItemMinAggregateOutputType _$RequestItemMinAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    RequestItemMinAggregateOutputType(
      id: json['id'] as int?,
      request_id: json['request_id'] as int?,
      quantity: json['quantity'] as int?,
      asset_type_id: json['asset_type_id'] as String?,
    );

Map<String, dynamic> _$RequestItemMinAggregateOutputTypeToJson(
        RequestItemMinAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'request_id': instance.request_id,
      'quantity': instance.quantity,
      'asset_type_id': instance.asset_type_id,
    };

RequestItemMaxAggregateOutputType _$RequestItemMaxAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    RequestItemMaxAggregateOutputType(
      id: json['id'] as int?,
      request_id: json['request_id'] as int?,
      quantity: json['quantity'] as int?,
      asset_type_id: json['asset_type_id'] as String?,
    );

Map<String, dynamic> _$RequestItemMaxAggregateOutputTypeToJson(
        RequestItemMaxAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'request_id': instance.request_id,
      'quantity': instance.quantity,
      'asset_type_id': instance.asset_type_id,
    };

AssetTypeCountOutputType _$AssetTypeCountOutputTypeFromJson(
        Map<String, dynamic> json) =>
    AssetTypeCountOutputType(
      assets: json['assets'] as int,
      RequestItem: json['RequestItem'] as int,
    );

Map<String, dynamic> _$AssetTypeCountOutputTypeToJson(
        AssetTypeCountOutputType instance) =>
    <String, dynamic>{
      'assets': instance.assets,
      'RequestItem': instance.RequestItem,
    };

AssetTypeCountAggregateOutputType _$AssetTypeCountAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    AssetTypeCountAggregateOutputType(
      id: json['id'] as int,
      title: json['title'] as int,
      unique: json['unique'] as int,
      quantity: json['quantity'] as int,
      $all: json['_all'] as int,
    );

Map<String, dynamic> _$AssetTypeCountAggregateOutputTypeToJson(
        AssetTypeCountAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'unique': instance.unique,
      'quantity': instance.quantity,
      '_all': instance.$all,
    };

AssetTypeAvgAggregateOutputType _$AssetTypeAvgAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    AssetTypeAvgAggregateOutputType(
      quantity: (json['quantity'] as num?)?.toDouble(),
    );

Map<String, dynamic> _$AssetTypeAvgAggregateOutputTypeToJson(
        AssetTypeAvgAggregateOutputType instance) =>
    <String, dynamic>{
      'quantity': instance.quantity,
    };

AssetTypeSumAggregateOutputType _$AssetTypeSumAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    AssetTypeSumAggregateOutputType(
      quantity: json['quantity'] as int?,
    );

Map<String, dynamic> _$AssetTypeSumAggregateOutputTypeToJson(
        AssetTypeSumAggregateOutputType instance) =>
    <String, dynamic>{
      'quantity': instance.quantity,
    };

AssetTypeMinAggregateOutputType _$AssetTypeMinAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    AssetTypeMinAggregateOutputType(
      id: json['id'] as String?,
      title: json['title'] as String?,
      unique: json['unique'] as bool?,
      quantity: json['quantity'] as int?,
    );

Map<String, dynamic> _$AssetTypeMinAggregateOutputTypeToJson(
        AssetTypeMinAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'unique': instance.unique,
      'quantity': instance.quantity,
    };

AssetTypeMaxAggregateOutputType _$AssetTypeMaxAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    AssetTypeMaxAggregateOutputType(
      id: json['id'] as String?,
      title: json['title'] as String?,
      unique: json['unique'] as bool?,
      quantity: json['quantity'] as int?,
    );

Map<String, dynamic> _$AssetTypeMaxAggregateOutputTypeToJson(
        AssetTypeMaxAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'unique': instance.unique,
      'quantity': instance.quantity,
    };

AssetCountAggregateOutputType _$AssetCountAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    AssetCountAggregateOutputType(
      id: json['id'] as int,
      type_id: json['type_id'] as int,
      deployed_to_id: json['deployed_to_id'] as int,
      $all: json['_all'] as int,
    );

Map<String, dynamic> _$AssetCountAggregateOutputTypeToJson(
        AssetCountAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type_id': instance.type_id,
      'deployed_to_id': instance.deployed_to_id,
      '_all': instance.$all,
    };

AssetAvgAggregateOutputType _$AssetAvgAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    AssetAvgAggregateOutputType(
      deployed_to_id: (json['deployed_to_id'] as num?)?.toDouble(),
    );

Map<String, dynamic> _$AssetAvgAggregateOutputTypeToJson(
        AssetAvgAggregateOutputType instance) =>
    <String, dynamic>{
      'deployed_to_id': instance.deployed_to_id,
    };

AssetSumAggregateOutputType _$AssetSumAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    AssetSumAggregateOutputType(
      deployed_to_id: json['deployed_to_id'] as int?,
    );

Map<String, dynamic> _$AssetSumAggregateOutputTypeToJson(
        AssetSumAggregateOutputType instance) =>
    <String, dynamic>{
      'deployed_to_id': instance.deployed_to_id,
    };

AssetMinAggregateOutputType _$AssetMinAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    AssetMinAggregateOutputType(
      id: json['id'] as String?,
      type_id: json['type_id'] as String?,
      deployed_to_id: json['deployed_to_id'] as int?,
    );

Map<String, dynamic> _$AssetMinAggregateOutputTypeToJson(
        AssetMinAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type_id': instance.type_id,
      'deployed_to_id': instance.deployed_to_id,
    };

AssetMaxAggregateOutputType _$AssetMaxAggregateOutputTypeFromJson(
        Map<String, dynamic> json) =>
    AssetMaxAggregateOutputType(
      id: json['id'] as String?,
      type_id: json['type_id'] as String?,
      deployed_to_id: json['deployed_to_id'] as int?,
    );

Map<String, dynamic> _$AssetMaxAggregateOutputTypeToJson(
        AssetMaxAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type_id': instance.type_id,
      'deployed_to_id': instance.deployed_to_id,
    };

FutureActionEventCountAggregateOutputType
    _$FutureActionEventCountAggregateOutputTypeFromJson(
            Map<String, dynamic> json) =>
        FutureActionEventCountAggregateOutputType(
          id: json['id'] as int,
          user_id: json['user_id'] as int,
          user_email: json['user_email'] as int,
          type: json['type'] as int,
          details: json['details'] as int,
          created_at: json['created_at'] as int,
          completed_at: json['completed_at'] as int,
          $all: json['_all'] as int,
        );

Map<String, dynamic> _$FutureActionEventCountAggregateOutputTypeToJson(
        FutureActionEventCountAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'user_id': instance.user_id,
      'user_email': instance.user_email,
      'type': instance.type,
      'details': instance.details,
      'created_at': instance.created_at,
      'completed_at': instance.completed_at,
      '_all': instance.$all,
    };

FutureActionEventAvgAggregateOutputType
    _$FutureActionEventAvgAggregateOutputTypeFromJson(
            Map<String, dynamic> json) =>
        FutureActionEventAvgAggregateOutputType(
          id: (json['id'] as num?)?.toDouble(),
        );

Map<String, dynamic> _$FutureActionEventAvgAggregateOutputTypeToJson(
        FutureActionEventAvgAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
    };

FutureActionEventSumAggregateOutputType
    _$FutureActionEventSumAggregateOutputTypeFromJson(
            Map<String, dynamic> json) =>
        FutureActionEventSumAggregateOutputType(
          id: json['id'] as int?,
        );

Map<String, dynamic> _$FutureActionEventSumAggregateOutputTypeToJson(
        FutureActionEventSumAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
    };

FutureActionEventMinAggregateOutputType
    _$FutureActionEventMinAggregateOutputTypeFromJson(
            Map<String, dynamic> json) =>
        FutureActionEventMinAggregateOutputType(
          id: json['id'] as int?,
          user_id: json['user_id'] as String?,
          user_email: json['user_email'] as String?,
          type: json['type'] as String?,
          details: json['details'] as String?,
          created_at: json['created_at'] == null
              ? null
              : DateTime.parse(json['created_at'] as String),
          completed_at: json['completed_at'] == null
              ? null
              : DateTime.parse(json['completed_at'] as String),
        );

Map<String, dynamic> _$FutureActionEventMinAggregateOutputTypeToJson(
        FutureActionEventMinAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'user_id': instance.user_id,
      'user_email': instance.user_email,
      'type': instance.type,
      'details': instance.details,
      'created_at': instance.created_at?.toIso8601String(),
      'completed_at': instance.completed_at?.toIso8601String(),
    };

FutureActionEventMaxAggregateOutputType
    _$FutureActionEventMaxAggregateOutputTypeFromJson(
            Map<String, dynamic> json) =>
        FutureActionEventMaxAggregateOutputType(
          id: json['id'] as int?,
          user_id: json['user_id'] as String?,
          user_email: json['user_email'] as String?,
          type: json['type'] as String?,
          details: json['details'] as String?,
          created_at: json['created_at'] == null
              ? null
              : DateTime.parse(json['created_at'] as String),
          completed_at: json['completed_at'] == null
              ? null
              : DateTime.parse(json['completed_at'] as String),
        );

Map<String, dynamic> _$FutureActionEventMaxAggregateOutputTypeToJson(
        FutureActionEventMaxAggregateOutputType instance) =>
    <String, dynamic>{
      'id': instance.id,
      'user_id': instance.user_id,
      'user_email': instance.user_email,
      'type': instance.type,
      'details': instance.details,
      'created_at': instance.created_at?.toIso8601String(),
      'completed_at': instance.completed_at?.toIso8601String(),
    };

SignInIntent _$SignInIntentFromJson(Map<String, dynamic> json) => SignInIntent(
      key: json['key'] as String,
    );

Map<String, dynamic> _$SignInIntentToJson(SignInIntent instance) =>
    <String, dynamic>{
      'key': instance.key,
    };

Session _$SessionFromJson(Map<String, dynamic> json) => Session(
      key: json['key'] as String,
      user_id: json['user_id'] as String,
    );

Map<String, dynamic> _$SessionToJson(Session instance) => <String, dynamic>{
      'key': instance.key,
      'user_id': instance.user_id,
    };

User _$UserFromJson(Map<String, dynamic> json) => User(
      id: json['id'] as String,
      email: json['email'] as String,
      name: json['name'] as String,
    );

Map<String, dynamic> _$UserToJson(User instance) => <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'name': instance.name,
    };

EquipmentRequest _$EquipmentRequestFromJson(Map<String, dynamic> json) =>
    EquipmentRequest(
      id: json['id'] as int,
      requester_id: json['requester_id'] as String,
      notes: json['notes'] as String,
      time_start: DateTime.parse(json['time_start'] as String),
      time_end: DateTime.parse(json['time_end'] as String),
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$EquipmentRequestToJson(EquipmentRequest instance) =>
    <String, dynamic>{
      'id': instance.id,
      'requester_id': instance.requester_id,
      'notes': instance.notes,
      'time_start': instance.time_start.toIso8601String(),
      'time_end': instance.time_end.toIso8601String(),
      'createdAt': instance.createdAt.toIso8601String(),
    };

RequestItem _$RequestItemFromJson(Map<String, dynamic> json) => RequestItem(
      id: json['id'] as int,
      request_id: json['request_id'] as int,
      quantity: json['quantity'] as int,
      asset_type_id: json['asset_type_id'] as String,
    );

Map<String, dynamic> _$RequestItemToJson(RequestItem instance) =>
    <String, dynamic>{
      'id': instance.id,
      'request_id': instance.request_id,
      'quantity': instance.quantity,
      'asset_type_id': instance.asset_type_id,
    };

AssetType _$AssetTypeFromJson(Map<String, dynamic> json) => AssetType(
      id: json['id'] as String,
      title: json['title'] as String,
      unique: json['unique'] as bool,
      quantity: json['quantity'] as int?,
    );

Map<String, dynamic> _$AssetTypeToJson(AssetType instance) => <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'unique': instance.unique,
      'quantity': instance.quantity,
    };

Asset _$AssetFromJson(Map<String, dynamic> json) => Asset(
      id: json['id'] as String,
      type_id: json['type_id'] as String,
      deployed_to_id: json['deployed_to_id'] as int?,
    );

Map<String, dynamic> _$AssetToJson(Asset instance) => <String, dynamic>{
      'id': instance.id,
      'type_id': instance.type_id,
      'deployed_to_id': instance.deployed_to_id,
    };

FutureActionEvent _$FutureActionEventFromJson(Map<String, dynamic> json) =>
    FutureActionEvent(
      id: json['id'] as int,
      user_id: json['user_id'] as String,
      user_email: json['user_email'] as String,
      type: json['type'] as String,
      details: json['details'] as String?,
      created_at: DateTime.parse(json['created_at'] as String),
      completed_at: json['completed_at'] == null
          ? null
          : DateTime.parse(json['completed_at'] as String),
    );

Map<String, dynamic> _$FutureActionEventToJson(FutureActionEvent instance) =>
    <String, dynamic>{
      'id': instance.id,
      'user_id': instance.user_id,
      'user_email': instance.user_email,
      'type': instance.type,
      'details': instance.details,
      'created_at': instance.created_at.toIso8601String(),
      'completed_at': instance.completed_at?.toIso8601String(),
    };
