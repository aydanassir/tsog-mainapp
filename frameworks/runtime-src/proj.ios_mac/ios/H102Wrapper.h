//
//  H102Wrapper.h
//  tsog
//
//  Created by Stefan Nguyen on 9/4/15.
//
//
#import <Foundation/Foundation.h>

#ifndef tsog_H102Wrapper_h
#define tsog_H102Wrapper_h

@interface H102Wrapper : NSObject

+ (void)setCurrentViewController:(UIViewController*)pViewController;

+ (void)showMessage:(NSString *)title message:(NSString *)message;

+ (void)segmentIdentity:(NSString *)userId traits:(NSString *)traits;
+ (void)segmentTrack:(NSString *)event properties:(NSString *)traits;
+ (void)startRestClock:(NSNumber *)timeToPauseGame;

+ (void)shareWithCaption:(NSString*)caption andURL:(NSString*)url;

@end


#endif
