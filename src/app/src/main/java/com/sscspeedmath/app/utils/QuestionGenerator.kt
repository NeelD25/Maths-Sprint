package com.sscspeedmath.app.utils

import com.sscspeedmath.app.data.models.Question
import kotlin.math.min
import kotlin.math.pow
import kotlin.random.Random

object QuestionGenerator {

    fun generateQuestion(type: String, min: Int = 1, max: Int = 100): Question {
        return when (type.lowercase()) {
            "addition" -> generateAdditionQuestion(min, max)
            "subtraction" -> generateSubtractionQuestion(min, max)
            "multiplication" -> generateMultiplicationQuestion(min, max)
            "division" -> generateDivisionQuestion(min, max)
            "square" -> generateSquareQuestion(min, max)
            "cube" -> generateCubeQuestion(min, max)
            "mixed" -> generateMixedQuestion(min, max)
            else -> generateAdditionQuestion(min, max)
        }
    }

    fun generateQuestions(type: String, count: Int, min: Int = 1, max: Int = 100): List<Question> {
        return (1..count).map { generateQuestion(type, min, max) }
    }

    private fun generateAdditionQuestion(min: Int, max: Int): Question {
        val a = Random.nextInt(min, max + 1)
        val b = Random.nextInt(min, max + 1)
        return Question(
            text = "$a + $b",
            correctAnswer = a + b,
            type = "addition",
            operands = listOf(a, b)
        )
    }

    private fun generateSubtractionQuestion(min: Int, max: Int): Question {
        val a = Random.nextInt(min, max + 1)
        val b = Random.nextInt(min, min(a, max) + 1) // Ensure positive result
        return Question(
            text = "$a - $b",
            correctAnswer = a - b,
            type = "subtraction",
            operands = listOf(a, b)
        )
    }

    private fun generateMultiplicationQuestion(min: Int, max: Int): Question {
        // Use smaller numbers for multiplication to keep answers reasonable
        val adjustedMax = min(max, 50)
        val a = Random.nextInt(min, adjustedMax + 1)
        val b = Random.nextInt(min, adjustedMax + 1)
        return Question(
            text = "$a × $b",
            correctAnswer = a * b,
            type = "multiplication",
            operands = listOf(a, b)
        )
    }

    private fun generateDivisionQuestion(min: Int, max: Int): Question {
        val divisor = Random.nextInt(maxOf(2, min), min(max, 20) + 1)
        val quotient = Random.nextInt(min, (max / divisor) + 1)
        val dividend = divisor * quotient
        
        return Question(
            text = "$dividend ÷ $divisor",
            correctAnswer = quotient,
            type = "division",
            operands = listOf(dividend, divisor)
        )
    }

    private fun generateSquareQuestion(min: Int, max: Int): Question {
        // For squares, use square root of max to keep numbers reasonable
        val maxBase = kotlin.math.sqrt(max.toDouble()).toInt()
        val base = Random.nextInt(maxOf(1, kotlin.math.sqrt(min.toDouble()).toInt()), maxBase + 1)
        return Question(
            text = "${base}²",
            correctAnswer = base * base,
            type = "square",
            operands = listOf(base)
        )
    }

    private fun generateCubeQuestion(min: Int, max: Int): Question {
        // For cubes, use cube root of max to keep numbers reasonable
        val maxBase = kotlin.math.cbrt(max.toDouble()).toInt()
        val base = Random.nextInt(
            maxOf(1, kotlin.math.cbrt(min.toDouble()).toInt()), 
            min(maxBase, 20) + 1
        )
        return Question(
            text = "${base}³",
            correctAnswer = base.toDouble().pow(3).toInt(),
            type = "cube",
            operands = listOf(base)
        )
    }

    private fun generateMixedQuestion(min: Int, max: Int): Question {
        val operations = listOf(
            { generateAdditionQuestion(min, max) },
            { generateSubtractionQuestion(min, max) },
            { generateMultiplicationQuestion(min, max) },
            { generateDivisionQuestion(min, max) },
            { generateSquareQuestion(min, max) },
            { generateCubeQuestion(min, max) }
        )
        
        return operations.random().invoke()
    }
}