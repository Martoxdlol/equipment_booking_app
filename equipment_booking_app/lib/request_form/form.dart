import 'dart:async';
import 'dart:convert';

import 'package:adaptative_modals/adaptative_modals.dart';
import 'package:equipment_booking_app/auth/auth.dart';
import 'package:equipment_booking_app/components/bigger_text_button.dart';
import 'package:equipment_booking_app/components/bottom_toolbar.dart';
import 'package:equipment_booking_app/components/date_selector.dart';
import 'package:equipment_booking_app/components/dropdown_selectors.dart';
import 'package:equipment_booking_app/components/equipment_picker.dart';
import 'package:equipment_booking_app/components/modal_appbar.dart';
import 'package:equipment_booking_app/components/modal_scaffold.dart';
import 'package:equipment_booking_app/components/row_or_column.dart';
import 'package:equipment_booking_app/components/duration_picker.dart';
import 'package:equipment_booking_app/components/week_recurrency_picker.dart';
import 'package:equipment_booking_app/util/api.dart';
import 'package:server/prisma_client.dart';
import 'package:shared/internationalization.dart';
import 'package:shared/models.dart' show EquipmentRequestEquipment;
// import 'package:shared/models.dart';
import 'package:shared/settings.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

class RequestFormPageBody extends HookWidget {
  const RequestFormPageBody(
      {super.key,
      required this.child,
      required this.action,
      required this.actionEnabled,
      required this.actionName,
      required this.hasBeenModified});
  final Widget child;
  final String actionName;
  final void Function() action;
  final bool actionEnabled;
  final bool hasBeenModified;

  @override
  Widget build(BuildContext context) {
    return ModalScaffold(
      appbar: const ModalAppBar(title: 'Nuevo pedido'),
      bottomToolbar: BottomToolbar(
        left: [
          BiggerTextButton(
            text: const Icon(
              Icons.delete_forever,
              color: Colors.black,
            ),
            onPressed: () {},
          ),
        ],
        right: [
          BiggerTextButton(
            text: const Text("Cancelar"),
            color: const Color.fromRGBO(120, 120, 120, 1),
            onPressed: () async {
              if (hasBeenModified && !await confirm(context, title: 'Seguro desea cancelar', body: 'Se perderan los cambios al pedido')) {
                return;
              }

              Navigator.of(context).pop();
            },
          ),
          BiggerTextButton(
            text: Text(actionName),
            onPressed: action,
            enabled: actionEnabled,
          ),
        ],
      ),
      child: child,
    );
  }
}

Future<bool> confirm(BuildContext context, {required String title, required String body}) {
  final completer = Completer<bool>();
  showDialog<void>(
    context: context,
    barrierDismissible: false, // user must tap button!
    builder: (BuildContext context) {
      return WillPopScope(
        onWillPop: () async {
          completer.complete(false);
          return true;
        },
        child: AlertDialog(
          title: Text(title),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text(body),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Cancelar'),
              onPressed: () {
                completer.complete(false);
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Aceptar'),
              onPressed: () {
                completer.complete(true);
                Navigator.of(context).pop();
              },
            ),
          ],
        ),
      );
    },
  );
  return completer.future;
}

class FormPart1 extends HookWidget {
  const FormPart1({super.key});

  @override
  Widget build(BuildContext context) {
    final defaultLocation = Settings.instance.locations[0].value;
    final defaultUser = Auth.instance.user;

    final location = useState<String?>(defaultLocation);
    final requestedBy = useState<User?>(defaultUser);
    final date = useState<DateTime?>(null);
    final notes = useState<String>('');
    final timeRange = useState<DurationRange?>(null);
    final makeRecurrentOnDaysOfWeeks = useState<List<DateTime>?>(null);
    final equipment = useState<EquipmentRequestEquipment?>(null);

    bool isCompleted() {
      final conditions = [
        equipment.value != null,
        timeRange.value != null,
        date.value != null,
        location.value != null,
        requestedBy.value != null,
      ];
      for (final condition in conditions) {
        if (condition == false) return false;
      }
      return true;
    }

    final actionIsSave = equipment.value != null;
    final actionName = actionIsSave ? 'Guardar pedido' : 'Elegir equipamiento';
    final actionEnabled = actionIsSave ? isCompleted() : true;

    bool hasBeenModified() {
      final conditions = [
        equipment.value == null,
        timeRange.value == null,
        date.value == null,
        location.value == defaultLocation,
        requestedBy.value == defaultUser,
      ];
      for (final condition in conditions) {
        if (condition == false) return true;
      }
      return false;
    }

    return RequestFormPageBody(
      hasBeenModified: hasBeenModified(),
      action: () async {
        if (actionIsSave) {
          if (!isCompleted()) return;
          final timeStart = date.value!.add(timeRange.value!.start);
          final timeEnd = date.value!.add(timeRange.value!.end);

          final request = EquipmentRequest(
            id: 0,
            notes: notes.value,
            requester_id: requestedBy.value!.id,
            time_end: timeEnd,
            time_start: timeStart,
          );

          final resultJson = await apiFetchPost('/request', {
            ...request.toJson(),
            "equipment": equipment.value?.toJson(),
          });

          showDialog(
            context: context,
            builder: (context) => AlertDialog(
              content: Text(jsonEncode(resultJson)),
            ),
          );
        } else {
          EquipmentPicker.show(context, equipment.value).then((value) => equipment.value = value);
        }
      },
      actionEnabled: actionEnabled,
      actionName: actionName,
      child: Form(
        child: Column(
          children: [
            UserSelect(
              onChange: (user) => requestedBy.value = user,
              value: requestedBy.value,
            ),
            LocationSelect(onChange: (value) => location.value = value, value: defaultLocation),
            TextFormField(
              decoration: InputDecoration(label: Text(appStrings.notes.get), floatingLabelBehavior: FloatingLabelBehavior.always),
              minLines: 2,
              maxLines: 5,
              onChanged: (value) => notes.value = value,
            ),
            RowOrColumn(gap: 12, children: [
              DatePicker(
                label: 'Fecha',
                onChange: (newDate) {
                  if (newDate != date.value) {
                    makeRecurrentOnDaysOfWeeks.value = null;
                  }
                  date.value = newDate;
                },
                value: date.value,
              ),
              DurationRangePicker(
                onChange: (value) => timeRange.value = value,
                value: timeRange.value,
                label: 'Horario',
              ),
            ]),
            WeekRecurrencyPicker(
              onChange: (value) => makeRecurrentOnDaysOfWeeks.value = value,
              initialDate: date.value,
              value: makeRecurrentOnDaysOfWeeks.value,
            ),
            EquipmentPicker(
              onChange: (value) => equipment.value = value,
              value: equipment.value,
            )
          ],
        ),
      ),
    );
  }
}

void showRequestForm(BuildContext context) {
  Navigator.of(context).push(AdaptativeModalPageRoute(height: 524, width: 670, fullScreen: false, builder: (context) => const FormPart1()));
}
