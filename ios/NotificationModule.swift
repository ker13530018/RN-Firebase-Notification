//
//  NotificationModule.swift
//  RnfSimple
//
//  Created by Jirayut Khantavee on 2/6/2563 BE.
//

import Foundation
import UserNotifications

@available(iOS 10.0, *)
@objc(NotificationModule)
class NotificationModule: NSObject, UNUserNotificationCenterDelegate {
  let userNotificationCenter = UNUserNotificationCenter.current()
  
  override init() {
    super.init()
    
    self.userNotificationCenter.delegate = self
  }
  
   @objc(Show:title:description:)
   func Show(id: Int32, title: String, description: String) -> Void {
     // Date is ready to use!
      print(id, title, description)
    
      let notificationContent = UNMutableNotificationContent()
      notificationContent.title = title
      notificationContent.body = description
      notificationContent.badge = NSNumber(value: id)
      let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 5, repeats: false)
      
      let request = UNNotificationRequest(identifier: "RNF_NOTIFICATION",
                                             content: notificationContent,
                                             trigger: trigger)
      
      userNotificationCenter.add(request) { (error) in
          if let error = error {
              print("Notification Error: ", error)
          }
      }
   
   }
  
  @objc static func requiresMainQueueSetup() -> Bool {
      return false
  }
  
  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
      completionHandler()
  }

  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
      completionHandler([.alert, .badge, .sound])
  }
  
//  @objc var bridge: RCTBridge?
//  @objc var methodQueue: DispatchQueue?
//  @objc func batchDidComplete() {
//      // do something if needed at the end of the batch
//  }
//  @objc func partialBatchDidFlush() {
//      // do something if needed at the end of the partial flush of the batch
//  }
  
}
