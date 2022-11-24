import 'dart:async';
import 'dart:convert';

import 'package:server/db.dart';
import 'package:server/prisma_client.dart';
import 'package:shelf_plus/shelf_plus.dart';
import 'package:shared/errors.dart';

FutureOr<Response> Function(Request request) handlerWrapper(FutureOr<Response> Function(Request request) handler) {
  return (request) async {
    try {
      return await handler(request);
    } on AppException catch (e) {
      return jsonResponse(e.toJson());
    } catch (e) {
      print(e);
      return jsonResponse({'error': e.toString()}, status: 400);
    }
  };
}

FutureOr<Response> Function(Request request) handlerWrapperAuthtenticated(
    FutureOr<Response> Function(Request request, Session session) handler) {
  return handlerWrapper((request) async {
    final key = request.url.queryParameters['key'];

    if (key == null) {
      throw AuthtenticationError("missing auth key");
    }

    final session = await prisma.session.findUnique(where: SessionWhereUniqueInput(key: key));

    if (session == null) {
      throw AuthtenticationError("session not found");
    }

    return await handler(request, session);
  });
}

Response jsonResponse(Object data, {int? status}) {
  return Response(status ?? 200, body: jsonEncode(data), headers: {
    'Content-Type': 'application/json',
  });
}
