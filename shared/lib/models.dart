import 'package:json_model_builder/json_model_builder.dart';

// class EquipmentRequest extends ModelBuilder {
//   @override
//   Iterable<JsonType> get values => [requestedBy, location];

//   JsonString get requestedBy => jsonString('requested_by');

//   JsonString get location => jsonString('location');

//   JsonDateTime get timeStart => jsonDateTime('time_start');

//   JsonDateTime get timeEnd => jsonDateTime('time_end');

//   EquipmentRequestEquipment get equipment => jsonModel('equipment', EquipmentRequestEquipment.new);
// }

// class User extends ModelBuilder {
//   @override
//   Iterable<JsonType> get values => [name, id];

//   JsonString get name => jsonString('name');

//   JsonString get id => jsonString('id');
// }

class EquipmentType extends ModelBuilder {
  @override
  Iterable<JsonType> get values => [name, label, unicodeIcon];

  JsonString get name => jsonString('name');

  JsonString get label => jsonString('label');

  JsonString get unicodeIcon => jsonString('unicode_icon', '❔');
}

class EquipmentRequestEquipment extends ModelBuilder {
  @override
  Iterable<JsonType> get values => [quantityByTypeName];

  JsonMap<JsonInt> get quantityByTypeName => jsonMap('quantity_by_type_name', JsonInt.new);

  int quantityOf(String name) {
    return quantityByTypeName[name]?.value ?? 0;
  }

  void set(String name, int qty) {
    if (qty == 0) quantityByTypeName.remove(name);
    if (quantityByTypeName[name] == null) quantityByTypeName[name] = JsonInt();
    quantityByTypeName[name]!.value = qty;
  }

  int add(String name, int qty) {
    final newQty = quantityOf(name) + qty;
    if (quantityByTypeName[name] == null) quantityByTypeName[name] = JsonInt();
    quantityByTypeName[name]!.value = newQty;
    return newQty;
  }
}

// class Session extends ModelBuilder {
//   Session(super.source);

//   @override
//   Iterable<JsonType> get values => [id, profile];

//   JsonString get id => jsonString('id');

//   User get profile => jsonModel<User>('profile', User.new);

//   /// Session singleton instance only used in client
//   static Session instance = Session({});
// }

class AuthConfig extends ModelBuilder {
  @override
  Iterable<JsonType> get values => [type];

  JsonString get type => jsonString('type'); // oauth, user/pass
}
