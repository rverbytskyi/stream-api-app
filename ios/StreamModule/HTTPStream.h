//
//  HTTPStream.h
//  StreamApiApp
//
//  Created by Roman Verbytskyi on 04.04.2023.
//

@interface HTTPStream : NSObject

@property (nonatomic, strong) NSURL *url;

@property (nonatomic, strong) NSMutableURLRequest *request;

@property (nonatomic, strong) NSURLSessionConfiguration *sessionConfig;

@property (nonatomic, strong) NSURLSession *session;

@property (nonatomic, strong) NSURLSessionDataTask *dataTask;

-(instancetype)initWithUrlString:(NSString *)urlString method:(NSString *)method headers:(NSDictionary *)headers;

@end
