#!/usr/bin/env python3
"""
Final Lottery Number Generator
The most sophisticated lottery number generator using ALL advanced pattern analysis.
"""

import pandas as pd
import numpy as np
import random
from collections import Counter
import warnings
warnings.filterwarnings('ignore')

class FinalLotteryGenerator:
    def __init__(self, csv_file):
        """Initialize the final generator with lottery data."""
        self.csv_file = csv_file
        self.df = None
        self.white_balls = []
        self.powerballs = []
        self.hot_numbers = []
        self.cold_numbers = []
        self.load_data()
        self.analyze_all_patterns()
    
    def load_data(self):
        """Load and preprocess the lottery data."""
        print("Loading lottery data for final generation...")
        self.df = pd.read_csv(self.csv_file)
        
        # Convert date column
        self.df['Draw Date'] = pd.to_datetime(self.df['Draw Date'])
        
        # Parse winning numbers
        self.df['Numbers'] = self.df['Winning Numbers'].str.split()
        self.df['White Balls'] = self.df['Numbers'].apply(lambda x: [int(n) for n in x[:5]])
        self.df['Powerball'] = self.df['Numbers'].apply(lambda x: int(x[5]))
        
        # Flatten all white balls and powerballs for analysis
        self.white_balls = [num for sublist in self.df['White Balls'] for num in sublist]
        self.powerballs = self.df['Powerball'].tolist()
        
        print(f"Loaded {len(self.df)} lottery draws")
    
    def analyze_all_patterns(self):
        """Analyze ALL patterns from our advanced analysis."""
        print("Analyzing ALL patterns for final generation...")
        
        # Calculate frequencies
        white_freq = Counter(self.white_balls)
        pb_freq = Counter(self.powerballs)
        
        # Calculate expected frequencies
        expected_white = len(self.white_balls) / 69
        expected_pb = len(self.powerballs) / 26
        
        # Identify hot and cold numbers using Z-scores
        self.hot_numbers = []
        self.cold_numbers = []
        
        for num in range(1, 70):
            observed_count = white_freq.get(num, 0)
            z_score = (observed_count - expected_white) / np.sqrt(expected_white)
            if z_score > 2:  # Hot numbers
                self.hot_numbers.append((num, z_score, observed_count))
            elif z_score < -2:  # Cold numbers
                self.cold_numbers.append((num, z_score, observed_count))
        
        # Sort by Z-score
        self.hot_numbers.sort(key=lambda x: x[1], reverse=True)
        self.cold_numbers.sort(key=lambda x: x[1])
        
        # Store frequency data
        self.white_freq = white_freq
        self.pb_freq = pb_freq
        
        print(f"Found {len(self.hot_numbers)} hot numbers and {len(self.cold_numbers)} cold numbers")
    
    def generate_ultimate_hot_strategy(self):
        """Generate numbers using ultimate hot strategy."""
        print("\n🔥 ULTIMATE HOT STRATEGY")
        print("="*40)
        
        white_balls = []
        
        # Use ALL hot numbers if we have them, otherwise use as many as possible
        hot_count = min(4, len(self.hot_numbers))
        if hot_count > 0:
            hot_selected = random.sample([num for num, _, _ in self.hot_numbers], hot_count)
            white_balls.extend(hot_selected)
        
        # Fill remaining with most frequent numbers
        remaining = 5 - len(white_balls)
        if remaining > 0:
            most_frequent = [num for num, count in self.white_freq.most_common(20)]
            available_frequent = [num for num in most_frequent if num not in white_balls]
            if available_frequent:
                white_balls.extend(random.sample(available_frequent, min(remaining, len(available_frequent))))
        
        # Fill any remaining with random
        while len(white_balls) < 5:
            all_numbers = list(range(1, 70))
            available = [num for num in all_numbers if num not in white_balls]
            white_balls.append(random.choice(available))
        
        # Generate powerball using most frequent
        most_common_pbs = [num for num, count in self.pb_freq.most_common(10)]
        powerball = random.choice(most_common_pbs)
        
        return sorted(white_balls), powerball
    
    def generate_ultimate_cold_strategy(self):
        """Generate numbers using ultimate cold strategy."""
        print("\n❄️  ULTIMATE COLD STRATEGY")
        print("="*40)
        
        white_balls = []
        
        # Use ALL cold numbers if we have them, otherwise use as many as possible
        cold_count = min(4, len(self.cold_numbers))
        if cold_count > 0:
            cold_selected = random.sample([num for num, _, _ in self.cold_numbers], cold_count)
            white_balls.extend(cold_selected)
        
        # Fill remaining with least frequent numbers
        remaining = 5 - len(white_balls)
        if remaining > 0:
            least_frequent = [num for num, count in self.white_freq.most_common()[-20:]]
            available_least = [num for num in least_frequent if num not in white_balls]
            if available_least:
                white_balls.extend(random.sample(available_least, min(remaining, len(available_least))))
        
        # Fill any remaining with random
        while len(white_balls) < 5:
            all_numbers = list(range(1, 70))
            available = [num for num in all_numbers if num not in white_balls]
            white_balls.append(random.choice(available))
        
        # Generate powerball using least frequent
        least_frequent_pbs = [num for num, count in self.pb_freq.most_common()[-10:]]
        powerball = random.choice(least_frequent_pbs)
        
        return sorted(white_balls), powerball
    
    def generate_ultimate_balanced_strategy(self):
        """Generate numbers using ultimate balanced strategy."""
        print("\n⚖️  ULTIMATE BALANCED STRATEGY")
        print("="*40)
        
        white_balls = []
        
        # Select 2 hot numbers if available
        if len(self.hot_numbers) >= 2:
            hot_selected = random.sample([num for num, _, _ in self.hot_numbers], 2)
            white_balls.extend(hot_selected)
        elif len(self.hot_numbers) > 0:
            hot_selected = [num for num, _, _ in self.hot_numbers]
            white_balls.extend(hot_selected)
        
        # Select 2 cold numbers if available
        if len(self.cold_numbers) >= 2:
            cold_selected = random.sample([num for num, _, _ in self.cold_numbers], 2)
            white_balls.extend(cold_selected)
        elif len(self.cold_numbers) > 0:
            cold_selected = [num for num, _, _ in self.cold_numbers]
            white_balls.extend(cold_selected)
        
        # Fill remaining with random
        remaining = 5 - len(white_balls)
        if remaining > 0:
            all_numbers = list(range(1, 70))
            available = [num for num in all_numbers if num not in white_balls]
            white_balls.extend(random.sample(available, remaining))
        
        # Generate powerball (balanced)
        if random.random() < 0.6:  # 60% chance for frequent
            most_common_pbs = [num for num, count in self.pb_freq.most_common(10)]
            powerball = random.choice(most_common_pbs)
        else:  # 40% chance for less frequent
            least_frequent_pbs = [num for num, count in self.pb_freq.most_common()[-10:]]
            powerball = random.choice(least_frequent_pbs)
        
        return sorted(white_balls), powerball
    
    def generate_frequency_weighted_strategy(self):
        """Generate numbers using frequency-weighted selection."""
        print("\n📊 FREQUENCY-WEIGHTED STRATEGY")
        print("="*40)
        
        # Create weighted selection pool based on actual frequencies
        selection_pool = []
        
        for num in range(1, 70):
            count = self.white_freq.get(num, 0)
            # Weight by actual frequency
            weight = max(1, count // 10)
            selection_pool.extend([num] * weight)
        
        # Generate 5 unique numbers
        white_balls = []
        while len(white_balls) < 5:
            num = random.choice(selection_pool)
            if num not in white_balls:
                white_balls.append(num)
        
        # Generate powerball using frequency weighting
        pb_pool = []
        for num in range(1, 27):
            count = self.pb_freq.get(num, 0)
            weight = max(1, count // 5)
            pb_pool.extend([num] * weight)
        
        powerball = random.choice(pb_pool)
        
        return sorted(white_balls), powerball
    
    def generate_position_based_strategy(self):
        """Generate numbers using position-based strategy."""
        print("\n🎯 POSITION-BASED STRATEGY")
        print("="*40)
        
        # Position preferences from our analysis
        position_preferences = {
            0: [1, 2, 3, 5, 4],  # 1st position (lowest)
            1: [12, 21, 28, 16, 15],  # 2nd position
            2: [37, 33, 35, 34, 32],  # 3rd position (middle)
            3: [52, 53, 45, 47, 39],  # 4th position
            4: [69, 59, 58, 67, 68]   # 5th position (highest)
        }
        
        white_balls = []
        
        # Select one number from each position preference
        for pos in range(5):
            preferred_nums = position_preferences[pos]
            
            # Weight towards hot numbers in this position
            hot_in_position = [num for num in preferred_nums if num in [hot[0] for hot in self.hot_numbers]]
            
            if hot_in_position and random.random() < 0.8:  # 80% chance for hot
                selected = random.choice(hot_in_position)
            else:
                selected = random.choice(preferred_nums)
            
            white_balls.append(selected)
        
        # Ensure uniqueness
        while len(set(white_balls)) < 5:
            white_balls = list(set(white_balls))
            remaining = 5 - len(white_balls)
            all_numbers = list(range(1, 70))
            available = [num for num in all_numbers if num not in white_balls]
            white_balls.extend(random.sample(available, remaining))
        
        # Generate powerball using most frequent
        most_common_pbs = [num for num, count in self.pb_freq.most_common(10)]
        powerball = random.choice(most_common_pbs)
        
        return sorted(white_balls), powerball
    
    def generate_random_strategy(self):
        """Generate completely random numbers."""
        print("\n🎲 RANDOM STRATEGY")
        print("="*40)
        
        white_balls = sorted(random.sample(range(1, 70), 5))
        powerball = random.randint(1, 26)
        
        return white_balls, powerball
    
    def display_numbers(self, white_balls, powerball, strategy_name):
        """Display the generated numbers with detailed analysis."""
        print(f"\n{strategy_name} Generated Numbers:")
        print(f"White Balls: {' '.join(f'{num:02d}' for num in white_balls)}")
        print(f"Powerball: {powerball:02d}")
        
        # Detailed analysis
        hot_count = sum(1 for num in white_balls if num in [hot[0] for hot in self.hot_numbers])
        cold_count = sum(1 for num in white_balls if num in [cold[0] for cold in self.cold_numbers])
        neutral_count = 5 - hot_count - cold_count
        
        print(f"Analysis: {hot_count} hot, {cold_count} cold, {neutral_count} neutral")
        
        # Calculate sum and other stats
        total_sum = sum(white_balls)
        even_count = sum(1 for num in white_balls if num % 2 == 0)
        print(f"Sum: {total_sum}, Even count: {even_count}")
        
        return white_balls, powerball
    
    def generate_final_sets(self, num_sets=20):
        """Generate multiple sets using final strategies."""
        print("🎰 FINAL LOTTERY NUMBER GENERATOR")
        print("="*60)
        print("Using ALL advanced pattern analysis findings")
        print("="*60)
        
        strategies = [
            ("Ultimate Hot", self.generate_ultimate_hot_strategy),
            ("Ultimate Cold", self.generate_ultimate_cold_strategy),
            ("Ultimate Balanced", self.generate_ultimate_balanced_strategy),
            ("Frequency-Weighted", self.generate_frequency_weighted_strategy),
            ("Position-Based", self.generate_position_based_strategy),
            ("Random", self.generate_random_strategy)
        ]
        
        generated_sets = []
        
        for i in range(num_sets):
            strategy_name, generator_func = strategies[i % len(strategies)]
            white_balls, powerball = generator_func()
            generated_sets.append((white_balls, powerball, strategy_name))
            self.display_numbers(white_balls, powerball, strategy_name)
        
        return generated_sets
    
    def show_final_analysis(self):
        """Show the final analysis from our findings."""
        print("\n" + "="*60)
        print("📊 FINAL PATTERN ANALYSIS")
        print("="*60)
        
        print(f"\n🔥 HOTTEST WHITE BALLS (Z-score > 2):")
        for i, (num, z_score, count) in enumerate(self.hot_numbers, 1):
            print(f"   {i:2d}. Number {num:2d}: Z-score = {z_score:6.2f} ({count:3d} times)")
        
        print(f"\n❄️  COLDEST WHITE BALLS (Z-score < -2):")
        for i, (num, z_score, count) in enumerate(self.cold_numbers, 1):
            print(f"   {i:2d}. Number {num:2d}: Z-score = {z_score:6.2f} ({count:3d} times)")
        
        print(f"\n🎯 POWERBALL ANALYSIS:")
        print(f"   Most frequent: {self.pb_freq.most_common(1)[0][0]} ({self.pb_freq.most_common(1)[0][1]} times)")
        print(f"   Least frequent: {self.pb_freq.most_common()[-1][0]} ({self.pb_freq.most_common()[-1][1]} times)")

def main():
    """Main function to run the final lottery generator."""
    csv_file = "Lottery_Powerball_Winning_Numbers__Beginning_2010.csv"
    
    try:
        generator = FinalLotteryGenerator(csv_file)
        generator.show_final_analysis()
        
        print("\n" + "="*60)
        print("🎲 GENERATING FINAL LOTTERY NUMBERS")
        print("="*60)
        
        # Generate multiple sets
        generated_sets = generator.generate_final_sets(20)
        
        print("\n" + "="*60)
        print("✅ FINAL GENERATION COMPLETE!")
        print("="*60)
        print("🚀 FINAL STRATEGIES:")
        print("   • Ultimate Hot: Maximum hot number bias")
        print("   • Ultimate Cold: Maximum cold number bias (contrarian)")
        print("   • Ultimate Balanced: Perfect hot/cold balance")
        print("   • Frequency-Weighted: Uses actual historical frequencies")
        print("   • Position-Based: Uses historical position preferences")
        print("   • Random: Pure random selection (baseline)")
        print("\n⚠️  FINAL DISCLAIMER:")
        print("   These are the most sophisticated lottery number selections")
        print("   possible based on 15+ years of historical data analysis!")
        print("   However, lottery numbers are RANDOM - no strategy can")
        print("   guarantee winning! Use for entertainment only!")
        print("   Always play responsibly and within your means!")
        
    except FileNotFoundError:
        print(f"Error: Could not find the file '{csv_file}'")
        print("Please make sure the CSV file is in the same directory as this script.")
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
