package com.sscspeedmath.app.ui.fragments

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.GridLayoutManager
import com.google.android.gms.ads.AdRequest
import com.sscspeedmath.app.R
import com.sscspeedmath.app.data.models.MathOperation
import com.sscspeedmath.app.databinding.FragmentHomeBinding
import com.sscspeedmath.app.ui.adapters.OperationAdapter

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private var listener: OnOperationClickListener? = null

    interface OnOperationClickListener {
        fun onOperationClick(operation: String)
    }

    companion object {
        fun newInstance() = HomeFragment()
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        if (context is OnOperationClickListener) {
            listener = context
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupAds()
        setupOperations()
        setupDailyQuiz()
        setupResultHistory()
    }

    private fun setupAds() {
        val adRequest = AdRequest.Builder().build()
        binding.adViewTop.loadAd(adRequest)
        binding.adViewMiddle.loadAd(adRequest)
        binding.adViewBottom.loadAd(adRequest)
    }

    private fun setupOperations() {
        val operations = listOf(
            MathOperation("addition", "+", "Addition", R.color.emerald_500, R.color.green_600),
            MathOperation("subtraction", "−", "Subtraction", R.color.red_500, R.color.rose_600),
            MathOperation("multiplication", "×", "Multiplication", R.color.orange_500, R.color.amber_600),
            MathOperation("division", "÷", "Division", R.color.cyan_500, R.color.blue_600),
            MathOperation("square", "a²", "Squares", R.color.pink_500, R.color.purple_600),
            MathOperation("cube", "a³", "Cubes", R.color.violet_500, R.color.indigo_600)
        )

        val adapter = OperationAdapter(operations) { operation ->
            listener?.onOperationClick(operation.id)
        }

        binding.recyclerOperations.layoutManager = GridLayoutManager(requireContext(), 2)
        binding.recyclerOperations.adapter = adapter

        // Mixed button
        binding.btnMixed.setOnClickListener {
            listener?.onOperationClick("mixed")
        }
    }

    private fun setupDailyQuiz() {
        binding.btnDailyQuiz.setOnClickListener {
            listener?.onOperationClick("daily")
        }
    }

    private fun setupResultHistory() {
        binding.btnResultHistory.setOnClickListener {
            // Switch to results tab
            (activity as? MainActivity)?.binding?.bottomNavigation?.selectedItemId = R.id.nav_results
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}