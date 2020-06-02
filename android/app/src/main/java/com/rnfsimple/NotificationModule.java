package com.rnfsimple;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import static androidx.core.content.ContextCompat.getSystemService;

public class NotificationModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;

    private String name = "NotificationModule";

    private String CHANNEL_ID = "TEST_CHANNEL";

    @NonNull
    @Override
    public String getName() {
        return name;
    }


    public NotificationModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;

        Log.e(name,"native module NotificationModule");
    }


    @ReactMethod
    public void Show(int notificationId, String title, String description) {
        Log.e(name,"native module NotificationModule method Show");
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this.reactContext, MainApplication.NOTIFICATION_CHANNEL)
                .setSmallIcon(R.mipmap.ic_launcher_round)
                .setContentTitle(title)
                .setContentText(description)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);

        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this.reactContext);
        notificationManager.notify(notificationId, builder.build());
    }
}
