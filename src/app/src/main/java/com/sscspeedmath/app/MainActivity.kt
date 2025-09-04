package com.sscspeedmath.app

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.google.android.gms.ads.MobileAds
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.sscspeedmath.app.data.models.QuizConfig
import com.sscspeedmath.app.databinding.ActivityMainBinding
import com.sscspeedmath.app.ui.fragments.HomeFragment
import com.sscspeedmath.app.ui.fragments.ProfileFragment
import com.sscspeedmath.app.ui.fragments.ResultsFragment
import com.sscspeedmath.app.ui.quiz.QuizActivity

class MainActivity : AppCompatActivity(), HomeFragment.OnOperationClickListener {

    private lateinit var binding: ActivityMainBinding
    private var activeFragment: Fragment? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Initialize AdMob
        MobileAds.initialize(this) {}

        setupBottomNavigation()
        showFragment(HomeFragment.newInstance())
    }

    private fun setupBottomNavigation() {
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    showFragment(HomeFragment.newInstance())
                    true
                }
                R.id.nav_results -> {
                    showFragment(ResultsFragment.newInstance())
                    true
                }
                R.id.nav_profile -> {
                    showFragment(ProfileFragment.newInstance())
                    true
                }
                else -> false
            }
        }
    }

    private fun showFragment(fragment: Fragment) {
        if (activeFragment === fragment) return
        
        val transaction = supportFragmentManager.beginTransaction()
        
        if (activeFragment != null) {
            transaction.hide(activeFragment!!)
        }
        
        if (fragment.isAdded) {
            transaction.show(fragment)
        } else {
            transaction.add(R.id.fragment_container, fragment)
        }
        
        transaction.commit()
        activeFragment = fragment
    }

    override fun onOperationClick(operation: String) {
        when (operation) {
            "mixed" -> {
                startQuiz(QuizConfig("mixed", 1, 100, 10))
            }
            "daily" -> {
                startQuiz(QuizConfig("mixed", 1, 50, 15))
            }
            else -> {
                // Show number range dialog
                showNumberRangeDialog(operation)
            }
        }
    }

    private fun showNumberRangeDialog(operation: String) {
        val dialog = NumberRangeDialogFragment.newInstance(operation)
        dialog.setOnConfirmListener { min, max, questionCount ->
            startQuiz(QuizConfig(operation, min, max, questionCount))
        }
        dialog.show(supportFragmentManager, "NumberRangeDialog")
    }

    private fun startQuiz(config: QuizConfig) {
        val intent = Intent(this, QuizActivity::class.java)
        intent.putExtra("quiz_config", config)
        startActivity(intent)
    }
}