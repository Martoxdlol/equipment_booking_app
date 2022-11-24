import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

class ProgressButton extends HookWidget {
  const ProgressButton({required this.builder, super.key});
  final Widget Function(BuildContext context, void Function() onPressed) builder;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.red,
      child: builder(context, () {}),
    );
  }
}
