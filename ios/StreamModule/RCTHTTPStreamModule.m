//
//  RCTHTTPStreamModule.m
//  StreamApiApp
//
//  Created by Roman Verbytskyi on 04.04.2023.
//

#import <Foundation/Foundation.h>
#import "RCTHTTPStreamModule.h"
#import "HTTPStream.h"

NSString *receivedDataChunkEventKey = @"RECEIVED_DATA_CHUNK";
NSString *receivedDataChunkEventName = @"receivedDataChunk";

NSString *transferDataFinishedEventKey = @"TRANSFER_DATA_FINISHED";
NSString *transferDataFinishedEventName = @"transferDataFinished";

// Bearer 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

@implementation RCTHTTPStreamModule
{
  bool hasListeners;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(request:(NSString *)requestId urlString:(NSString *)urlString method:(NSString *)method headers:(NSDictionary *)headers body:(NSDictionary *)body)
{
  HTTPStream *stream = [[HTTPStream alloc] initWithUrlString:urlString method:method headers:headers];
  
  NSDictionary *eventsNames = [self getEventsNames:requestId];
  
  NSData *bodyData = [self getBody:body];
  
  if (bodyData != nil) {
    [stream.request setHTTPBody:bodyData];
  }
  
  NSURLSessionDataTask *dataTask = [stream.session dataTaskWithRequest:stream.request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
    NSString *dataString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    
    if (error) {
      [self receivedData:[eventsNames objectForKey:transferDataFinishedEventKey] data:dataString];
    } else {
      NSLog(@"Response: %@", data);
      
      [self receivedData:[eventsNames objectForKey:receivedDataChunkEventKey] data:dataString];
      
      NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
      if (httpResponse.statusCode != 200) {
        [self receivedData:[eventsNames objectForKey:transferDataFinishedEventKey] data:dataString];
        
        [dataTask cancel];
      }
    }
  }];
  
  [dataTask resume];
}

-(NSData *)getBody:(NSDictionary *)body
{
  if (body == nil) {
    return nil;
  }
  
  NSError *error;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:body
                                                     options:NSJSONWritingPrettyPrinted
                                                       error:&error];
  
  if (!jsonData) {
    NSLog(@"Error creating JSON data: %@", error);
    return nil;
  } else {
    return jsonData;
  }
}

RCT_EXPORT_METHOD(getEventsNames:(NSString *)requestId resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSDictionary *events = [self getEventsNames:requestId];
  
  resolve(events);
}

-(NSDictionary *)getEventsNames:(NSString *)requestId
{
  NSString *customReceivedDataChunkEventName = [self getEventName:receivedDataChunkEventName requestId:requestId];
  NSString *customTransferDataFinishedEventName = [self getEventName:transferDataFinishedEventName requestId:requestId];
  
  return @{
    receivedDataChunkEventKey: customReceivedDataChunkEventName,
    transferDataFinishedEventKey: customTransferDataFinishedEventName
  };
}

// Will be called when this module's first listener is added.
-(void)startObserving {
  hasListeners = YES;
  // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
  hasListeners = NO;
  // Remove upstream listeners, stop unnecessary background tasks
}

-(NSString *)getEventName:(NSString *)eventType requestId:(NSString *)requestId
{
  return [NSString stringWithFormat:@"%@_%@", eventType, requestId];
}

- (void)receivedData:(NSString *)eventName data:(NSString *)data
{
  if (hasListeners) {
    [self sendEventWithName:eventName body:@{@"data": data}];
  }
}

// It is needed to overwrite "supportedEvents" method, even though returned events names are not corresponding to the actual ones since they are dynamic
- (NSArray<NSString *> *)supportedEvents {
    return @[@"Placeholder"];
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_queue_create("com.stream-listener.RCTHTTPStreamModule", DISPATCH_QUEUE_SERIAL);
}

@end

