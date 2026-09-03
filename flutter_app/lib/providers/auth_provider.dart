import 'package:flutter/foundation.dart';

class UserProfile {
  final String id;
  final String name;
  final String email;
  final String role;
  final String avatarUrl;

  UserProfile({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.avatarUrl,
  });
}

class AuthProvider extends ChangeNotifier {
  UserProfile? _user = UserProfile(
    id: 'user_01',
    name: 'Dr. Alex Vance',
    email: 'alex.vance@neurorest.health',
    role: 'ICU Shift Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=250&auto=format&fit=crop',
  );

  UserProfile? get user => _user;
  bool get isAuthenticated => _user != null;

  Future<bool> login(String email, String password) async {
    _user = UserProfile(
      id: 'user_${DateTime.now().millisecondsSinceEpoch}',
      name: email.contains('@') ? email.split('@')[0].toUpperCase() : 'Dr. Alex Vance',
      email: email,
      role: 'Occupational Specialist',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=250&auto=format&fit=crop',
    );
    notifyListeners();
    return true;
  }

  Future<bool> signup(String name, String email, String role, String password) async {
    _user = UserProfile(
      id: 'user_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      email: email,
      role: role,
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=250&auto=format&fit=crop',
    );
    notifyListeners();
    return true;
  }

  void logout() {
    _user = null;
    notifyListeners();
  }
}
