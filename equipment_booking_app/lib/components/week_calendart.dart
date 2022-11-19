import 'package:carousel_slider/carousel_controller.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:equipment_booking_app/components/weekly_grid.dart';
import 'package:shared/settings.dart';
import 'package:equipment_booking_app/util/time.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class CalendarCarrousel extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _CalendarCarrouselState();
  }
}

class _CalendarCarrouselState extends State<CalendarCarrousel> {
  final CarouselController _controller = CarouselController();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final headerHeight = 20.0;
    final double height = WeekViewGrid.height;
    final double width = WeekViewGrid.width + 20;

    return Container(
      constraints: BoxConstraints(
        maxWidth: width,
        maxHeight: height + headerHeight,
      ),
      child: LayoutBuilder(
        builder: (context, constrains) {
          final double aspectRatio = width > constrains.maxWidth ? constrains.maxWidth / height : width / height;
          return SingleChildScrollView(
            child: Stack(children: [
              Container(
                padding: EdgeInsets.only(top: headerHeight),
                child: CarouselSlider.builder(
                  itemBuilder: (context, index, realIndex) {
                    return Column(
                      children: [
                        WeekViewGrid(),
                      ],
                    );
                  },
                  itemCount: 1000000,
                  options: CarouselOptions(
                    enlargeCenterPage: false,
                    initialPage: 50000,
                    viewportFraction: 1,
                    enlargeStrategy: CenterPageEnlargeStrategy.height,
                    enableInfiniteScroll: false,
                    aspectRatio: aspectRatio,
                  ),
                  carouselController: _controller,
                ),
              ),
              Positioned(
                left: 20,
                right: 0,
                child: Row(
                  children: [
                    ...Settings.instance.weekViewShowDaysByIndex.map(
                      (element) => Expanded(
                        child: Text(
                          dayNameByIndex(element.value).capitalize(),
                          style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
                        ),
                      ),
                    )
                  ],
                ),
              ),
              Container(
                color: Colors.white,
                height: height,
                width: 20,
                child: OverflowBox(
                  maxHeight: double.infinity,
                  child: Column(
                    children: [
                      ...Settings.instance.durationRangeOptionsInMinutes.map((duration) {
                        return Container(
                          color: Colors.white,
                          transform: Matrix4.translationValues(0.0, 7.0, 0.0),
                          height: 50,
                          width: 20,
                          child: RotatedBox(
                            quarterTurns: -1,
                            child: Text(
                              DateFormat(DateFormat.HOUR_MINUTE).format(DateTime(2000).add(Duration(minutes: duration.value))),
                              style: const TextStyle(fontSize: 12, color: Colors.black54, fontWeight: FontWeight.w600),
                            ),
                          ),
                        );
                      }),
                    ],
                  ),
                ),
              ),
            ]),
          );
        },
      ),
    );
  }
}

extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${this.substring(1).toLowerCase()}";
  }
}
