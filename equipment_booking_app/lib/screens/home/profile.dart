import 'package:equipment_booking_app/auth/auth.dart';
import 'package:equipment_booking_app/screens/login/login.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

class ProfileDialog extends HookWidget {
  const ProfileDialog({super.key});

  static show(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => ProfileDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Usuario"),
      content: Text(Auth.instance.session?.user_id ?? 'signed out'),
      actions: [
        TextButton(
          onPressed: () async {
            await Auth.instance.signOut();
            Navigator.of(context).pushReplacement(CupertinoPageRoute(builder: (context) => Login()));
          },
          child: Text("Cerrar sesión"),
        ),
        TextButton(
          onPressed: () async {
            Navigator.of(context).pop();
          },
          child: Text("Cancelar"),
        ),
      ],
    );
  }
}
