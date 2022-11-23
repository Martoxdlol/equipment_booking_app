import 'dart:async';
import 'package:equipment_booking_app/auth/auth_mobile.dart';
import 'package:equipment_booking_app/auth/auth_web.dart';
import 'package:equipment_booking_app/components/bottom_nav.dart';
import 'package:equipment_booking_app/components/weekly_grid.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:shared/models.dart';
import 'package:shared/settings.dart';
import 'dart:io' show Platform;

import 'package:shared_preferences/shared_preferences.dart';

enum AuthStatus {
  ok,
  error,
  canceled,
}

class AuthResult {
  AuthResult({required this.status, this.error, this.session});
  final AuthStatus status;
  final Exception? error;
  final Session? session;
}

abstract class AuthFlow {
  AuthFlow(this.context);
  final BuildContext context;

  /// Start authentication flow
  Future<void> start(String? loginHint);

  final Completer _task = Completer<AuthResult>();
  bool _started = false;

  /// Complete auth cycle
  Future<AuthResult> authtenticate(String? loginHint) async {
    if (_started) throw Exception("Auth flow already started");
    _started = true;

    try {
      await start(loginHint);
      return await _task.future;
    } on Exception catch (e) {
      print(e);
      return AuthResult(status: AuthStatus.error, error: e);
    }
  }

  void cancel() {
    if (_task.isCompleted) return;
    _task.complete(AuthResult(status: AuthStatus.canceled));
  }

  // Mannualy canel operation from flutter ap
  void closeAndCancel() {
    throw UnimplementedError();
  }

  void completeError(Exception e) {
    if (_task.isCompleted) return;
    _task.completeError(e);
  }

  void completeErrorWhenObtainingCode() {
    completeError(Exception("Cannot obtain authorization code"));
  }

  Future<void> complete(String authorizationCode) async {
    if (_task.isCompleted) return;
    try {
      final session = await submitCode(authorizationCode);
      _task.complete(AuthResult(status: AuthStatus.ok, session: session));
    } on Exception catch (e) {
      print(e);
      return completeError(e);
    }
  }

  /// Send auth code to server in exchange for the user session
  Future<Session> submitCode(String authorizationCode) async {
    final serverUri = Settings.instance.serverUri;
    final response = await http.get(Uri(
      scheme: serverUri.scheme,
      host: serverUri.host,
      port: serverUri.port,
      path: '${Settings.instance.serverUri.path}/login/complete_with_code',
      queryParameters: {'code': authorizationCode},
    ));

    final session = Session(response.body);
    Session.instance = session;
    return session;
  }

  bool get isCompleted => _task.isCompleted;

  static AuthFlow detectPlatform(BuildContext context) {
    if (kIsWeb) {
      return AuthFlowWeb(context);
    }
    if (Platform.isAndroid || Platform.isIOS) {
      return AuthFlowMobile(context);
    }
    throw Exception("Unsupported platform detected");
  }
}

void showAuthErrorDialog(BuildContext context, [Exception? e]) {
  showDialog(
    context: context,
    builder: (context) {
      return AlertDialog(
        title: Text("Error iniciando sesión"),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: Text("Cerrar"),
          )
        ],
      );
    },
  );
}

// abstract class AuthFlow {
//   Future<String?> getLocalSessionKey() async {
//     final prefs = await SharedPreferences.getInstance();
//     final sessionKey = prefs.getString('session_key');
//     return sessionKey;
//   }

//   Future<void> saveSessionKey(String key) async {
//     final prefs = await SharedPreferences.getInstance();
//     prefs.setString('session_key', key);
//   }

//   AuthFlow(this.context);
//   final BuildContext context;

//   static AuthFlow detectPlatform(BuildContext context) {
//     if (kIsWeb) {
//       return AuthFlowWeb(context);
//     }
//     if (Platform.isAndroid || Platform.isIOS) {
//       return AuthFlowMobile(context);
//     }
//     throw Exception("Unsupported platform detected");
//   }

//   Future<Session?> authtenticate(String username);

//   Future<Session> submitCode(String code) async {
//     final serverUri = Settings.instance.serverUri;
//     final response = await http.get(Uri(
//       scheme: serverUri.scheme,
//       host: serverUri.host,
//       port: serverUri.port,
//       path: '${Settings.instance.serverUri.path}/login/complete_with_code',
//       queryParameters: {'code': code},
//     ));

//     final session = Session(response.body);
//     Session.instance = session;
//     return session;
//   }

//   void obtainingCodeFailed() {
//     throw Exception("No se pudo iniciar sessión");
//   }

//   void showError() {
//     showDialog(
//       context: context,
//       builder: (context) {
//         return AlertDialog(
//           title: Text("Error iniciando sesión"),
//           actions: [
//             TextButton(
//               onPressed: () {
//                 Navigator.of(context).pop();
//               },
//               child: Text("Cerrar"),
//             )
//           ],
//         );
//       },
//     );
//   }
// }
