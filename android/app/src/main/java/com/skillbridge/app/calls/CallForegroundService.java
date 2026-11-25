package com.skillbridge.app.calls;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;
import com.skillbridge.app.MainActivity;
import com.skillbridge.app.R;

public class CallForegroundService extends Service {
    public static final String ACTION_START = "com.skillbridge.app.calls.START";
    public static final String ACTION_STOP = "com.skillbridge.app.calls.STOP";
    public static final String EXTRA_CALL_TYPE = "callType";
    public static final String EXTRA_PARTICIPANT_NAME = "participantName";
    private static final String CHANNEL_ID = "skillbridge_active_call";
    private static final int NOTIFICATION_ID = 4801;

    @Override
    public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Ongoing calls",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Keeps an active SkillBridge call visible while you use other apps.");
            channel.setShowBadge(false);
            getSystemService(NotificationManager.class).createNotificationChannel(channel);
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null || ACTION_STOP.equals(intent.getAction())) {
            stopForeground(STOP_FOREGROUND_REMOVE);
            stopSelf(startId);
            return START_NOT_STICKY;
        }

        String callType = intent.getStringExtra(EXTRA_CALL_TYPE);
        String name = intent.getStringExtra(EXTRA_PARTICIPANT_NAME);
        if (name == null || name.trim().isEmpty()) name = "SkillBridge contact";
        boolean videoCall = "video".equals(callType);

        Intent openApp = new Intent(this, MainActivity.class)
            .setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent contentIntent = PendingIntent.getActivity(
            this,
            0,
            openApp,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_call_notification)
            .setContentTitle("Call with " + name)
            .setContentText(videoCall ? "Video call in progress · Tap to return" : "Voice call in progress · Tap to return")
            .setCategory(NotificationCompat.CATEGORY_CALL)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setContentIntent(contentIntent)
            .build();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            int serviceTypes = ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE;
            if (videoCall) serviceTypes |= ServiceInfo.FOREGROUND_SERVICE_TYPE_CAMERA;
            startForeground(NOTIFICATION_ID, notification, serviceTypes);
        } else {
            startForeground(NOTIFICATION_ID, notification);
        }
        return START_NOT_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
