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
NSString *receivedDataChunkEvent = @"receivedDataChunk";

NSString *transferDataFinishedEventKey = @"TRANSFER_DATA_FINISHED";
NSString *transferDataFinishedEvent = @"transferDataFinished";

// Bearer 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

@implementation RCTHTTPStreamModule
{
  bool hasListeners;
}

RCT_EXPORT_MODULE();

+(BOOL)requiresMainQueueSetup {
  return NO;
}

-(NSDictionary *)constantsToExport
{
 return @{
   receivedDataChunkEventKey: receivedDataChunkEvent,
   transferDataFinishedEventKey: transferDataFinishedEvent,
 };
}

RCT_EXPORT_METHOD(request:(NSString *)streamId urlString:(NSString *)urlString method:(NSString *)method headers:(NSDictionary *)headers body:(NSDictionary *)body)
{
  HTTPStream *stream = [[HTTPStream alloc] initWithUrlString:urlString method:method headers:headers body:body onDataChunkReceived:^(NSString *dataString) {
    NSDictionary *data = @{@"dataString": dataString, @"streamId": streamId};
    
    [self receivedData:receivedDataChunkEvent data:data];
  } onDataTransferFinished:^(NSString *errorString) {
    NSDictionary *data = @{@"errorString": errorString, @"streamId": streamId};
    
    [self receivedData:transferDataFinishedEvent data:data];
  }];
  
  [stream makeRequest];
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

- (void)receivedData:(NSString *)eventName data:(NSDictionary *)data
{
  if (hasListeners) {
    [self sendEventWithName:eventName body:data];
  }
}

// It is needed to overwrite "supportedEvents" method, even though returned events names are not corresponding to the actual ones since they are dynamic
- (NSArray<NSString *> *)supportedEvents {
    return @[receivedDataChunkEvent, transferDataFinishedEvent];
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_queue_create("com.stream-listener.RCTHTTPStreamModule", DISPATCH_QUEUE_SERIAL);
}

@end

