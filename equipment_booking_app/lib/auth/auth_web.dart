import 'dart:async';

import 'package:equipment_booking_app/auth/auth.dart';
import 'package:shared/models.dart';
import 'package:shared/settings.dart';
import 'package:universal_html/html.dart' as html;

class AuthFlowWeb extends AuthFlow {
  AuthFlowWeb(super.context);

  Exception? error;

  @override
  Future<Session?> authtenticate(String username) async {
    final serverUri = Uri.parse(Settings.instance.serverUrl.value);
    final url = Uri(
      host: serverUri.host,
      path: '${serverUri.path}/login',
      port: serverUri.port,
      scheme: serverUri.scheme,
      queryParameters: {
        "login_hint": username,
        "redirect_type": "web",
      },
    );
    final popup = html.window.open(
      url.toString(),
      'Oauth login',
    );

    final task = Completer<Session?>();
    html.window.addEventListener('message', (event) async {
      if (event is html.MessageEvent) {
        final data = event.data;

        // Ignoramos el error porque sino no compila
        // ignore: invalid_null_aware_operator
        popup?.close();
        //
        if (data is String && data.isNotEmpty) {
          final uri = Uri.parse(data);
          final code = uri.queryParameters['code'];
          if (code != null) {
            task.complete(await submitCode(code));
          }
        } else {
          task.complete(null);
        }
      }
    });
    final result = await task.future;
    if (result == null && error != null) {
      obtainingCodeFailed();
    }
    return result;
  }
}
