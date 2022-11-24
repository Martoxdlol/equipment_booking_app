import 'package:server/auth/auth.dart';
import 'package:server/openid_client.dart';
import 'package:shelf_plus/shelf_plus.dart';
import 'package:shelf_cors_headers/shelf_cors_headers.dart';

void main() async {
  await initializeOpenId();
  shelfRun(init, defaultBindPort: 4000, defaultBindAddress: '0.0.0.0');
}

Handler init() {
  RouterPlus app = Router().plus;

  app.use(corsHeaders());

  auth(app);

  return app;
}
