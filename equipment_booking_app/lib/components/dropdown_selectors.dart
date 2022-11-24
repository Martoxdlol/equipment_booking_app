import 'package:dropdown_search/dropdown_search.dart';
import 'package:server/prisma_client.dart';
import 'package:shared/settings.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

class UserSelect extends HookWidget {
  const UserSelect({super.key, required this.onChange, required this.value});

  final void Function(User? value) onChange;
  final User? value;

  @override
  Widget build(BuildContext context) {
    return DropdownSearch<User>(
      compareFn: (item1, item2) => item1.id == item1.id,
      popupProps: const PopupProps.menu(
        menuProps: MenuProps(animationDuration: Duration.zero),
        searchDelay: Duration.zero,
        searchFieldProps:
            TextFieldProps(decoration: InputDecoration(border: UnderlineInputBorder(), label: Text('Buscar usuario')), autofocus: true),
        showSearchBox: true,
        showSelectedItems: true,
        // disabledItemFn: (String s) => s.startsWith('I'),
      ),
      asyncItems: (String filter) async => <User>[
        // User()..setFromJson({'name': 'Tomás Cichero', 'id': 'tcichero'}),
        // User()..setFromJson({'name': 'Facundo Totaro', 'id': 'ftotaro'}),
      ],
      itemAsString: (User u) => u.name,
      onChanged: (User? data) => onChange(data),
      dropdownDecoratorProps: const DropDownDecoratorProps(
        dropdownSearchDecoration: InputDecoration(
          labelText: "Pedido por",
          hintText: "Seleccionar usuario",
        ),
      ),
      selectedItem: value,
    );
  }
}

class LocationSelect extends HookWidget {
  const LocationSelect({super.key, required this.onChange, required this.value});

  final void Function(String? value) onChange;
  final String value;

  @override
  Widget build(BuildContext context) {
    return DropdownSearch<String>(
      popupProps: const PopupProps.menu(
        menuProps: MenuProps(animationDuration: Duration.zero),
        searchDelay: Duration.zero,
        searchFieldProps:
            TextFieldProps(decoration: InputDecoration(border: UnderlineInputBorder(), label: Text('Buscar ubicacion')), autofocus: true),
        showSearchBox: true,
        showSelectedItems: true,
        // disabledItemFn: (String s) => s.startsWith('I'),
      ),
      asyncItems: (String filter) async => Settings.instance.locations.map<String>((element) => element.value).toList(),
      itemAsString: (String u) => u,
      onChanged: (String? data) => onChange(data),
      dropdownDecoratorProps: const DropDownDecoratorProps(
        dropdownSearchDecoration: InputDecoration(
          labelText: "Donde se va a usar",
          hintText: "Seleccionar ubicación",
        ),
      ),
      selectedItem: value,
    );
  }
}
