package com.streamapiapp.modules;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

public class HTTPStreamModule extends ReactContextBaseJavaModule {
  private final static String receivedDataChunkEventKey = "RECEIVED_DATA_CHUNK";
  private final static String receivedDataChunkEvent = "receivedDataChunk";
  private final static String transferDataFinishedEventKey = "TRANSFER_DATA_FINISHED";
  private final static String transferDataFinishedEvent = "transferDataFinished";
  private int listenerCount = 0;

  public HTTPStreamModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(receivedDataChunkEventKey, receivedDataChunkEvent);
    constants.put(transferDataFinishedEventKey, transferDataFinishedEvent);
    return constants;
  }

  @Override
  public String getName() {
    return "HTTPStreamModule";
  }

  private void sendEvent(ReactContext reactContext,
                         String eventName,
                         @Nullable WritableMap params) {
    if (listenerCount <= 0) {
      return;
    }

    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  private void onDataChunkReceived(String streamId, String dataString) {
    WritableMap data = Arguments.createMap();

    data.putString("streamId", streamId);
    data.putString("dataString", dataString);

    sendEvent(getReactApplicationContext(), receivedDataChunkEvent, data);
  }

  private void onTransferDataFinished(String streamId, String errorString) {
    WritableMap data = Arguments.createMap();

    data.putString("streamId", streamId);
    data.putString("errorString", errorString);

    sendEvent(getReactApplicationContext(), transferDataFinishedEvent, data);
  }

  @ReactMethod
  public void request(
    String streamId,
    String urlString,
    String method,
    ReadableMap headers,
    ReadableMap body
  ) {
    HTTPStream stream = new HTTPStream(
      urlString,
      method,
      headers,
      body,
      (String dataString) -> {
        onDataChunkReceived(streamId, dataString);
        return null;
      },
      (String errorString) -> {
        onTransferDataFinished(streamId, errorString);
        return null;
      });

    stream.makeRequest();
  }

  @ReactMethod
  public void addListener(String eventName) {
    listenerCount += 1;
  }

  @ReactMethod
  public void removeListeners(Integer count) {
    listenerCount -= count;
  }
}
