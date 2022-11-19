import 'package:shared/models.dart';
import 'package:json_model_builder/json_model_builder.dart';

class Settings extends ModelBuilder {
  @override
  Iterable<JsonType> get values => [];

  JsonString get appName => jsonString('app_name');

  JsonString get apiUrl => jsonString('apiUrl');

  JsonList<JsonInt> get durationRangeOptionsInMinutes => jsonList('duration_range_options_in_minutes', JsonInt.new);

  JsonInt get maxPickableFutureTimeInDays => jsonInt('max_pickable_future_time_in_days');

  JsonList<EquipmentType> get equipmentTypes => jsonList('equipment_types', EquipmentType.new);

  JsonList<JsonString> get locations => jsonList('locations', JsonString.new);

  JsonList<JsonInt> get weekViewShowDaysByIndex => jsonList('week_view_show_days_by_index', JsonInt.new);

  EquipmentType? getEquipmentTypeByName(String name) {
    final index = equipmentTypes.indexWhere((element) => element.name.value == name);
    if (index == -1) return null;
    return equipmentTypes[index];
  }

  static Settings instance = Settings()
    ..appName.set('App de pedidos')
    ..apiUrl.set('')
    ..durationRangeOptionsInMinutes.setFromJson([
      const Duration(hours: 7, minutes: 30).inMinutes,
      const Duration(hours: 8, minutes: 30).inMinutes,
      const Duration(hours: 9, minutes: 30).inMinutes,
      const Duration(hours: 10, minutes: 30).inMinutes,
      const Duration(hours: 11, minutes: 30).inMinutes,
      const Duration(hours: 12, minutes: 30).inMinutes,
      const Duration(hours: 13, minutes: 30).inMinutes,
      const Duration(hours: 14, minutes: 30).inMinutes,
      const Duration(hours: 15, minutes: 30).inMinutes,
      const Duration(hours: 16, minutes: 30).inMinutes,
    ])
    ..maxPickableFutureTimeInDays.set(365 * 2)
    ..equipmentTypes.setFromJson([
      (EquipmentType()
            ..label.set('Notebook')
            ..name.set('notebook')
            ..unicodeIcon.set('💻'))
          .toJson(),
      (EquipmentType()
            ..label.set('Mouse')
            ..name.set('mouse')
            ..unicodeIcon.set('🖱'))
          .toJson(),
      (EquipmentType()
            ..label.set('Power adapter')
            ..name.set('power_adapter')
            ..unicodeIcon.set('🔌'))
          .toJson(),
    ])
    ..locations.setFromJson([
      'No especificar',
      'Auditorio',
      'Aula 1',
      'Aula 2',
      'Aula 3',
      'Aula 4',
      'Aula 5',
      'Aula 6',
      'Patio',
      'Oficinas',
      'Taller (informática)',
      'Taller (metales)',
      'Taller (metrología)',
      'Taller (robótica)',
      'Taller (torneria)',
      'Taller (carpintería)',
      'Taller (pañol)',
      'Taller (neumática)',
      'Taller (electricidad)',
      'Taller (laboratorio)',
      'Taller (otro)',
    ])
    ..weekViewShowDaysByIndex.setFromJson([1, 2, 3, 4, 5]);
}
