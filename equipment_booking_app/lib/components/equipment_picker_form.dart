// class EquipmentPickerForm extends SateFu

import 'package:shared/models.dart';
import 'package:shared/settings.dart';
import 'package:flutter/material.dart';

class EquipmentPickerForm extends StatefulWidget {
  const EquipmentPickerForm({super.key, required this.equipment});
  final EquipmentRequestEquipment equipment;

  @override
  // ignore: no_logic_in_create_state
  State<EquipmentPickerForm> createState() => _EquipmentPickerFormState(equipment: equipment);
}

class _EquipmentPickerFormState extends State<EquipmentPickerForm> {
  _EquipmentPickerFormState({required this.equipment});
  final EquipmentRequestEquipment equipment;

  void alterValue(String name, int qty) {
    setState(() {
      equipment.set(name, qty);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: Settings.instance.equipmentTypes
          .map<Widget>(
            (type) => EquipmentItemPicker(
              emoji: Text(type.unicodeIcon.value),
              label: type.label.value,
              name: type.name.value,
              maxQuantity: 100,
              onChanged: alterValue,
              quantity: equipment.quantityOf(type.name.value),
            ),
          )
          .toList(),
    );
  }
}

class EquipmentItemPicker extends StatelessWidget {
  const EquipmentItemPicker(
      {super.key,
      required this.name,
      required this.label,
      required this.emoji,
      required this.maxQuantity,
      required this.quantity,
      required this.onChanged});
  final String name;
  final String label;
  final Widget emoji;
  final int maxQuantity;
  final int quantity;
  final void Function(String name, int qty) onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsets.only(left: 12),
            child: Text(
              label,
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
          Row(
            children: [
              Padding(
                padding: EdgeInsets.only(left: 12),
                child: Align(alignment: Alignment.bottomRight, child: emoji),
              ),
              Expanded(
                child: Slider(
                  min: 0,
                  max: maxQuantity.toDouble(),
                  value: quantity.toDouble(),
                  onChanged: (qty) => onChanged(name, qty.toInt()),
                  label: 'Cantidad',
                ),
              ),
              InkWell(
                onTap: quantity > 0
                    ? () {
                        onChanged(name, quantity - 1);
                      }
                    : null,
                borderRadius: BorderRadius.circular(1000),
                child: Padding(
                  padding: EdgeInsets.all(4),
                  child: Icon(
                    Icons.remove_outlined,
                    color: Color.fromRGBO(0, 0, 0, quantity > 0 ? 1 : 0.3),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Align(
                  alignment: Alignment.topLeft,
                  child: Text(
                    quantity.toString(),
                    style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w500),
                  ),
                ),
              ),
              InkWell(
                onTap: quantity < maxQuantity
                    ? () {
                        onChanged(name, quantity + 1);
                      }
                    : null,
                borderRadius: BorderRadius.circular(1000),
                child: Padding(
                  padding: EdgeInsets.all(4),
                  child: Icon(
                    Icons.add,
                    color: Color.fromRGBO(0, 0, 0, quantity < maxQuantity ? 1 : 0.3),
                  ),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}

// EquipmentRequestEquipment
