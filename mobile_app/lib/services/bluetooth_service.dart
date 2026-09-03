import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class SmartwatchBluetoothService extends ChangeNotifier {
  bool isScanning = false;
  bool isConnected = false;
  String? connectedDeviceName;
  int? currentHeartRate;
  List<ScanResult> scanResults = [];

  StreamSubscription? _scanSub;
  StreamSubscription? _hrValueSub;
  BluetoothDevice? _connectedDevice;

  void startScan() async {
    scanResults.clear();
    isScanning = true;
    notifyListeners();

    try {
      await FlutterBluePlus.startScan(
        timeout: const Duration(seconds: 15),
        withServices: [Guid("180D")], // Heart Rate Service UUID
      );

      _scanSub = FlutterBluePlus.scanResults.listen((results) {
        scanResults = results;
        notifyListeners();
      });
    } catch (e) {
      print('[FlutterBlue Error] $e');
    } finally {
      isScanning = false;
      notifyListeners();
    }
  }

  void stopScan() {
    FlutterBluePlus.stopScan();
    isScanning = false;
    notifyListeners();
  }

  Future<bool> connectToDevice(BluetoothDevice device) async {
    try {
      stopScan();
      await device.connect(timeout: const Duration(seconds: 10));
      _connectedDevice = device;
      connectedDeviceName = device.platformName.isNotEmpty
          ? device.platformName
          : 'Smartwatch (${device.remoteId})';
      isConnected = true;
      notifyListeners();

      await _discoverAndListenHeartRate(device);
      return true;
    } catch (e) {
      print('[BLE Connect Error] $e');
      isConnected = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> _discoverAndListenHeartRate(BluetoothDevice device) async {
    List<BluetoothService> services = await device.discoverServices();
    for (BluetoothService service in services) {
      if (service.uuid == Guid("180D")) { // Heart Rate Service
        for (BluetoothCharacteristic characteristic in service.characteristics) {
          if (characteristic.uuid == Guid("2A37")) { // Heart Rate Measurement Characteristic
            await characteristic.setNotifyValue(true);
            _hrValueSub = characteristic.onValueReceived.listen((value) {
              if (value.isNotEmpty) {
                int parsedHr = _parseHeartRateValue(value);
                currentHeartRate = parsedHr;
                notifyListeners();
              }
            });
          }
        }
      }
    }
  }

  int _parseHeartRateValue(List<int> data) {
    if (data.isEmpty) return 0;
    int flags = data[0];
    bool is16Bit = (flags & 0x01) != 0;
    if (is16Bit && data.length >= 3) {
      return data[1] + (data[2] << 8);
    } else if (data.length >= 2) {
      return data[1];
    }
    return 0;
  }

  void disconnect() async {
    _hrValueSub?.cancel();
    _scanSub?.cancel();
    if (_connectedDevice != null) {
      await _connectedDevice!.disconnect();
    }
    isConnected = false;
    connectedDeviceName = null;
    currentHeartRate = null;
    notifyListeners();
  }
}
