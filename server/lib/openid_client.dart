import 'package:openid_client/openid_client.dart';

late Client client;
late Issuer issuer;

Future<void> initializeOpenId() async {
  issuer = await Issuer.discover(Uri.parse('https://login.microsoftonline.com/6eae6170-6800-4e46-9695-5c90ab82bd68/v2.0'));
  client = Client(issuer, '675d4af3-d82e-4f57-9d03-ed71018de455', clientSecret: 'u-c8Q~TYQWYygj7lZ.4IO9UxDSGif8JSGHae0aOG');
  print("OPEN ID INITIALIZED");
}
