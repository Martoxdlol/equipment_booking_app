import 'package:equipment_booking_app/components/elevated_click_picker.dart';
import 'package:shared/settings.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class WeekRecurrencyPicker extends ElevatedClickPicker<List<DateTime>> {
  WeekRecurrencyPicker(
      {super.key, String label = 'Pedido recurrente semanal: no', required super.onChange, required super.value, required this.initialDate})
      : super(
            label: label,
            showPicker: (ctx, value) {
              return show(ctx, value, initialDate);
            },
            icon: const Icon(Icons.date_range),
            waringOnIncomplete: false);

  final DateTime? initialDate;

  static Future<List<DateTime>?> show(BuildContext context, List<DateTime>? value, DateTime? initialDate) async {
    final now = DateTime.now();
    if (initialDate == null) return value;

    final firstNextWeekDay = DateTime(initialDate.year, initialDate.month, initialDate.day).add(const Duration(days: 7));

    final lastDate = await showDatePicker(
      helpText: 'Hasta que fecha',
      cancelText: 'CANCELAR',
      context: context,
      currentDate: initialDate,
      initialDate: value == null ? initialDate : value.last,
      firstDate: initialDate,
      lastDate: now.add(Duration(days: Settings.instance.maxPickableFutureTimeInDays.value)),
      initialDatePickerMode: DatePickerMode.day,
      initialEntryMode: DatePickerEntryMode.calendar,
    );

    if (lastDate == null) return value;

    if (lastDate.millisecondsSinceEpoch < firstNextWeekDay.millisecondsSinceEpoch) return null;

    final List<DateTime> weeks = [];

    DateTime week = firstNextWeekDay;
    while (week.millisecondsSinceEpoch <= lastDate.millisecondsSinceEpoch) {
      weeks.add(week);
      week = week.add(const Duration(days: 7));
    }

    if (weeks.isEmpty) return null;

    return weeks;
  }

  @override
  Widget buildLabel(BuildContext context) {
    if (value != null && initialDate != null) {
      final line1 = "Todos los ${DateFormat('EEEE').format(initialDate!)} por ${value!.length + 1} semanas";

      final line2Text = Text([initialDate!, ...value!].map<String>((date) {
        return DateFormat('dd MMM').format(date);
      }).join(' | '));

      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [Text(line1), line2Text],
      );
    }

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label),
        if (initialDate == null) ...[
          const SizedBox(
            width: 10,
          ),
          const Text('(debés elegir la fecha primero)', style: TextStyle(color: Color.fromRGBO(160, 160, 160, 1)))
        ]
      ],
    );
  }
}
