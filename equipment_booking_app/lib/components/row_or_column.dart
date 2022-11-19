import 'package:flutter/cupertino.dart';

class RowOrColumn extends StatelessWidget {
  const RowOrColumn({super.key, this.minWidth = 550, required this.children, this.gap = 0});
  final double minWidth;
  final List<Widget> children;
  final double gap;

  Widget buildColumn(BuildContext context) {
    return Column(
      children: children,
    );
  }

  Widget buildRow(BuildContext context, BoxConstraints constrains) {
    final list = <Widget>[];

    double gapSize = (children.length - 1) * gap;
    if (gapSize < 0) gapSize = 0;
    final childWidthSize = (constrains.maxWidth - gapSize) / children.length;

    for (final w in children) {
      list.add(SizedBox(
        width: childWidthSize,
        child: w,
      ));
      if (children.last != w) {
        list.add(SizedBox(
          width: gap,
        ));
      }
    }

    return SizedBox(
      width: constrains.maxWidth,
      child: Row(children: list),
    );
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constrains) {
      if (constrains.maxWidth >= minWidth) {
        return buildRow(context, constrains);
      }
      return buildColumn(context);
    });
  }
}
