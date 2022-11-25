import 'package:equipment_booking_app/util/api.dart';

Future<String> requestFutureActionId() async {
  return await apiFetchGet('/request_future_action_id');
}
