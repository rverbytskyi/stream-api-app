//
//  HTTPStream.h
//  StreamApiApp
//
//  Created by Roman Verbytskyi on 04.04.2023.
//

@interface HTTPStream : NSObject<NSURLSessionDataDelegate>

-(instancetype)initWithUrlString:(NSString *)urlString method:(NSString *)method headers:(NSDictionary *)headers body:(NSDictionary *)body onDataChunkReceived:(void (^)(NSString *data))onDataChunkReceived onDataTransferFinished:(void (^)(NSString *errorString))onDataTransferFinished;

- (void)makeRequest;

@property (nonatomic, strong) NSURLSessionDataTask *dataTask;

@property (nonatomic, strong) NSURLSession *session;

@property (nonatomic, copy) void (^onDataChunkReceived)(NSString *data);

@property (nonatomic, copy) void (^onDataTransferFinished)(NSString *errorString);

@end
