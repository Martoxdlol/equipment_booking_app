import 'dart:convert';

import 'package:openid_client/openid_client.dart';
import 'package:server/api/util.dart';
import 'package:server/db.dart';
import 'package:server/openid_client.dart';
import 'package:server/prisma_client.dart';
import 'package:shared/models.dart' show AuthConfig;
import 'package:shelf_plus/shelf_plus.dart';
import 'dart:math';

enum RedirectType {
  mobile,
  web,
}

void auth(RouterPlus app) async {
  // Auth config
  app.get('/auth-config', handlerWrapper((Request request) async {
    final config = AuthConfig();
    return jsonResponse(config.toJson());
  }));

  // Generate oauth login url
  app.get('/login', handlerWrapper((Request request) async {
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
  }));

  // Return session token from oauth code
  app.get('/login/complete_with_code', handlerWrapper((Request request) async {
    final code = request.url.queryParameters['code'];

    final state = request.url.queryParameters['state'];

    if (code == null) {
      throw Exception('missing_code');
    }

    final query = {'code': code};

    if (state != null) {
      query['state'] = state;
    }

    final credential = await getFlow(state).callback(query);

    final userinfo = await credential.getUserInfo();

    final email = userinfo.email;

    if (email == null) {
      throw Exception('missing_email_address');
    }

    final userData = UserCreateInput(id: userinfo.subject, email: email, name: userinfo.name ?? userinfo.nickname ?? email.split("@")[0]);

    final user = await prisma.user.upsert(
      where: UserWhereUniqueInput(id: userData.id),
      create: userData,
      update: UserUpdateInput(
        email: StringFieldUpdateOperationsInput(set$: email),
        id: StringFieldUpdateOperationsInput(set$: userData.id),
        name: StringFieldUpdateOperationsInput(set$: userData.name),
      ),
    );

    final session = Session(key: generateSecureQuey(256), user_id: userinfo.subject);

    final responseData = session.toJson();
    responseData['profile'] = user.toJson();

    return jsonResponse(responseData);
  }));

  // Return session information
  app.get('/session', handlerWrapperAuthtenticated((Request request, Session session) async {
    return jsonResponse(session.toJson());
  }));

  // Return user profile from session token
  app.get('/profile', handlerWrapperAuthtenticated((Request request, Session session) async {
    final user = await prisma.user.findFirst(where: UserWhereInput(id: StringFilter(equals: session.user_id)));

    if (user == null) {
      throw Exception("Not authtenticated");
    }

    return jsonResponse(user.toJson());
  }));
}

Flow getFlow([String? state]) {
  final flow = Flow.authorizationCode(
    // state: state ?? generateSecureQuey(16),
    state: state ?? 'abcd12345',
    client,
    redirectUri: Uri.parse("http://localhost:4000/auth.html"),
    scopes: ['openid', 'profile', 'email'],
  );
  return flow;
}

Future<Uri> getLoginUri(String? loginHint, RedirectType redirectType) async {
  return getFlow().authenticationUri;
}

String generateSecureQuey([int length = 32]) {
  final random = Random.secure();

  final values = List<int>.generate(256, (i) => random.nextInt(length));
  return base64Url.encode(values);
}
