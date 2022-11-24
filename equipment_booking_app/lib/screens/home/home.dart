import 'package:equipment_booking_app/components/bottom_nav.dart';
import 'package:equipment_booking_app/components/progress_text_button.dart';
import 'package:equipment_booking_app/screens/home/profile.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

class HomeScreen extends HookWidget {
  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        return false;
      },
      child: Scaffold(
        appBar: AppBar(
          automaticallyImplyLeading: false,
          actions: [
            IconButton(
              icon: Icon(Icons.add),
              onPressed: () {},
            ),
            IconButton(
              icon: Icon(Icons.calendar_month),
              onPressed: () {},
            ),
            IconButton(
              icon: Icon(Icons.person),
              onPressed: () => ProfileDialog.show(context),
            ),
          ],
        ),
        body: Padding(
          padding: EdgeInsets.all(20),
          child: Column(
            children: [
              ProgressButton(
                builder: (context, onPressed) {
                  return TextButton(onPressed: onPressed, child: Text("Un boton que hace una acción"));
                },
              )
            ],
          ),
        ),
        bottomNavigationBar: const BottomNav(),
      ),
    );
  }
}
