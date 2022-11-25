import 'package:server/api/util.dart';
import 'package:server/db.dart';
import 'package:server/prisma_client.dart';
import 'package:shared/errors.dart';
import 'package:shelf_plus/shelf_plus.dart';

/// This aims to link every write event made by the user to a future action
/// This mean that before pushing a new request, user must create a future action and then provide it to post request
/// This ensures that it will not duplicate requests (ex: confirmation button clicked two times, some network error, etc.)

Future<FutureActionEvent> createFutureAction(User user, String type, [String? details]) async {
  return await prisma.futureActionEvent.create(
    data: FutureActionEventCreateInput(
      type: type,
      details: PrismaUnion(zero: details),
      user_email: user.email,
      user_id: user.id,
    ),
  );
}

Future<FutureActionEvent?> getFutureAction(int id, String userId) async {
  return await prisma.futureActionEvent.findFirst(
    where: FutureActionEventWhereInput(
      id: IntFilter(equals: id),
      user_id: StringFilter(equals: userId),
    ),
  );
}

Future<bool> completeFutureAction(int id) async {
  final result = await prisma.futureActionEvent.update(
    data: FutureActionEventUpdateInput(created_at: DateTimeFieldUpdateOperationsInput(set$: DateTime.now())),
    where: FutureActionEventWhereUniqueInput(id: id),
  );

  return result != null;
}

void futureActions(RouterPlus app) {
  app.get(
    '/,',
    handlerWrapperAuthtenticated((request, session) async {
      final user = await prisma.user.findUnique(where: UserWhereUniqueInput(id: session.user_id));

      if (user == null) {
        throw InternalError("authenticated but user not found");
      }

      final id = (await createFutureAction(user, 'created by user')).id;
      return jsonResponse(id);
    }),
  );
}
