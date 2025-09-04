package com.sscspeedmath.app.ui.quiz

import android.animation.ValueAnimator
import android.os.Bundle
import android.os.CountDownTimer
import android.view.KeyEvent
import android.view.View
import android.view.inputmethod.EditorInfo
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.google.android.gms.ads.AdRequest
import com.sscspeedmath.app.R
import com.sscspeedmath.app.data.models.Question
import com.sscspeedmath.app.data.models.QuizConfig
import com.sscspeedmath.app.data.models.QuizResult
import com.sscspeedmath.app.databinding.ActivityQuizBinding
import com.sscspeedmath.app.utils.PreferencesManager
import com.sscspeedmath.app.utils.QuestionGenerator

class QuizActivity : AppCompatActivity() {

    private lateinit var binding: ActivityQuizBinding
    private lateinit var preferencesManager: PreferencesManager
    private lateinit var quizConfig: QuizConfig
    
    private var currentQuestionNumber = 1
    private var score = 0
    private var currentQuestion: Question? = null
    private var timer: CountDownTimer? = null
    private var quizStartTime = 0L
    private var showingFeedback = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityQuizBinding.inflate(layoutInflater)
        setContentView(binding.root)

        preferencesManager = PreferencesManager(this)
        quizConfig = intent.getParcelableExtra("quiz_config") ?: return finish()
        quizStartTime = System.currentTimeMillis()

        setupUI()
        loadNextQuestion()
    }

    private fun setupUI() {
        binding.toolbar.setNavigationOnClickListener { finish() }
        binding.toolbarTitle.text = getOperationDisplayName(quizConfig.operation)
        
        binding.btnSubmit.setOnClickListener { submitAnswer() }
        binding.editAnswer.setOnEditorActionListener { _, actionId, event ->
            if (actionId == EditorInfo.IME_ACTION_DONE || 
                (event?.keyCode == KeyEvent.KEYCODE_ENTER && event.action == KeyEvent.ACTION_DOWN)) {
                submitAnswer()
                true
            } else false
        }

        updateProgress()
        loadAd()
    }

    private fun loadAd() {
        if (currentQuestionNumber == 1 || currentQuestionNumber % 5 == 0) {
            binding.adView.visibility = View.VISIBLE
            val adRequest = AdRequest.Builder().build()
            binding.adView.loadAd(adRequest)
        } else {
            binding.adView.visibility = View.GONE
        }
    }

    private fun loadNextQuestion() {
        if (currentQuestionNumber > quizConfig.questionCount) {
            finishQuiz()
            return
        }

        currentQuestion = QuestionGenerator.generateQuestion(
            quizConfig.operation, 
            quizConfig.min, 
            quizConfig.max
        )
        
        binding.textQuestion.text = currentQuestion?.text
        binding.editAnswer.setText("")
        binding.editAnswer.requestFocus()
        
        binding.questionCard.visibility = View.VISIBLE
        binding.feedbackCard.visibility = View.GONE
        showingFeedback = false
        
        updateProgress()
        startTimer()
        loadAd()
    }

    private fun updateProgress() {
        binding.textQuestionNumber.text = "$currentQuestionNumber/${quizConfig.questionCount}"
        binding.textScore.text = score.toString()
        
        val progress = (currentQuestionNumber.toFloat() / quizConfig.questionCount * 100).toInt()
        animateProgressBar(progress)
    }

    private fun animateProgressBar(targetProgress: Int) {
        val currentProgress = binding.progressBar.progress
        ValueAnimator.ofInt(currentProgress, targetProgress).apply {
            duration = 300
            addUpdateListener { binding.progressBar.progress = it.animatedValue as Int }
            start()
        }
    }

    private fun startTimer() {
        timer?.cancel()
        timer = object : CountDownTimer(30000, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val secondsLeft = (millisUntilFinished / 1000).toInt()
                binding.textTimer.text = "${secondsLeft}s"
                
                // Change color when time is running out
                if (secondsLeft <= 10) {
                    binding.textTimer.setTextColor(ContextCompat.getColor(this@QuizActivity, R.color.red_400))
                } else {
                    binding.textTimer.setTextColor(ContextCompat.getColor(this@QuizActivity, android.R.color.white))
                }
                
                // Update timer circle
                val progress = ((30 - secondsLeft) / 30f * 100).toInt()
                binding.timerProgress.progress = progress
            }

            override fun onFinish() {
                if (!showingFeedback) {
                    submitAnswer()
                }
            }
        }.start()
    }

    private fun submitAnswer() {
        if (showingFeedback) return
        
        timer?.cancel()
        showingFeedback = true
        
        val userAnswer = binding.editAnswer.text.toString().toIntOrNull() ?: 0
        val correct = userAnswer == currentQuestion?.correctAnswer
        
        if (correct) score++
        
        showFeedback(correct)
        
        // Auto advance after 2 seconds
        binding.root.postDelayed({
            currentQuestionNumber++
            loadNextQuestion()
        }, 2000)
    }

    private fun showFeedback(correct: Boolean) {
        binding.questionCard.visibility = View.GONE
        binding.feedbackCard.visibility = View.VISIBLE
        
        if (correct) {
            binding.feedbackIcon.text = "✓"
            binding.feedbackIcon.setTextColor(ContextCompat.getColor(this, R.color.green_400))
            binding.feedbackText.text = "Correct!"
            binding.feedbackText.setTextColor(ContextCompat.getColor(this, R.color.green_400))
            binding.correctAnswer.visibility = View.GONE
        } else {
            binding.feedbackIcon.text = "✗"
            binding.feedbackIcon.setTextColor(ContextCompat.getColor(this, R.color.red_400))
            binding.feedbackText.text = "Incorrect"
            binding.feedbackText.setTextColor(ContextCompat.getColor(this, R.color.red_400))
            binding.correctAnswer.visibility = View.VISIBLE
            binding.correctAnswer.text = "Correct answer: ${currentQuestion?.correctAnswer}"
        }
        
        binding.nextText.text = if (currentQuestionNumber >= quizConfig.questionCount) {
            "Quiz Complete!"
        } else {
            "Next question in 2s..."
        }
    }

    private fun finishQuiz() {
        val timeSpent = System.currentTimeMillis() - quizStartTime
        val accuracy = (score * 100) / quizConfig.questionCount
        
        val result = QuizResult(
            score = score,
            totalQuestions = quizConfig.questionCount,
            operation = quizConfig.operation,
            accuracy = accuracy,
            timeSpent = timeSpent
        )
        
        preferencesManager.saveQuizResult(result)
        
        // Return to main activity and show results
        finish()
    }

    private fun getOperationDisplayName(operation: String): String {
        return when (operation) {
            "addition" -> "Addition"
            "subtraction" -> "Subtraction"
            "multiplication" -> "Multiplication"
            "division" -> "Division"
            "square" -> "Squares"
            "cube" -> "Cubes"
            "mixed" -> "Mixed Practice"
            else -> "Speed Math Quiz"
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        timer?.cancel()
    }
}