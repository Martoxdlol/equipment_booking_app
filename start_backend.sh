#!/bin/sh
cd server && dart run orm generate && dart run orm db push && dart run build_runner build && dart run --enable-vm-service bin/server.dart 