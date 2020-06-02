//
//  NotificationModule.m
//  RnfSimple
//
//  Created by Jirayut Khantavee on 2/6/2563 BE.
//

#import <React/RCTBridgeModule.h>

/*
@implementation NotificationModule

// To export a module named NotificationModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(Show:(nonnull NSInteger *)id title:(NSString *)title description:(NSString *)description)
{
  RCTLogInfo(@"Pretending to create an %d event %@ at %@", id, title, description);
}
@end
*/

@interface RCT_EXTERN_MODULE(NotificationModule, NSObject)

RCT_EXTERN_METHOD(Show:(nonnull NSInteger *)id title:(NSString *)title description:(NSString *)description)

@end
