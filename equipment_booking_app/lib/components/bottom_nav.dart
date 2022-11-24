import 'package:equipment_booking_app/request_form/form.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:shared/internationalization.dart';

class BottomNav extends HookWidget {
  const BottomNav({super.key});

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      items: <BottomNavigationBarItem>[
        BottomNavigationBarItem(
          icon: const Icon(Icons.home),
          label: appStrings.home.get,
        ),
        BottomNavigationBarItem(
          icon: const Icon(Icons.add),
          label: appStrings.newRequest.get,
        ),
        BottomNavigationBarItem(
          icon: const Icon(Icons.account_tree_outlined),
          label: appStrings.resources.get,
        ),
      ],
      currentIndex: 1,
      onTap: (index) {
        if (index == 1) showRequestForm(context);
      },
    );
  }
}
