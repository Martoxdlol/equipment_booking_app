import 'package:flutter/material.dart';

class BiggerTextButton extends StatelessWidget {
  const BiggerTextButton({super.key, this.color, required this.text, required this.onPressed, this.padding, this.enabled = true});
  final Color? color;
  final Widget text;
  final void Function() onPressed;
  final EdgeInsetsGeometry? padding;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: enabled ? onPressed : null,
      child: Container(
        padding: padding ?? const EdgeInsets.symmetric(vertical: 6, horizontal: 12),
        child: color == null
            ? text
            : DefaultTextStyle(
                style: TextStyle(color: color, fontWeight: FontWeight.w500),
                child: text,
              ),
      ),
    );
  }
}
