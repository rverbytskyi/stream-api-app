package com.streamapiapp;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.streamapiapp.modules.HTTPStreamModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class StreamApiAppPackages implements ReactPackage {
  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }

  @Override
  public List<NativeModule> createNativeModules(
    ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();

    modules.add(new HTTPStreamModule(reactContext));

    return modules;
  }
}
