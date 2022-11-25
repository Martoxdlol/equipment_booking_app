import 'package:equipment_booking_app/auth/auth.dart';
import 'package:equipment_booking_app/screens/home/home.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:page_transition/page_transition.dart';

class Login extends HookWidget {
  const Login({super.key});

  Widget buildContent(BuildContext context) {
    final height = MediaQuery.of(context).viewPadding.top;

    final usernameState = useState<String>('');
    final loadingState = useState<bool>(true);

    Future<void> init() async {
      final isSignedIn = await Auth.instance.localSignIn();
      if (isSignedIn) {
        // ignore: use_build_context_synchronously
        launchHomeScreen(context);
      } else {
        loadingState.value = false;
      }
    }

    Future<void> startAuth(BuildContext context, String username) async {
      loadingState.value = true;
      try {
        final authResult = await Auth.instance.signIn(context, username);

        if (authResult.status == AuthStatus.ok) {
          // ignore: use_build_context_synchronously
          launchHomeScreen(context);
        } else if (authResult.status == AuthStatus.error) {
          // ignore: use_build_context_synchronously
          print("Auth status error: ${authResult.error}");
          showAuthErrorDialog(context, authResult.error);
          loadingState.value = false;
        } else {
          loadingState.value = false;
        }
      } on Exception catch (e) {
        print("Exception trying to login");
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
                  Auth.instance.currentFlow?.closeAndCancel();
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

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      child: buildContent(context),
      onWillPop: () async {
        return false;
      },
    );
  }
}

void launchHomeScreen(BuildContext context) {
  Navigator.of(context).pushReplacement(
    PageTransition(
      type: PageTransitionType.fade,
      child: HomeScreen(),
    ),
  );
}
