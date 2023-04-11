//
//  RCTHTTPStreamCallbackModule.m
//  StreamApiApp
//
//  Created by Roman Verbytskyi on 07.04.2023.
//

#import <Foundation/Foundation.h>
#import "RCTHTTPStreamCallbackModule.h"
#import "HTTPStream.h"

@implementation RCTHTTPStreamCallbackModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(request:(NSString *)requestId urlString:(NSString *)urlString method:(NSString *)method headers:(NSDictionary *)headers body:(NSDictionary *)body receivedData:(RCTResponseSenderBlock)callback)
{
  HTTPStream *stream = [[HTTPStream alloc] initWithUrlString:urlString method:method headers:headers];
  
  NSData *bodyData = [self getBody:body];
  
  if (bodyData != nil) {
    [stream.request setHTTPBody:bodyData];
  }
  
  NSURLSessionDataTask *dataTask = [stream.session dataTaskWithRequest:stream.request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
    NSString *dataString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    
    if (error) {
      callback(@[dataString]);
      
      [dataTask cancel];
    } else {
      NSLog(@"Response: %@", data);
      
      callback(@[dataString]);
      
      NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
//      if (httpResponse.statusCode != 200) {
//        callback(@[dataString]);
//
//        [dataTask cancel];
//      }
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

@end
