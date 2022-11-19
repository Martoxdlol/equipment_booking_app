import 'dart:async';

import 'package:adaptative_modals/adaptative_modals.dart';
import 'package:equipment_booking_app/components/bigger_text_button.dart';
import 'package:equipment_booking_app/components/bottom_toolbar.dart';
import 'package:equipment_booking_app/components/elevated_click_picker.dart';
import 'package:equipment_booking_app/components/equipment_picker_form.dart';
import 'package:equipment_booking_app/components/modal_appbar.dart';
import 'package:equipment_booking_app/components/modal_scaffold.dart';
import 'package:shared/models.dart';
import 'package:shared/settings.dart';
import 'package:flutter/material.dart';
import 'package:json_model_builder/json_model_builder.dart';

class EquipmentPicker extends ElevatedClickPicker<EquipmentRequestEquipment> {
  const EquipmentPicker({super.key, String label = 'Elegir equipamiento', required super.onChange, required super.value})
      : super(label: label, showPicker: show, icon: const Icon(Icons.account_tree_outlined));

  static Future<EquipmentRequestEquipment?> show(BuildContext context, EquipmentRequestEquipment? value) {
    final completer = Completer<EquipmentRequestEquipment?>();

    final equipment = EquipmentRequestEquipment()..setFromJson(value?.toJson());

    Navigator.of(context).push(
      AdaptativeModalPageRoute(
        height: 524,
        width: 670,
        fullScreen: false,
        builder: (context) => ModalScaffold(
          appbar: const ModalAppBar(title: 'Elegir equipamiento'),
          bottomToolbar: BottomToolbar(
            right: [
              BiggerTextButton(
                text: const Text('Aceptar'),
                onPressed: () {
                  Navigator.of(context).pop();
                  final total =
                      equipment.quantityByTypeName.values.reduce((value, element) => JsonInt()..set(value.value + element.value)).value;
                  if (total == 0 || equipment.quantityByTypeName.keys.isEmpty) {
                    completer.complete(null);
                  } else {
                    completer.complete(equipment);
                  }
                },
              )
            ],
          ),
          child: EquipmentPickerForm(
            equipment: equipment,
          ),
        ),
      ),
    );
    return completer.future;
  }

  @override
  Widget buildLabel(BuildContext context) {
    final equipment = value;

    if (equipment != null) {
      final text = equipment.quantityByTypeName.entries.map<String>((e) {
        final type = Settings.instance.getEquipmentTypeByName(e.key);

        return "${type!.unicodeIcon.value} ${e.value.value}";
      }).join(' | ');
      return Padding(
        padding: EdgeInsets.only(left: 10),
        child: Text(
          text,
          style: const TextStyle(overflow: TextOverflow.ellipsis),
        ),
      );
    }
    return Text(label);
  }
}

class ItemQuantityChip extends StatelessWidget {
  const ItemQuantityChip({super.key, required this.quantity, required this.icon});
  final int quantity;
  final Widget icon;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 45,
      child: Stack(children: [
        Positioned(
          left: 2,
          top: 2,
          bottom: 2,
          child: icon,
        ),
        Positioned(
          right: 2,
          top: 2,
          bottom: 2,
          child: Text(quantity.toString()),
        ),
      ]),
    );
  }
}
