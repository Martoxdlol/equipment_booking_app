import 'package:server/auth.dart';
import 'package:shelf_plus/shelf_plus.dart';
import 'package:shelf_cors_headers/shelf_cors_headers.dart';

void main() => shelfRun(init, defaultBindPort: 4000);

Handler init() {
  RouterPlus app = Router().plus;

  app.use(corsHeaders());

  auth(app);

  return app;
}

class Person {
  final String name;

  Person(this.name);

  // can be generated by tools (i.e. json_serializable package)
  Map<String, dynamic> toJson() => {'name': name};
}
