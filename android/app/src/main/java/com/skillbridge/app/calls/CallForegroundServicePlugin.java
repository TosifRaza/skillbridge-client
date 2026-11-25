package com.skillbridge.app.calls;

import android.content.Intent;
import android.os.Build;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import androidx.core.content.ContextCompat;

@CapacitorPlugin(name = "CallForegroundService")
public class CallForegroundServicePlugin extends Plugin {
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
