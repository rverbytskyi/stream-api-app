package com.streamapiapp.modules;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.streamapiapp.utils.MapUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.function.Function;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;
import okhttp3.sse.EventSource;
import okhttp3.sse.EventSourceListener;
import okhttp3.sse.EventSources;

public class HTTPStream {
  private final Function<String, Void> onDataChunkReceived;

  private final OkHttpClient client;

  private final Request request;

  public HTTPStream(
    String urlString,
    String method,
    ReadableMap headers,
    ReadableMap body,
    Function<String, Void> onDataChunkReceived,
    Function<String, Void> onDataTransferFinished
  ) {
    this.onDataChunkReceived = onDataChunkReceived;

    Headers requestHeaders = getHeaders(headers);

    RequestBody requestBody = getBody(body);

    this.client = new OkHttpClient();

    switch (method) {
      case "GET": {
        this.request = new Request.Builder()
          .url(urlString)
          .headers(requestHeaders)
          .get()
          .build();
        break;
      }
      case "DELETE": {
        this.request = new Request.Builder()
          .url(urlString)
          .headers(requestHeaders)
          .delete(requestBody)
          .build();
        break;
      }
      case "HEAD": {
        this.request = new Request.Builder()
          .url(urlString)
          .headers(requestHeaders)
          .head()
          .build();
        break;
      }
      case "PUT": {
        this.request = new Request.Builder()
          .url(urlString)
          .headers(requestHeaders)
          .put(requestBody)
          .build();
        break;
      }
      case "PATCH": {
        this.request = new Request.Builder()
          .url(urlString)
          .headers(requestHeaders)
          .patch(requestBody)
          .build();
        break;
      }
      case "POST":
      default: {
        this.request = new Request.Builder()
          .url(urlString)
          .headers(requestHeaders)
          .addHeader("Accept", "text/event-stream")
          .post(requestBody)
          .build();
        break;
      }
    }

    EventSourceListener eventSourceListener = new EventSourceListener() {
      @Override
      public void onEvent(@NonNull EventSource eventSource, @Nullable String id, @Nullable String type, @NonNull String data) {
        sendReceivedData(data);
      }

      @Override
      public void onFailure(@NonNull EventSource eventSource, @Nullable Throwable t, @Nullable Response response) {
        if (response != null) {
          ResponseBody responseBody = response.body();

          try {
            onDataTransferFinished.apply(responseBody != null ? responseBody.string() : response.toString());
          } catch (IOException e) {
            onDataTransferFinished.apply(response.toString());
          }
        }
      }
    };

    EventSources.createFactory(this.client).newEventSource(this.request, eventSourceListener);
  }

  private Headers getHeaders(ReadableMap headers) {
    Headers.Builder headersBuilder = new Headers.Builder();
    if (headers != null) {
      // iterate over the keys in the ReadableMap and add them as headers
      ReadableMapKeySetIterator iterator = headers.keySetIterator();
      while (iterator.hasNextKey()) {
        String key = iterator.nextKey();
        String value = headers.getString(key);
        if (value != null) {
          headersBuilder.add(key, value);
        }
      }
    }
    return headersBuilder.build();
  }

  private RequestBody getBody(@Nullable ReadableMap body) {
    try {
      MediaType mediaType = MediaType.parse("application/json; charset=utf-8");

      if (body == null) {
        return RequestBody.create("{}", mediaType);
      }

      JSONObject jsonObject = MapUtils.convertMapToJson(body);

      return RequestBody.create(jsonObject.toString(), mediaType);
    } catch (JSONException e) {
      throw new RuntimeException(e);
    }
  }

  private String[] splitDataString(@NonNull String dataString) {
    return dataString.split("//n");
  }

  private void sendReceivedData(String data) {
    String[] splitData = splitDataString(data);

    for (String dataString : splitData) {
      this.onDataChunkReceived.apply(dataString);
    }
  }

  public void makeRequest() {
    this.client.newCall(this.request).enqueue(new Callback() {
      @Override
      public void onFailure(@NonNull Call call, @NonNull IOException e) {}

      @Override
      public void onResponse(@NonNull Call call, @NonNull Response response) {}
    });
  }
}
