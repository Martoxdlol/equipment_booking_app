import 'package:equipment_booking_app/auth/auth.dart';
import 'package:equipment_booking_app/components/bottom_nav.dart';
import 'package:equipment_booking_app/components/weekly_grid.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:shared/models.dart';

class Login extends HookWidget {
  const Login({super.key});

  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).viewPadding.top;

    final authFlowState = useState<AuthFlow?>(null);
    final usernameState = useState<String>('');
    final loadingState = useState<bool>(true);

    Future<void> init() async {
      loadingState.value = false;
    }

    Future<void> startAuth(BuildContext context, String username) async {
      final auth = AuthFlow.detectPlatform(context);
      loadingState.value = true;
      authFlowState.value = auth;
      final navigator = Navigator.of(context);
      try {
        final authResult = await auth.authtenticate(username);

        if (authResult.status == AuthStatus.ok) {
          Session.instance = authResult.session!;
          navigator.pushReplacement(
            CupertinoPageRoute(
              builder: (context) {
                return Scaffold(
                  appBar: AppBar(),
                  body: Container(
                    child: WeekView(),
                  ),
                  bottomNavigationBar: const BottomNav(),
                );
              },
            ),
          );
        } else if (authResult.status == AuthStatus.error) {
          // ignore: use_build_context_synchronously
          showAuthErrorDialog(context, authResult.error);
        }
        loadingState.value = false;
      } on Exception catch (e) {
        showAuthErrorDialog(context, e);
        loadingState.value = false;
      }
    }

    useEffect(() {
      init();
      return null;
    }, []);

    if (loadingState.value) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const CircularProgressIndicator(),
              TextButton(
                onPressed: () {
                  authFlowState.value?.closeAndCancel();
                },
                child: const Padding(
                  padding: EdgeInsets.all(12),
                  child: Text("Cancelar"),
                ),
              )
            ],
          ),
        ),
      );
    }

    return Scaffold(
      body: Form(
        child: Center(
          child: Column(
            children: [
              SizedBox(height: height),
              Expanded(
                child: SizedBox(
                  width: 500,
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: TextFormField(
                        onFieldSubmitted: (value) => startAuth(context, value),
                        onChanged: (value) => usernameState.value = value,
                        decoration: const InputDecoration(
                          filled: true,
                          floatingLabelBehavior: FloatingLabelBehavior.always,
                          hintText: "usuario@servidor.com",
                          label: Text("Nombre de usuario"),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    const Expanded(child: SizedBox()),
                    ElevatedButton(
                      onPressed: () => startAuth(context, usernameState.value),
                      child: const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 25, vertical: 15),
                        child: Text("Continuar"),
                      ),
                    )
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
