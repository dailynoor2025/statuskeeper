package com.qhaleelahmad.statuskeeper;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.DefaultLifecycleObserver;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.ProcessLifecycleOwner;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.appopen.AppOpenAd;
import java.util.Date;

/**
 * Manages AdMob App Open Ads following Google's best practices.
 * Includes frequency capping, ad expiration check, and lifecycle monitoring.
 */
public class AppOpenManager implements Application.ActivityLifecycleCallbacks, DefaultLifecycleObserver {
    private static final String AD_UNIT_ID = "ca-app-pub-9704872868499742/1450930000";
    private AppOpenAd appOpenAd = null;
    private AppOpenAd.AppOpenAdLoadCallback loadCallback;
    private final MyApplication myApplication;
    private Activity currentActivity;
    private static boolean isShowingAd = false;
    private long loadTime = 0;
    private long lastShownTime = 0;
    
    // Frequency cap: 15 minutes to ensure good user experience
    private static final long COOLDOWN_MS = 15 * 60 * 1000; 

    public AppOpenManager(MyApplication myApplication) {
        this.myApplication = myApplication;
        this.myApplication.registerActivityLifecycleCallbacks(this);
        ProcessLifecycleOwner.get().getLifecycle().addObserver(this);
    }

    /** Request a new ad from servers */
    public void fetchAd() {
        if (isAdAvailable()) {
            return;
        }

        loadCallback = new AppOpenAd.AppOpenAdLoadCallback() {
            @Override
            public void onAdLoaded(@NonNull AppOpenAd ad) {
                AppOpenManager.this.appOpenAd = ad;
                AppOpenManager.this.loadTime = (new Date()).getTime();
            }

            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                // Silently fail to not interrupt user flow
            }
        };
        AdRequest request = new AdRequest.Builder().build();
        AppOpenAd.load(
            myApplication, 
            AD_UNIT_ID, 
            request, 
            AppOpenAd.APP_OPEN_AD_ORIENTATION_PORTRAIT, 
            loadCallback
        );
    }

    /** Show the ad if it is valid and cooldown has passed */
    public void showAdIfAvailable() {
        if (!isShowingAd && isAdAvailable()) {
            long now = (new Date()).getTime();
            
            // Apply frequency capping
            if (now - lastShownTime < COOLDOWN_MS) {
                return;
            }

            appOpenAd.show(currentActivity);
            isShowingAd = true;
            lastShownTime = now;
            appOpenAd = null;
            fetchAd();
        } else {
            fetchAd();
        }
    }

    /** Checks if an ad exists and is not older than 4 hours */
    private boolean isAdAvailable() {
        return appOpenAd != null && wasLoadTimeLessThanFourHoursAgo();
    }

    private boolean wasLoadTimeLessThanFourHoursAgo() {
        long dateDifference = (new Date()).getTime() - this.loadTime;
        long numMillisecondsInFourHours = 3600000 * 4;
        return (dateDifference < numMillisecondsInFourHours);
    }

    @Override
    public void onStart(@NonNull LifecycleOwner owner) {
        showAdIfAvailable();
    }

    @Override public void onActivityCreated(@NonNull Activity activity, @Nullable Bundle savedInstanceState) {}
    @Override public void onActivityStarted(@NonNull Activity activity) { currentActivity = activity; }
    @Override public void onActivityResumed(@NonNull Activity activity) { currentActivity = activity; }
    @Override public void onActivityPaused(@NonNull Activity activity) {}
    @Override public void onActivityStopped(@NonNull Activity activity) {}
    @Override public void onActivitySaveInstanceState(@NonNull Activity activity, @NonNull Bundle outState) {}
    @Override public void onActivityDestroyed(@NonNull Activity activity) { currentActivity = null; }
}