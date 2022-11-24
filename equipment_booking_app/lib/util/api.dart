import 'dart:convert';

import 'package:equipment_booking_app/auth/auth.dart';
import 'package:http/http.dart' as http;
import 'package:shared/settings.dart';
import 'package:shared/errors.dart';

Future<dynamic> apiFetcher(String url, Map<String, String?>? query, Future<http.Response> Function(Uri uri) fetcher) async {
  final key = Auth.instance.session?.key;

  final parsedUri = Uri.parse(url);
  final serverUri = Settings.instance.serverUri;

  final host = parsedUri.host == "" ? serverUri.host : parsedUri.host;
  final scheme = parsedUri.scheme == "" ? serverUri.scheme : parsedUri.scheme;
  int? port = parsedUri.port == 0 ? serverUri.port : parsedUri.port;
  if (port == 0) port = null;
  final userInfo = parsedUri.userInfo == "" ? serverUri.userInfo : parsedUri.userInfo;
  final path = serverUri.path + parsedUri.path;

  final queryParams = <String, String?>{...serverUri.queryParameters, 'key': key, ...(query ?? {})};

  final uri = Uri(
    host: host,
    path: path,
    port: port,
    queryParameters: queryParams,
    scheme: scheme,
    userInfo: userInfo,
  );

  try {
    final response = await fetcher(uri);
    final decoded = JsonSafeDecode(response.body);
    if (response.statusCode >= 400) {
      throw AppException.fromJson(decoded.decoded);
    }
    if (!decoded.ok) {
      throw BadRequestError('failed to decode request body');
    }
    return decoded.decoded;
  } on AppException {
    rethrow;
  } catch (e) {
    throw NetworkError(e.toString());
  }
}

Future<dynamic> apiFetchGet(String url, [Map<String, String?>? query]) {
  return apiFetcher(url, query, (uri) {
    return http.get(uri);
  });
}

Future<dynamic> apiFetchPost(String url, dynamic body, [Map<String, String?>? query]) {
  return apiFetcher(url, query, (uri) {
    return http.post(uri, body: jsonEncode(body));
  });
}

class JsonSafeDecode {
  JsonSafeDecode(String? data) {
    try {
      decoded = jsonDecode(data ?? 'null');
      ok = true;
    } catch (e) {
      decoded = null;
      ok = false;
    }
  }
  late final bool ok;
  late final dynamic decoded;
}
