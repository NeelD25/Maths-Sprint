package com.sscspeedmath.app.data.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class QuizConfig(
    val operation: String,
    val min: Int,
    val max: Int,
    val questionCount: Int
) : Parcelable

@Parcelize
data class Question(
    val text: String,
    val correctAnswer: Int,
    val type: String,
    val operands: List<Int> = emptyList()
) : Parcelable

@Parcelize
data class QuizResult(
    val score: Int,
    val totalQuestions: Int,
    val operation: String,
    val accuracy: Int,
    val timeSpent: Long,
    val date: Long = System.currentTimeMillis()
) : Parcelable

data class MathOperation(
    val id: String,
    val symbol: String,
    val name: String,
    val colorStart: Int,
    val colorEnd: Int
)

data class StatsSummary(
    val totalQuizzes: Int,
    val averageAccuracy: Float,
    val bestStreak: Int,
    val totalTimeSpent: Long
)

enum class OperationType {
    ADDITION,
    SUBTRACTION,
    MULTIPLICATION,
    DIVISION,
    SQUARE,
    CUBE,
    MIXED,
    DAILY
}