import 'package:equipment_booking_app/components/duration_picker.dart';
import 'package:shared/settings.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:json_model_builder/json_model_builder.dart';

class TimeRangePickerForm extends StatefulWidget {
  const TimeRangePickerForm({super.key, required this.value, required this.onChange});

  final DurationRange? value;
  final void Function(DurationRange? value) onChange;

  @override
  // ignore: no_logic_in_create_state
  State<TimeRangePickerForm> createState() => _TimeRangePickerForm(value?.start, value?.end);
}

class _TimeRangePickerForm extends State<TimeRangePickerForm> {
  _TimeRangePickerForm(this.start, this.end);
  Duration? start;
  Duration? end;

  void reportChange() {
    if (start != null && end != null) {
      widget.onChange(DurationRange(start: start!, end: end!));
    } else {
      widget.onChange(null);
    }
  }

  @override
  Widget build(BuildContext context) {
    const padding = EdgeInsets.all(12);
    return LayoutBuilder(builder: (context, constrains) {
      final width = constrains.maxWidth;
      const offsetTop = 41.0;
      const offsetBottom = 12.0;
      const middleWidth = 50.0;
      final left = (width - middleWidth) / 2;

      return Stack(
        children: [
          Positioned(
            width: middleWidth,
            top: offsetTop,
            left: left,
            bottom: offsetBottom,
            child: CustomPaint(
              painter: MiddleUnion(start, end),
            ),
          ),
          Row(
            children: [
              Expanded(
                flex: 1,
                child: Padding(
                  padding: padding,
                  child: PickDurationColumn(
                    current: start,
                    header: 'Desde',
                    onSelected: (value) {
                      setState(() {
                        start = value;
                        if (end != null && value >= end!) end = null;
                        reportChange();
                      });
                    },
                  ),
                ),
              ),
              Expanded(
                flex: 1,
                child: Padding(
                  padding: padding,
                  child: PickDurationColumn(
                    current: end,
                    header: 'Hasta',
                    minDuration: start,
                    onSelected: (value) {
                      setState(() {
                        end = value;
                        reportChange();
                      });
                    },
                  ),
                ),
              ),
            ],
          )
        ],
      );
    });
  }
}

class PickDurationColumn extends StatelessWidget {
  const PickDurationColumn({super.key, required this.header, this.minDuration, required this.onSelected, required this.current});
  final String header;
  final Duration? minDuration;
  final Duration? current;
  final void Function(Duration value) onSelected;

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Text(
        header,
        style: const TextStyle(fontWeight: FontWeight.w500),
      ),
      const SizedBox(
        height: 10,
      ),
      Column(
        children: Settings.instance.durationRangeOptionsInMinutes.map<Widget>((element) {
          final dur = Duration(minutes: element.value);
          final date = DateTime.utc(200).add(dur);
          return PickTimeButton(
              current: dur == current,
              key: Key(element.value.toString()),
              onPressed: minDuration != null && minDuration! >= dur
                  ? null
                  : () {
                      onSelected(dur);
                    },
              text: DateFormat(DateFormat.HOUR24_MINUTE).format(date));
        }).toList(),
      ),
    ]);
  }
}

class PickTimeButton extends StatelessWidget {
  const PickTimeButton({super.key, required this.text, this.onPressed, required this.current});
  final String text;
  final void Function()? onPressed;
  final bool current;

  @override
  Widget build(BuildContext context) {
    return TextButton(
      style: ButtonStyle(backgroundColor: MaterialStateProperty.all(current ? Color.fromRGBO(0, 0, 0, 0.2) : Colors.transparent)),
      onPressed: onPressed,
      child: LayoutBuilder(builder: (context, constrains) {
        return SizedBox(
            width: constrains.maxWidth,
            child: Padding(
                padding: const EdgeInsets.all(8),
                child: Center(
                  child: Text(text),
                )));
      }),
    );
  }
}

class MiddleUnion extends CustomPainter {
  MiddleUnion(this.start, this.end);

  final Duration? start;
  final Duration? end;

  double getOptionHeight(final totalHeight) {
    return totalHeight / Settings.instance.durationRangeOptionsInMinutes.length;
  }

  int indexOf(Duration? dur) {
    return Settings.instance.durationRangeOptionsInMinutes.indexOf(JsonInt()..setFromJson(dur?.inMinutes));
  }

  @override
  void paint(Canvas canvas, Size size) {
    final indexStart = indexOf(start);
    final indexEnd = indexOf(end);

    if (indexStart == -1 || indexEnd == -1) return;

    final paint = Paint();
    paint.strokeWidth = 2;
    final optionHeight = getOptionHeight(size.height);
    paint.color = Colors.black26;

    final startPoint = Offset(0, (indexStart + 0.5) * optionHeight);
    final endPoint = Offset(size.width, (indexEnd + 0.5) * optionHeight);

    final middleWidth = size.width / 2;

    final middleStart = Offset(middleWidth, startPoint.dy);
    final middleEnd = Offset(middleWidth, endPoint.dy);

    canvas.drawLine(startPoint, middleStart, paint);
    canvas.drawLine(middleStart, middleEnd, paint);
    canvas.drawLine(middleEnd, endPoint, paint);
  }

  @override
  bool shouldRepaint(MiddleUnion oldDelegate) => false;
}
