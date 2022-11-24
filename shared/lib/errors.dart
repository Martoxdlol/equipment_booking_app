abstract class AppException implements Exception {
  AppException([this.details]);
  final String? details;

  String get code;
  String get codeMessage;
  int? get status;

  String get message {
    if (details != null) {
      return "$codeMessage: $details";
    }

    return codeMessage;
  }

  Map<String, dynamic> toJson() {
    return {
      'code': code,
      'message': codeMessage,
      'status': status,
    };
  }

  @override
  String toString() => codeMessage;

  static from({String? code, int? status, String? codeMessage, String? details}) {
    final instances = [
      NetworkError(details),
      InternalError(details),
      AuthorizationError(details),
      AuthorizationError(details),
      BadRequestError(details),
    ];
    for (final instance in instances) {
      if (instance.code == code) return instance;
    }
    for (final instance in instances) {
      if (instance.status == status) return instance;
    }
    if (code != null || codeMessage != null || details != null) {
      return GenericError(codeMessage ?? details?.split(':')[0] ?? 'Generic error', code: code);
    }
    return UnknownError();
  }

  static fromJson(Map<String, dynamic> json) {
    try {
      final message = json['details'];

      String? codeMessage;
      String? details;

      if (message != null && message is String) {
        final arr = message.split(':');
        if (arr.length == 2) {
          codeMessage = arr[0];
          details = arr[1];
        } else {
          details = arr[0];
        }
      }

      return from(
        code: json['code'],
        details: details,
        codeMessage: codeMessage,
        status: json['status'],
      );
    } catch (e) {
      return UnknownError();
    }
  }
}

enum ErrorCode {
  // ignore: constant_identifier_names
  network_error,
  // ignore: constant_identifier_names
  internal_error,
  // ignore: constant_identifier_names
  authtentication_error,
  // ignore: constant_identifier_names
  authorization_error,
  // ignore: constant_identifier_names
  generic_error,
  // ignore: constant_identifier_names
  bad_request_error,
  // ignore: constant_identifier_names
  unknown_error,
}

class NetworkError extends AppException {
  NetworkError([super.details]);

  @override
  String get code => ErrorCode.network_error.toString();

  @override
  String get codeMessage => "Network error";

  @override
  int? get status => 0;
}

class InternalError extends AppException {
  InternalError([super.details]);

  @override
  String get code => ErrorCode.network_error.toString();

  @override
  String get codeMessage => "Internal error";

  @override
  int? get status => 500;
}

class AuthtenticationError extends AppException {
  AuthtenticationError([super.details]);

  @override
  String get code => ErrorCode.authtentication_error.toString();

  @override
  String get codeMessage => "Unauthorized";

  @override
  int? get status => 401;
}

class AuthorizationError extends AppException {
  AuthorizationError([super.details]);

  @override
  String get code => ErrorCode.authtentication_error.toString();

  @override
  String get codeMessage => "Forbidden";

  @override
  int? get status => 403;
}

class GenericError extends AppException {
  GenericError(this.codeMessage, {String? code, this.status = 400}) {
    this.code = code ?? ErrorCode.generic_error.toString();
  }

  @override
  // String get code => ErrorCode.generic_error.toString();
  late final String code;

  @override
  final String codeMessage;

  @override
  final int status;
}

class BadRequestError extends AppException {
  BadRequestError([super.details]);

  @override
  String get code => ErrorCode.bad_request_error.toString();

  @override
  String get codeMessage => "Bad request";

  @override
  int? get status => 400;
}

class UnknownError extends AppException {
  @override
  String get code => ErrorCode.unknown_error.toString();

  @override
  String get codeMessage => "Unknown error";

  @override
  int? get status => 400;
}
