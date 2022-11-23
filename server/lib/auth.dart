import 'dart:convert';

import 'package:openid_client/openid_client.dart';
import 'package:server/openid_client.dart';
import 'package:shared/models.dart';
import 'package:shelf_plus/shelf_plus.dart';

enum RedirectType {
  mobile,
  web,
}

void auth(RouterPlus app) async {
  // Auth config
  app.get('/auth-config', (Request request) async {
    final config = AuthConfig();
    return jsonEncode(config.toJson());
  });

  // Generate oauth login url
  app.get('/login', (Request request) async {
    // Username user put into the login prompt
    final loginHint = request.url.queryParameters['login_hint'];
    final type = request.url.queryParameters['redirect_type'];
    RedirectType redirectType;

    if (type == 'mobile') {
      redirectType = RedirectType.mobile;
    } else {
      redirectType = RedirectType.web;
    }

    final url = await getLoginUri(loginHint, redirectType);
    return Response.found(url);
  });

  // Return session token from oauth code
  app.get('/login/complete_with_code', (Request request) async {
    final code = request.url.queryParameters['code'];

    final credential = await getFlow().callback({'code': code!, 'state': getFlow().state});

    final userinfo = await credential.getUserInfo();

    final session = Session({})
      ..id.set('1234')
      ..profile.setFromJson(
        User()
          ..name.set(userinfo.name ?? 'User')
          ..id.set(userinfo.subject),
      );

    return jsonEncode(session.toJson());
  });

  // Return user profile from session token
  app.get('/profile', (Request request) async {
    return Response.ok('2334235235');
  });
}

Flow getFlow() {
  final flow = Flow.authorizationCode(
    state: '1000',
    client,
    redirectUri: Uri.parse("http://localhost:4000/auth.html"),
    scopes: ['openid', 'profile', 'email'],
  );
  return flow;
}

Future<Uri> getLoginUri(String? loginHint, RedirectType redirectType) async {
  return getFlow().authenticationUri;
}
