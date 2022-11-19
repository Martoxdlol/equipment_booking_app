import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class BottomToolbar extends StatelessWidget {
  const BottomToolbar({super.key, this.right = const [], this.left = const []});
  final List<Widget> right;
  final List<Widget> left;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: kElevationToShadow[1],
      ),
      padding: EdgeInsets.symmetric(horizontal: 20),
      child: Stack(children: [
        Positioned(
            top: 0,
            bottom: 0,
            child: Row(
              children: left,
            )),
        Positioned(
            top: 0,
            bottom: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: right,
            )),
      ]),
    );
  }
}
