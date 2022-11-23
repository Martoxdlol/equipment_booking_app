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

abstract class AuthFlow {
  Future<String?> getLocalSessionKey() async {
    final prefs = await SharedPreferences.getInstance();
    final sessionKey = prefs.getString('session_key');
    return sessionKey;
  }

  Future<void> saveSessionKey(String key) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setString('session_key', key);
  }

  AuthFlow(this.context);
  final BuildContext context;

  static AuthFlow detectPlatform(BuildContext context) {
    if (kIsWeb) {
      return AuthFlowWeb(context);
    }
    if (Platform.isAndroid || Platform.isIOS) {
      return AuthFlowMobile(context);
    }
    throw Exception("Unsupported platform detected");
  }

  Future<Session?> authtenticate(String username);

  Future<Session> submitCode(String code) async {
    final serverUri = Settings.instance.serverUri;
    final response = await http.get(Uri(
      scheme: serverUri.scheme,
      host: serverUri.host,
      port: serverUri.port,
      path: '${Settings.instance.serverUri.path}/login/complete_with_code',
      queryParameters: {'code': code},
    ));

    final session = Session(response.body);
    Session.instance = session;
    return session;
  }

  void obtainingCodeFailed() {
    throw Exception("No se pudo iniciar sessión");
  }

  void showError() {
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
}
