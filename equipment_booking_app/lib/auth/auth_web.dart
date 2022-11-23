import 'dart:async';

import 'package:equipment_booking_app/auth/auth.dart';
import 'package:shared/settings.dart';
import 'package:universal_html/html.dart' as html;

class AuthFlowWeb extends AuthFlow {
  AuthFlowWeb(super.context);

  html.WindowBase? popup;

  @override
  Future<void> start(String? loginHint) async {
    final serverUri = Uri.parse(Settings.instance.serverUrl.value);
    final url = Uri(
      host: serverUri.host,
      path: '${serverUri.path}/login',
      port: serverUri.port,
      scheme: serverUri.scheme,
      queryParameters: {
        "login_hint": loginHint,
        "redirect_type": "web",
      },
    );

    // ignore: unnecessary_nullable_for_final_variable_declarations
    popup = html.window.open(
      url.toString(),
      'Oauth login',
    );

    // THIS DOESN'T WORK (unsupported)
    // eventListener(event) => cancel();
    // popup?.addEventListener('unload', eventListener);

    // ignore: prefer_typing_uninitialized_variables
    final timer = Timer.periodic(const Duration(milliseconds: 200), (Timer timer) {
      if (popup?.closed == true) {
        cancel();
        timer.cancel();
      }
    });

    html.window.addEventListener('message', (event) async {
      if (event is html.MessageEvent) {
        final data = event.data;

        timer.cancel();
        popup?.close();

        if (data is String && data.isNotEmpty) {
          final uri = Uri.parse(data);
          final code = uri.queryParameters['code'];
          if (code != null) {
            complete(code);
          } else {
            completeError(Exception("Callback returned empty code"));
          }
        } else {
          if (popup?.closed == true && popup?.closed == null) cancel();
        }
      }
    });
  }

  @override
  void closeAndCancel() {
    popup?.close();
    cancel();
  }
}

// class AuthFlowWeb extends AuthFlow {
//   AuthFlowWeb(super.context);

//   Exception? error;

//   @override
//   Future<Session?> authtenticate(String username) async {
//     final serverUri = Uri.parse(Settings.instance.serverUrl.value);
//     final url = Uri(
//       host: serverUri.host,
//       path: '${serverUri.path}/login',
//       port: serverUri.port,
//       scheme: serverUri.scheme,
//       queryParameters: {
//         "login_hint": username,
//         "redirect_type": "web",
//       },
//     );
//     final popup = html.window.open(
//       url.toString(),
//       'Oauth login',
//     );

//     final task = Completer<Session?>();
//     html.window.addEventListener('message', (event) async {
//       if (event is html.MessageEvent) {
//         final data = event.data;

//         // Ignoramos el error porque sino no compila
//         // ignore: invalid_null_aware_operator
//         popup?.close();
//         //
//         if (data is String && data.isNotEmpty) {
//           final uri = Uri.parse(data);
//           final code = uri.queryParameters['code'];
//           if (code != null) {
//             task.complete(await submitCode(code));
//           }
//         } else {
//           task.complete(null);
//         }
//       }
//     });
//     final result = await task.future;
//     if (result == null && error != null) {
//       obtainingCodeFailed();
//     }
//     return result;
//   }
// }
