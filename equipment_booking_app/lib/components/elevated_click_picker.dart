import 'package:flutter/material.dart';

class ElevatedClickPicker<T> extends StatelessWidget {
  const ElevatedClickPicker(
      {super.key,
      required this.label,
      required this.onChange,
      required this.value,
      required this.showPicker,
      this.labelBuilder,
      this.waringOnIncomplete = true,
      required this.icon});
  final String label;
  final Widget Function(BuildContext context, T? value, String originalLabel)? labelBuilder;
  final void Function(T? value) onChange;
  final Future<T?> Function(BuildContext context, T? value) showPicker;
  final T? value;
  final Widget icon;
  final bool waringOnIncomplete;

  Widget buildLabel(BuildContext context) {
    return labelBuilder == null ? Text(label) : labelBuilder!(context, value, label);
  }

  @override
  Widget build(BuildContext context) {
    final textInputFocusNode = FocusNode();
    textInputFocusNode.addListener(() {
      textInputFocusNode.unfocus();
    });

    void onTap() {
      showPicker(context, value).then((value) => onChange(value));
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: LayoutBuilder(builder: (context, constrains) {
        return ElevatedButton(
            style: ButtonStyle(backgroundColor: MaterialStateProperty.all(Colors.white)),
            onPressed: onTap,
            child: SizedBox(
              height: 57,
              child: Row(children: [
                icon,
                const SizedBox(
                  width: 6,
                ),
                SizedBox(
                  width: constrains.maxWidth - 90,
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: buildLabel(context),
                  ),
                ),
                const Expanded(child: SizedBox()),
                if (waringOnIncomplete && value == null)
                  Icon(
                    Icons.warning_amber_rounded,
                    color: Colors.red[800],
                  )
              ]),
            ));
      }),
    );
  }
}
