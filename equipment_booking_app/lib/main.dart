import 'package:equipment_booking_app/components/bottom_nav.dart';
import 'package:equipment_booking_app/components/weekly_grid.dart';
import 'package:equipment_booking_app/login.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart';

void main() async {
  Intl.systemLocale = 'es';
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        localizationsDelegates: const [
          GlobalCupertinoLocalizations.delegate,
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
        ],
        supportedLocales: const [
          Locale('es'),
        ],
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.lightBlue,
        ),
        home: Login()
        // Scaffold(
        //   appBar: AppBar(),
        //   body: Container(
        //     child: WeekView(),
        //   ),
        //   bottomNavigationBar: const BottomNav(),
        // ),
        );
  }
}
