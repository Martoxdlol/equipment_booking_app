import 'dart:async';
import 'dart:io';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

import 'package:equipment_booking_app/auth/auth.dart';
import 'package:shared/models.dart';
import 'package:shared/settings.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;

class AuthFlowMobile extends AuthFlow {
  AuthFlowMobile(super.context);

  ChromeSafariBrowser? browser;

  Completer<Session?> task = Completer<Session?>();

  Exception? error;

  int _current = 0;

  @override
  Future<Session?> authtenticate(String username) async {
    _current++;
    task.complete(null);
    task = Completer<Session?>();
    int current = _current;
    await startAuthServer();
    browser = MyChromeSafariBrowser(this);
    browser!
        .open(url: Uri.parse('http://localhost:${Settings.instance.localAuthPort.value}/login?login_hint=$username&redirect_type=mobile'));

    final result = await task.future;
    if (result != null && _current == current && error != null) {
      obtainingCodeFailed();
    }
    return result;
  }

  HttpServer? authServer;

  Future<void> startAuthServer() async {
    final handler = const Pipeline().addHandler(handleWebRequest);
    authServer = await shelf_io.serve(handler, 'localhost', Settings.instance.localAuthPort.value);
  }

  Future<void> stopAuthServer() async {
    task.complete(null);
    await authServer?.close();
  }

  Future<Response> handleWebRequest(Request request) async {
    final code = request.url.queryParameters['code'];

    if (request.url.path == 'login') {
      final serverUri = Uri.parse(Settings.instance.serverUrl.value);
      return Response.found(Uri(
        host: serverUri.host,
        scheme: serverUri.scheme,
        path: '${serverUri.path}/login',
        query: request.url.query,
        port: serverUri.port,
      ).toString());
    }

    if (code != null) {
      task.complete(await submitCode(code));
    } else if (error != null) {
      task.complete(null);
    }
    browser?.close();
    return Response.ok('<html><body><script>window.close()</script><h1>Cierra esta ventana</h1></body></html>',
        headers: {"Content-Type": "text/html"});
  }
}

class MyChromeSafariBrowser extends ChromeSafariBrowser {
  MyChromeSafariBrowser(this.flow);
  final AuthFlowMobile flow;

  @override
  void onClosed() {
    flow.stopAuthServer();
    super.onClosed();
  }
}
