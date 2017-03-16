package com.h102;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;

import com.hub102.tsog.R;

import org.cocos2dx.javascript.AppActivity;

public class AlarmReceiver extends BroadcastReceiver{
    @Override
    public void onReceive(Context context, Intent intent) {
//        Intent notificationIntent = new Intent(context, AppActivity.class);
//        notificationIntent.putExtra("tsog_notification", 1);
//        notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
//
////        TaskStackBuilder stackBuilder = TaskStackBuilder.create(context);
////        stackBuilder.addParentStack(AppActivity.class);
////        stackBuilder.addNextIntent(notificationIntent);
//
////        PendingIntent pendingIntent = stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);
//        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, notificationIntent,
//                PendingIntent.FLAG_UPDATE_CURRENT);

        Intent notificationIntent = new Intent(context, AppActivity.class);
        notificationIntent.putExtra("tsog_notification", 1);
//        notificationIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        PendingIntent pendingIntent = PendingIntent.getActivity(context, (int)System.currentTimeMillis(), notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context);

        Notification notification = builder.setContentTitle("The School Of Games")
                .setContentText("Regular practice leads to faster learning. Start Now \uD83D\uDE00")
                .setTicker("")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(pendingIntent).build();

        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(0, notification);
    }
}