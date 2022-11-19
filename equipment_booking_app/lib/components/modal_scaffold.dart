import 'package:equipment_booking_app/components/modal_appbar.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class ModalScaffold extends StatelessWidget {
  const ModalScaffold({super.key, this.appbar = const ModalAppBar(), this.bottomToolbar, this.child});
  final PreferredSizeWidget appbar;
  final Widget? bottomToolbar;
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appbar,
      body: Stack(children: [
        Positioned(
            top: 0,
            left: 0,
            right: 0,
            bottom: bottomToolbar == null ? 0 : kToolbarHeight,
            child: SingleChildScrollView(
              child: Container(
                padding: const EdgeInsets.all(12),
                child: child,
              ),
            )),
        if (bottomToolbar != null) Positioned(bottom: 0, left: 0, right: 0, height: kToolbarHeight, child: bottomToolbar!)
      ]),
    );
  }
}
