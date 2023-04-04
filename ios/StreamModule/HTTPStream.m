//
//  HTTPStream.m
//  StreamApiApp
//
//  Created by Roman Verbytskyi on 04.04.2023.
//

#import <Foundation/Foundation.h>
#import "HTTPStream.h"

@implementation HTTPStream

-(instancetype)initWithUrlString:(NSString *)urlString method:(NSString *)method headers:(NSDictionary *)headers
{
  self = [super init];
  
  self.url = [NSURL URLWithString:urlString];
  
  self.request = [NSMutableURLRequest requestWithURL:self.url];
  
  [self.request setHTTPMethod:method];
  
  for (NSString *key in [headers allKeys]) {
    id value = [headers valueForKey:key];
    
    [self.request setValue:value forHTTPHeaderField:key];
  }
  
  self.sessionConfig = [NSURLSessionConfiguration defaultSessionConfiguration];
  
  self.session = [NSURLSession sessionWithConfiguration:self.sessionConfig];
  
  return self;
}

@end
