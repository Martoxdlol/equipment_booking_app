import 'package:equipment_booking_app/auth/login_flow.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

class Login extends HookWidget {
  const Login({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          children: [
            ElevatedButton(
              onPressed: () {
                final loginFlow = LoginFlow.autoPlatform(context);
                loginFlow.showLoginPage();
              },
              child: const Padding(
                padding: EdgeInsets.all(10),
                child: Text("Ingresar"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
