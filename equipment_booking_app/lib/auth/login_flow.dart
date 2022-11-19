import 'dart:async';
import 'dart:convert';
import 'package:universal_html/html.dart' as html;

import 'package:adaptative_modals/adaptative_modals.dart';
import 'package:equipment_booking_app/components/bottom_nav.dart';
import 'package:equipment_booking_app/components/weekly_grid.dart';
import 'package:equipment_booking_app/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:http/http.dart' as http;

import 'package:shared/models.dart';
import 'dart:io' show Platform;

import 'package:webview_windows/webview_windows.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

abstract class LoginFlow {
  LoginFlow(this.context);
  final BuildContext context;

  Future<AuthConfig> getAuthConfigFromServer(String server) async {
    final config = jsonDecode((await http.get(Uri.parse('http://localhost:4000/auth-config'))).body);
    return config;
  }

  /// Open modal, page or webpage with login form (sso or user/pass)
  /// It should load oauth page from server using getAuthConfigFromServer to get url (ex: http://localhost:4000/login)
  /// On native platforms:
  ///   When oauth redirect to callback (/login/callback) it shoul capture from url the code query param
  ///   Should call submitCode()
  /// On web:
  ///   Not sure yet
  /// Errors;
  /// if cannot open login page call showLoginPageFailed()
  /// if cannot obtain code call obtainingCodeFailed()
  void showLoginPage();

  void showLoginPageFailed() {}

  void obtainingCodeFailed() {}

  void submitCode(String code) {
    http.get(Uri.parse('http://localhost:4000/login/complete_with_code?code=$code')).then((value) {
      final session = Session()..setFromJson(jsonDecode(value.body));
      if (session.id.isSet) {
        Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (context) {
          return Scaffold(
            appBar: AppBar(),
            body: Container(
              child: WeekView(),
            ),
            bottomNavigationBar: const BottomNav(),
          );
        }));
      } else {
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: Text("No se puedo iniciar sesión"),
          ),
        );
      }
    }).catchError((error) {
      obtainingCodeFailed();
    });
  }

  static LoginFlow autoPlatform(BuildContext context) {
    if (kIsWeb) {
      return WebLoginFlow(context);
    }
    if (Platform.isWindows) {
      return WindowsLoginFlow(context);
    }
    throw UnimplementedError();
  }
}

class WindowsLoginFlow extends LoginFlow {
  WindowsLoginFlow(super.context);

  @override
  void showLoginPage() {
    Navigator.of(context).push(
      AdaptativeModalPageRoute(
        height: 800,
        builder: (context) {
          return Scaffold(
            body: HookBuilder(builder: (context) {
              final controller = useState<WebviewController>(WebviewController());
              final showWebView = useState<bool>(false);
              final shouldBeLoading = useState<bool>(true);

              useEffect(() {
                final sub = controller.value.url.listen((url) {
                  final parsed = Uri.parse(url);

                  if (parsed.host != 'localhost' && shouldBeLoading.value) {
                    shouldBeLoading.value = false;
                  }

                  if (parsed.host == 'localhost' && parsed.path == '/login/callback' && parsed.port == 4000) {
                    shouldBeLoading.value = true;
                    final code = parsed.queryParameters['code'];
                    showWebView.value = false;
                    Navigator.of(context).pop();

                    if (code == null) {
                      obtainingCodeFailed();
                    } else {
                      submitCode(code);
                    }
                  }
                });

                controller.value.initialize().then((value) {
                  showWebView.value = controller.value.value.isInitialized;
                  if (!controller.value.value.isInitialized) {
                    showLoginPageFailed();
                  } else {
                    controller.value.loadUrl('http://localhost:4000/login');
                  }
                });

                return () {
                  sub.cancel();
                  controller.value.dispose();
                };
              }, []);

              if (showWebView.value) {
                return Stack(
                  children: [
                    if (!shouldBeLoading.value)
                      Positioned(
                        child: Webview(controller.value),
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      ),
                    if (shouldBeLoading.value) Center(child: CircularProgressIndicator())
                  ],
                );
              }
              return Center(child: CircularProgressIndicator());
            }),
          );
        },
      ),
    );
  }
}

class WebLoginFlow extends LoginFlow {
  WebLoginFlow(super.context);

  @override
  void showLoginPage() {
    final popup = html.window.open(
      'http://localhost:4000/login',
      'Oauth login',
    );
    html.window.addEventListener('message', (event) {
      if (event is html.MessageEvent) {
        final data = event.data;
        popup.close();
        if (data is String && data.length > 0) {
          final uri = Uri.parse(data);
          final code = uri.queryParameters['code'];
          if (code != null) {
            submitCode(code);
          } else {
            obtainingCodeFailed();
          }
        } else {
          obtainingCodeFailed();
        }
      }
    });
  }
}
