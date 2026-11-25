package com.skillbridge.app.calls;

import android.content.Intent;
import android.os.Build;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PermissionState;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import androidx.core.content.ContextCompat;
import android.Manifest;
import android.net.Uri;
import android.provider.Settings;

@CapacitorPlugin(name = "CallForegroundService", permissions = {
    @Permission(alias = "microphone", strings = { Manifest.permission.RECORD_AUDIO }),
    @Permission(alias = "camera", strings = { Manifest.permission.CAMERA })
})
public class CallForegroundServicePlugin extends Plugin {
    @PluginMethod
    public void requestMediaPermissions(PluginCall call) {
        String callType = call.getString("callType", "audio");
        if ("video".equals(callType)) {
            requestPermissionForAliases(new String[] { "microphone", "camera" }, call, "mediaPermissionsCallback");
        } else {
            requestPermissionForAlias("microphone", call, "mediaPermissionsCallback");
        }
    }

    @PermissionCallback
    private void mediaPermissionsCallback(PluginCall call) {
        boolean microphoneGranted = getPermissionState("microphone") == PermissionState.GRANTED;
        boolean cameraGranted = "video".equals(call.getString("callType", "audio"))
            ? getPermissionState("camera") == PermissionState.GRANTED : true;
        JSObject result = new JSObject();
        result.put("granted", microphoneGranted && cameraGranted);
        result.put("microphone", microphoneGranted);
        result.put("camera", cameraGranted);
        call.resolve(result);
    }

    @PluginMethod
    public void openAppSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                Uri.fromParts("package", getContext().getPackageName(), null));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception error) {
            call.reject("Could not open app settings", error);
        }
    }

    @PluginMethod
    public void start(PluginCall call) {
        String callType = call.getString("callType", "audio");
        String participantName = call.getString("participantName", "SkillBridge contact");
        Intent intent = new Intent(getContext(), CallForegroundService.class);
        intent.setAction(CallForegroundService.ACTION_START);
        intent.putExtra(CallForegroundService.EXTRA_CALL_TYPE, callType);
        intent.putExtra(CallForegroundService.EXTRA_PARTICIPANT_NAME, participantName);
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                ContextCompat.startForegroundService(getContext(), intent);
            } else {
                getContext().startService(intent);
            }
            JSObject result = new JSObject();
            result.put("active", true);
            call.resolve(result);
        } catch (Exception error) {
            call.reject("Could not start the ongoing call notification", error);
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        Intent intent = new Intent(getContext(), CallForegroundService.class);
        getContext().stopService(intent);
        JSObject result = new JSObject();
        result.put("active", false);
        call.resolve(result);
    }
}
