import 'dart:async';
import 'dart:convert';
import 'package:equipment_booking_app/auth/auth_mobile.dart';
import 'package:equipment_booking_app/auth/auth_web.dart';
import 'package:equipment_booking_app/util/api.dart';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import 'package:flutter/material.dart';
import 'package:server/prisma_client.dart';
import 'package:shared/settings.dart';
import 'dart:io' show Platform;

import 'package:shared_preferences/shared_preferences.dart';
import 'package:shared/errors.dart';

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
    if (_started) throw InternalError("auth flow already stared");
    _started = true;

    try {
      await start(loginHint);
      final AuthResult r = await _task.future;
      return r;
    } on Exception catch (e) {
      print("Authtentication failed");
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

  void completeErrorWhenObtainingCode(AppException? error) {
    completeError(error ?? InternalError("cannot obtain authorization code"));
  }

  Future<void> complete(AuthorizationParams authorization) async {
    if (_task.isCompleted) return;
    try {
      final session = await submitCode(authorization);
      _task.complete(AuthResult(status: AuthStatus.ok, session: session));
    } on Exception catch (e) {
      print("Authentication task failed");
      print(e);
      return completeError(e);
    }
  }

  /// Send auth code to server in exchange for the user session
  Future<Session> submitCode(AuthorizationParams authorization) async {
    final serverUri = Settings.instance.serverUri;
    final response = await http.get(Uri(
      scheme: serverUri.scheme,
      host: serverUri.host,
      port: serverUri.port,
      path: '${Settings.instance.serverUri.path}/login/complete_with_code',
      queryParameters: {'code': authorization.code, 'state': authorization.state, 'session_state': authorization.sessionState},
    ));

    final session = Session.fromJson(jsonDecode(response.body));
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
    throw InternalError("Unsupported platform detected");
  }
}

class AuthorizationParams {
  AuthorizationParams({required this.code, this.state, this.sessionState});

  final String code;
  final String? state;
  final String? sessionState;
}

void showAuthErrorDialog(BuildContext context, [Exception? e]) {
  showDialog(
    context: context,
    builder: (context) {
      return AlertDialog(
        title: Text("Error iniciando sesión"),
        content: Text(e.toString()),
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

class Auth {
  AuthFlow? currentFlow;

  Session? session;
  User? _user;
  User get user {
    if (_user != null) return _user!;
    throw AuthtenticationError("user is not logged in");
  }

  Future<bool> localSignIn() async {
    final r = await loadSession() != null;

    if (r) {
      try {
        await userInfo();
        return true;
      } catch (e) {
        print("Failed to load user info on login page");
        print(e);
        return false;
      }
    }
    return false;
  }

  Future<void> saveSession([Session? session]) async {
    this.session = session ?? this.session;

    final prefs = await SharedPreferences.getInstance();

    prefs.setString('session', jsonEncode(this.session?.toJson()));
  }

  Future<void> deleteSession() {
    session = null;
    return saveSession();
  }

  Future<void> deleteUserInfo() async {
    final prefs = await SharedPreferences.getInstance();
    prefs.remove('profile');
  }

  Future<Session?> loadSession() async {
    final prefs = await SharedPreferences.getInstance();

    try {
      final sstring = prefs.getString('session');

      if (sstring == null) {
        session = null;
        return null;
      }

      final decoded = jsonDecode(sstring);

      if (decoded == null) {
        return null;
      }

      session = Session.fromJson(decoded);
    } catch (e) {
      print("Loading session failed");
      print(e);
    }

    return session;
  }

  Future<Session?> updateSession([String? key]) async {
    if (key == null) {
      await loadSession();
      key = session?.key;
    }

    if (key == null) {
      saveSession(null);
    }

    final response = await http.get(Uri.parse('${Settings.instance.serverUri}/session'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final session = Session.fromJson(data);
      await saveSession(session);
      return session;
    } else if (response.statusCode == AuthtenticationError().status) {
      await saveSession(null);
    }
    return null;
  }

  Future<AuthResult> signIn(BuildContext context, String username) async {
    currentFlow = AuthFlow.detectPlatform(context);
    final authResult = await currentFlow!.authtenticate(username);

    if (authResult.status != AuthStatus.ok) {
      return authResult;
    }

    if (authResult.session != null) {
      saveSession(authResult.session);
    }

    try {
      await userInfo();
    } on Exception catch (e) {
      return AuthResult(status: AuthStatus.error, error: e, session: null);
    }

    return authResult;
  }

  Future<void> signOut() async {
    await deleteUserInfo();
    await deleteSession();
  }

  Future<User> userInfo() async {
    User? localUser = _user;

    if (await loadSession() == null) {
      throw AuthtenticationError("user is not signed in");
    }

    if (localUser != null) {
      return localUser;
    }

    try {
      final prefs = await SharedPreferences.getInstance();
      final profileJsonData = prefs.getString('profile');
      if (profileJsonData != null) {
        localUser = User.fromJson(jsonDecode(profileJsonData));
        _user = localUser;
        return localUser;
      }
    } catch (e) {
      print("Loading user info failed");
      print(e);
    }

    final userData = await apiFetchGet('/profile');
    localUser = User.fromJson(userData);
    _user = localUser;
    return localUser;
  }

  static Auth instance = Auth();
}
