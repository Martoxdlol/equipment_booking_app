import 'package:intl/intl.dart';

String dayNameByIndex(int index) {
  final sundayDate = DateTime.utc(2022, DateTime.july, 3);
  return DateFormat('EEEE').format(sundayDate.add(Duration(days: index)));
}
