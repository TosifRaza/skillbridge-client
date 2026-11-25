package com.skillbridge.app;

import com.getcapacitor.BridgeActivity;
import com.skillbridge.app.calls.CallForegroundServicePlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(CallForegroundServicePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
