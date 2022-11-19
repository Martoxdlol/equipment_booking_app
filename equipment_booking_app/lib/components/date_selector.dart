import 'package:equipment_booking_app/components/elevated_click_picker.dart';
import 'package:shared/settings.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class DatePicker extends ElevatedClickPicker<DateTime> {
  const DatePicker({super.key, String label = 'Elegir fecha', required super.onChange, required super.value})
      : super(label: label, showPicker: _showPicker, icon: const Icon(Icons.calendar_month_outlined));

  static Future<DateTime?> _showPicker(BuildContext context, DateTime? value) async {
    final now = DateTime.now();
    final newValue = await showDatePicker(
      context: context,
      currentDate: now,
      initialDate: value ?? now,
      firstDate: now.subtract(const Duration(days: 1)),
      lastDate: now.add(Duration(days: Settings.instance.maxPickableFutureTimeInDays.value)),
      initialDatePickerMode: DatePickerMode.day,
      initialEntryMode: DatePickerEntryMode.calendar,
    );
    if (newValue == null) return value;
    return newValue;
  }

  @override
  Widget buildLabel(BuildContext context) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    String text = 'Elegir fecha';
    if (value != null) {
      text = DateFormat(DateFormat.ABBR_MONTH_WEEKDAY_DAY).format(value!);
      if (value!.isAfter(today)) {
        final days = value!.difference(today).inDays;
        if (days == 1) {
          text += ' (mañana)';
        } else {
          text += ' (en $days días)';
        }
      } else if (today.isAfter(value!)) {
        final days = today.difference(value!).inDays;
        text += ' (hace $days ${days > 1 ? 'días' : 'día'})';
      }
    }

    return Text(text);
  }
}
