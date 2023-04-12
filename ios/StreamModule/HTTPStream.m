//
//  HTTPStream.m
//  StreamApiApp
//
//  Created by Roman Verbytskyi on 04.04.2023.
//

#import <Foundation/Foundation.h>
#import "HTTPStream.h"

@implementation HTTPStream

-(instancetype)initWithUrlString:(NSString *)urlString method:(NSString *)method headers:(NSDictionary *)headers body:(NSDictionary *)body onDataChunkReceived:(void (^)(NSString *data))onDataChunkReceived onDataTransferFinished:(void (^)(NSString *errorString))onDataTransferFinished
{
  self = [super init];
  
  self.onDataChunkReceived = ^(NSString *data) {
    if (onDataChunkReceived != NULL) {
      onDataChunkReceived(data);
    }
  };
  
  self.onDataTransferFinished = ^(NSString *errorString) {
    if (onDataTransferFinished != NULL) {
      onDataTransferFinished(errorString);
    }
  };
  
  NSURL *url = [NSURL URLWithString:urlString];
  
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
  
  [request setHTTPMethod:method];
  
  for (NSString *key in [headers allKeys]) {
    id value = [headers valueForKey:key];

    [request setValue:value forHTTPHeaderField:key];
  }
  
  NSData *bodyData = [self getBody:body];
  
  if (bodyData != nil) {
    [request setHTTPBody:bodyData];
  }
  
  NSURLSessionConfiguration *sessionConfig = [NSURLSessionConfiguration ephemeralSessionConfiguration];
  
  self.session = [NSURLSession sessionWithConfiguration:sessionConfig delegate:self delegateQueue:nil];
  
  self.dataTask = [self.session dataTaskWithRequest:request];
  
  return self;
}

-(NSData * _Nullable)getBody:(NSDictionary *)body
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

-(void)makeRequest
{
  [self.dataTask resume];
}

-(NSString *)getDataString:(NSData *)data
{
  return [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
}

-(NSString *)getErrorString:(NSError *)error
{
  return [error localizedDescription];
}

-(NSArray *)splitDataString:(NSString *)dataString
{
  NSString *pattern = @"\\n";
  NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:pattern options:0 error:nil];
  NSArray *splitArray = [regex matchesInString:dataString options:0 range:NSMakeRange(0, dataString.length)];
  NSMutableArray *resultArray = [NSMutableArray array];
  NSInteger lastLocation = 0;
  for (NSTextCheckingResult *match in splitArray) {
    NSRange matchRange = match.range;
    NSRange range = NSMakeRange(lastLocation, matchRange.location - lastLocation);
    NSString *subString = [dataString substringWithRange:range];
    if (subString.length != 0) {
      [resultArray addObject:subString];
    }
    lastLocation = matchRange.location + matchRange.length;
  }
  if (lastLocation < dataString.length) {
    NSString *subString = [dataString substringFromIndex:lastLocation];
    [resultArray addObject:subString];
  }
  
  return resultArray;
}

-(void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask didReceiveData:(NSData *)data {
  NSString *dataString = [self getDataString:data];
  
  NSArray *splittedData = [self splitDataString:dataString];
  
  for (NSString *dataStringItem in splittedData) {
    if (self.onDataChunkReceived) {
      self.onDataChunkReceived(dataStringItem);
    }
  }
}

-(void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error {
  if (error) {
    NSString *errorString = [self getErrorString:error];
    
    if (self.onDataChunkReceived) {
      self.onDataTransferFinished(errorString);
    }
  } else {
    if (self.onDataTransferFinished) {
      self.onDataTransferFinished(@"");
    }
  }
}
@end
