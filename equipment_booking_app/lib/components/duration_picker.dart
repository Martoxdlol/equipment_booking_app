import 'dart:async';

import 'package:adaptative_modals/adaptative_modals.dart';
import 'package:equipment_booking_app/components/bigger_text_button.dart';
import 'package:equipment_booking_app/components/bottom_toolbar.dart';
import 'package:equipment_booking_app/components/elevated_click_picker.dart';
import 'package:equipment_booking_app/components/modal_appbar.dart';
import 'package:equipment_booking_app/components/modal_scaffold.dart';
import 'package:equipment_booking_app/components/durationrange_picker_form.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class DurationRangePicker extends ElevatedClickPicker<DurationRange> {
  const DurationRangePicker({super.key, String label = 'Horaio', required super.onChange, required super.value})
      : super(label: label, showPicker: _showPicker, icon: const Icon(Icons.access_time));

  static Future<DurationRange?> _showPicker(BuildContext context, DurationRange? value) async {
    final completer = Completer<DurationRange?>();
    DurationRange? durationRange;
    Navigator.of(context).push(
      AdaptativeModalPageRoute(
        height: 524,
        width: 670,
        fullScreen: false,
        builder: (context) => WillPopScope(
            child: ModalScaffold(
              appbar: const ModalAppBar(title: 'Elegir rango horario'),
              bottomToolbar: BottomToolbar(
                right: [
                  BiggerTextButton(
                    text: const Text('Cancelar', style: TextStyle(color: Color.fromRGBO(90, 90, 90, 1))),
                    onPressed: () {
                      Navigator.of(context).pop();
                      completer.complete(value);
                    },
                  ),
                  BiggerTextButton(
                    text: const Text('Aceptar'),
                    onPressed: () {
                      Navigator.of(context).pop();
                      completer.complete(durationRange);
                    },
                  ),
                ],
              ),
              child: TimeRangePickerForm(
                value: value,
                onChange: (value) => durationRange = value,
              ),
            ),
            onWillPop: () async {
              completer.complete(durationRange);
              return true;
            }),
      ),
    );
    return completer.future;
  }

  @override
  Widget buildLabel(BuildContext context) {
    if (value == null) return Text(label);
    final formatter = DateFormat(DateFormat.HOUR24_MINUTE);
    final start = DateTime.utc(2000, 1, 1, 0).add(value!.start);
    final end = DateTime.utc(2000, 1, 1, 0).add(value!.end);
    return Text("${formatter.format(start)} - ${formatter.format(end)} (${(value!.difference.inMinutes / 60).round()} horas)");
  }
}

class DurationRange {
  DurationRange({required this.start, required this.end});
  final Duration start;
  final Duration end;
  Duration get difference => Duration(microseconds: end.inMicroseconds - start.inMicroseconds);
}
