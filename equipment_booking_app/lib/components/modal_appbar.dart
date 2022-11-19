import 'package:adaptative_modals/adaptative_modals.dart';
import 'package:flutter/material.dart';

class ModalAppBar extends StatelessWidget implements PreferredSizeWidget {
  const ModalAppBar({super.key, this.title = ''});
  final String title;

  @override
  Widget build(BuildContext context) {
    return AdaptativeModalAppBarWrapper(
      appbar: AppBar(
        backgroundColor: Colors.white,
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(
              Icons.close,
              color: Colors.black,
            ),
            tooltip: 'Close',
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
          const SizedBox(
            width: 10,
          )
        ],
        centerTitle: true,
        title: Text(
          title,
          style: const TextStyle(color: Colors.black),
        ),
        elevation: 1,
      ),
    );
  }

  @override
  Size get preferredSize => const Size(double.infinity, kToolbarHeight);
}
