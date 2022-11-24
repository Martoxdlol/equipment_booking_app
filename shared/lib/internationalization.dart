String appLanguage = 'es';

class LangString {
  const LangString({required this.english, this.spanish});
  final String english;
  final String? spanish;

  String get get {
    return lang(appLanguage);
  }

  String lang(String lang) {
    if (lang == 'es') return spanish ?? main;
    if (lang == 'en') return english;
    return main;
  }

  String get main => english;

  @override
  String toString() {
    return english;
  }
}

class Internationalization {
  const Internationalization();

  // Bottom nav
  final home = const LangString(english: 'Home', spanish: 'Inicio');
  final newRequest = const LangString(english: 'New request', spanish: 'Nuevo pedido');
  final resources = const LangString(english: 'Resources', spanish: 'Recursos');

  // Request form
  final notes = const LangString(english: 'Notes', spanish: 'Notas');
}

const appStrings = Internationalization();
