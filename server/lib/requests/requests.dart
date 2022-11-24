import 'dart:convert';

import 'package:orm/orm.dart';
import 'package:server/api/util.dart';
import 'package:server/db.dart';
import 'package:server/prisma_client.dart';
import 'package:shared/models.dart' show EquipmentRequestEquipment;
import 'package:shelf_plus/shelf_plus.dart';

void requests(RouterPlus app) {
  // app.get('/requests', handlerWrapperAuthtenticated((request, session) {
  //   // prisma.equipmentRequest.findMany(where: );
  // }));

  app.post('/request', handlerWrapperAuthtenticated((request, session) async {
    final data = await request.body.asJson;
    final equipmentRequestBase = EquipmentRequest.fromJson(data);

    final equipment = EquipmentRequestEquipment()..setFromJson(data['equipment']);

    final prisma = PrismaClient();

    print("New request");

    final result = await prisma.$transaction<Response>((prisma) async {
      print("Start creation");
      final equipmentRequest = await prisma.equipmentRequest.create(
        data: EquipmentRequestCreateInput(
          requested_by: UserCreateNestedOneWithoutRequestsInput(connect: UserWhereUniqueInput(id: equipmentRequestBase.requester_id)),
          time_end: equipmentRequestBase.time_end,
          time_start: equipmentRequestBase.time_start,
        ),
      );

      print("Request created $equipmentRequest");

      final requestItems = equipment.quantityByTypeName.keys.map<RequestItem>((key) {
        final quantity = equipment.quantityOf(key);
        return RequestItem(id: 0, request_id: equipmentRequest.id, quantity: quantity, asset_type_id: key);
      });

      final futures = <Future<RequestItem>>[];
      // for (final item in requestItems) {
      //   futures.add(prisma.requestItem.create(
      //     data: RequestItemCreateInput(
      //       asset_type: AssetTypeCreateNestedOneWithoutRequestItemInput(
      //         connect: AssetTypeWhereUniqueInput(id: item.asset_type_id),
      //       ),
      //       quantity: item.quantity,
      //       request: EquipmentRequestCreateNestedOneWithoutItemsInput(
      //         connect: EquipmentRequestWhereUniqueInput(id: equipmentRequest.id),
      //       ),
      //     ),
      //   ));
      // }

      print("Items futures created $futures");

      // final requsetItemsList = await Future.wait<RequestItem>(futures);

      // print("Items created $requsetItemsList");

      final data = {
        ...equipmentRequest.toJson(),
        // "equipment": requsetItemsList.toList().map((e) => e.toJson()),
      };

      print(data);

      return jsonResponse(data);
    }, TransactionOptions(maxWait: 8000, timeout: 12000));

    return result;
  }));
}
