import 'dart:convert';

import 'package:shared/models.dart';
import 'package:shelf_plus/shelf_plus.dart';
import 'package:shared/settings.dart';
import 'package:http/http.dart' as http;

void auth(RouterPlus app) async {
  // Auth config
  app.get('/auth-config', (Request request) async {
    final config = AuthConfig();
    return jsonEncode(config.toJson());
  });

  // Generate oauth login url
  app.get('/login', (Request request) async {
    final url = await getLoginUri();
    return Response.found(url);
  });

  // Return session token from oauth code
  app.get('/login/complete_with_code', (Request request) async {
    final session = Session()
      ..id.set('1234')
      ..profile.setFromJson(User()..name.set('Tomás'));

    final body = Uri(queryParameters: {
      "grant_type": "authorization_code",
      "client_id": "675d4af3-d82e-4f57-9d03-ed71018de455",
      "client_secret": secret,
      "redirect_uri": "http://localhost:63644/auth.html",
      "code": request.url.queryParameters['code']!,
    }).query;

    print(body);

    final tokenEndpoint = Uri.parse('https://login.microsoftonline.com/6eae6170-6800-4e46-9695-5c90ab82bd68/oauth2/v2.0/token');
    final response = await http.post(
      tokenEndpoint,
      body: body,
    );

    print(response.body);

    //secret
    // http.get(Uri.parse('https://graph.microsoft.com/oidc/userinfo?access_token='));

    return jsonEncode(session.toJson());
  });

  // Return user profile from session token
  app.get('/profile', (Request request) async {
    return Response.ok('2334235235');
  });
}

const secret = 'u-c8Q~TYQWYygj7lZ.4IO9UxDSGif8JSGHae0aOG';

Future<Uri> getLoginUri() async {
  final resp = await http
      .get(Uri.parse('https://login.microsoftonline.com/6eae6170-6800-4e46-9695-5c90ab82bd68/v2.0/.well-known/openid-configuration'));
  final config = jsonDecode(resp.body);
  final rawUrl = Uri.parse(config['authorization_endpoint']);

  return Uri(scheme: rawUrl.scheme, path: rawUrl.path, host: rawUrl.host, queryParameters: {
    "client_id": "675d4af3-d82e-4f57-9d03-ed71018de455",
    // "redirect_uri": "http://localhost:4000/login/callback",
    "redirect_uri": "http://localhost:63644/auth.html",
    "scope": "profile openid",
    "response_type": "code",
  });
}
