import 'package:carousel_slider/carousel_slider.dart';
import 'package:equipment_booking_app/components/week_calendart.dart';
import 'package:shared/settings.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:infinite_carousel/infinite_carousel.dart';
import 'package:intl/intl.dart';

class WeekView extends HookWidget {
  const WeekView({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = useState(InfiniteScrollController(initialItem: 5000));
    return LayoutBuilder(builder: (context, constrains) {
      return CalendarCarrousel();
    });
  }
}

class WeekViewGrid extends HookWidget {
  const WeekViewGrid({super.key});

  static double get height {
    final rows = Settings.instance.durationRangeOptionsInMinutes.length - 1;
    return rows * 50 + 19;
  }

  static double get width {
    final columns = Settings.instance.weekViewShowDaysByIndex.length;
    return columns * 60;
  }

  @override
  Widget build(BuildContext context) {
    final columns = Settings.instance.weekViewShowDaysByIndex;
    final borderSide = BorderSide(color: Colors.black12, width: 0.5);

    return LayoutBuilder(builder: (context, constrains) {
      return Table(
        defaultColumnWidth: FlexColumnWidth(1),
        columnWidths: {0: FixedColumnWidth(20)},
        border: TableBorder(
          horizontalInside: borderSide,
          verticalInside: borderSide,
        ),
        children: [
          ...Settings.instance.durationRangeOptionsInMinutes
              .sublist(0, Settings.instance.durationRangeOptionsInMinutes.length - 1)
              .map((duration) {
            return TableRow(children: [
              TableCell(
                child: SizedBox.shrink(),
                // child: Container(
                //   color: Colors.white,
                //   transform: Matrix4.translationValues(0.0, -10.0, 0.0),
                //   width: 20,
                //   child: RotatedBox(
                //     quarterTurns: -1,
                //     child: Text(
                //       DateFormat(DateFormat.HOUR_MINUTE).format(DateTime(2000).add(Duration(minutes: duration.value))),
                //       style: TextStyle(fontSize: 12, color: Colors.black54, fontWeight: FontWeight.w600),
                //     ),
                //   ),
                // ),
              ),
              ...Settings.instance.weekViewShowDaysByIndex.map((dayIndex) {
                return TableCell(
                  child: Container(
                    height: 49.5,
                    child: Text(" "),
                  ),
                );
              })
            ]);
          }),
        ],
      );
    });

    // return LayoutBuilder(builder: (context, constrains) {
    //   const borderSide = BorderSide(color: Colors.black12, width: 1);
    //   final children = columns.map((element) {
    //     return Expanded(
    //       flex: 1,
    //       child: Column(
    //         children: [
    //           Container(
    //             decoration: BoxDecoration(border: Border()),
    //           ),
    //           ...Settings.instance.durationRangeOptionsInMinutes
    //               .map(
    //                 (element) => Container(
    //                   decoration: const BoxDecoration(border: Border(right: borderSide, bottom: borderSide)),
    //                   height: 50,
    //                   child: Stack(children: [
    //                     Positioned(left: 1, top: 1, child: Text(element.value.toString())),
    //                   ]),
    //                 ),
    //               )
    //               .toList()
    //         ],
    //       ),
    //     );
    //   }).toList();
    //   return Row(
    //     children: [
    //       SizedBox(
    //         width: 20,
    //         child: Container(
    //           decoration: const BoxDecoration(border: Border(right: borderSide)),
    //           child: SizedBox(
    //             height: height,
    //           ),
    //         ),
    //       ),
    //       ...children,
    //     ],
    //   );
    // });
  }
}
