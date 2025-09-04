package com.sscspeedmath.app.utils

import android.content.Context
import android.content.SharedPreferences
import com.sscspeedmath.app.data.models.QuizResult
import com.sscspeedmath.app.data.models.StatsSummary
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class PreferencesManager(context: Context) {
    
    private val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    
    companion object {
        private const val PREFS_NAME = "ssc_speed_math_prefs"
        private const val KEY_QUIZ_RESULTS = "quiz_results"
        private const val KEY_SELECTED_EXAM = "selected_exam"
        private const val KEY_NOTIFICATIONS_ENABLED = "notifications_enabled"
        private const val KEY_SOUND_ENABLED = "sound_enabled"
        private const val KEY_TOTAL_QUIZZES = "total_quizzes"
        private const val KEY_BEST_STREAK = "best_streak"
        private const val KEY_CURRENT_STREAK = "current_streak"
        private const val KEY_TOTAL_TIME = "total_time_spent"
    }
    
    fun saveQuizResult(result: QuizResult) {
        val results = getQuizResults().toMutableList()
        results.add(result)
        
        // Keep only last 50 results to save space
        if (results.size > 50) {
            results.removeAt(0)
        }
        
        val json = Json.encodeToString(results)
        prefs.edit().putString(KEY_QUIZ_RESULTS, json).apply()
        
        // Update stats
        updateStats(result)
    }
    
    fun getQuizResults(): List<QuizResult> {
        val json = prefs.getString(KEY_QUIZ_RESULTS, null) ?: return emptyList()
        return try {
            Json.decodeFromString(json)
        } catch (e: Exception) {
            emptyList()
        }
    }
    
    private fun updateStats(result: QuizResult) {
        val totalQuizzes = prefs.getInt(KEY_TOTAL_QUIZZES, 0) + 1
        val totalTime = prefs.getLong(KEY_TOTAL_TIME, 0) + result.timeSpent
        
        // Update streak
        val currentStreak = if (result.accuracy >= 80) {
            prefs.getInt(KEY_CURRENT_STREAK, 0) + 1
        } else {
            0
        }
        
        val bestStreak = maxOf(prefs.getInt(KEY_BEST_STREAK, 0), currentStreak)
        
        prefs.edit()
            .putInt(KEY_TOTAL_QUIZZES, totalQuizzes)
            .putLong(KEY_TOTAL_TIME, totalTime)
            .putInt(KEY_CURRENT_STREAK, currentStreak)
            .putInt(KEY_BEST_STREAK, bestStreak)
            .apply()
    }
    
    fun getStatsSummary(): StatsSummary {
        val results = getQuizResults()
        val averageAccuracy = if (results.isNotEmpty()) {
            results.map { it.accuracy }.average().toFloat()
        } else 0f
        
        return StatsSummary(
            totalQuizzes = prefs.getInt(KEY_TOTAL_QUIZZES, 0),
            averageAccuracy = averageAccuracy,
            bestStreak = prefs.getInt(KEY_BEST_STREAK, 0),
            totalTimeSpent = prefs.getLong(KEY_TOTAL_TIME, 0)
        )
    }
    
    // Settings
    var selectedExam: String
        get() = prefs.getString(KEY_SELECTED_EXAM, "SSC CGL") ?: "SSC CGL"
        set(value) = prefs.edit().putString(KEY_SELECTED_EXAM, value).apply()
    
    var notificationsEnabled: Boolean
        get() = prefs.getBoolean(KEY_NOTIFICATIONS_ENABLED, true)
        set(value) = prefs.edit().putBoolean(KEY_NOTIFICATIONS_ENABLED, value).apply()
    
    var soundEnabled: Boolean
        get() = prefs.getBoolean(KEY_SOUND_ENABLED, true)
        set(value) = prefs.edit().putBoolean(KEY_SOUND_ENABLED, value).apply()
    
    fun clearAllData() {
        prefs.edit().clear().apply()
    }
}