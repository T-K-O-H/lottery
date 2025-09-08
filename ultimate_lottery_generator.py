#!/usr/bin/env python3
"""
Ultimate Lottery Number Generator
Uses ALL advanced pattern analysis findings to generate the most intelligent selections possible.
"""

import pandas as pd
import numpy as np
import random
from collections import Counter
import warnings
warnings.filterwarnings('ignore')

class UltimateLotteryGenerator:
    def __init__(self, csv_file):
        """Initialize the ultimate generator with lottery data."""
        self.csv_file = csv_file
        self.df = None
        self.white_balls = []
        self.powerballs = []
        self.hot_numbers = []
        self.cold_numbers = []
        self.hot_powerballs = []
        self.cold_powerballs = []
        self.position_preferences = {}
        self.load_data()
        self.analyze_all_patterns()
    
    def load_data(self):
        """Load and preprocess the lottery data."""
        print("Loading lottery data for ultimate generation...")
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
        print("Analyzing ALL patterns for ultimate generation...")
        
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
        
        # Identify hot and cold powerballs
        self.hot_powerballs = []
        self.cold_powerballs = []
        
        for num in range(1, 27):
            observed_count = pb_freq.get(num, 0)
            z_score = (observed_count - expected_pb) / np.sqrt(expected_pb)
            if z_score > 1.5:  # Hot powerballs
                self.hot_powerballs.append((num, z_score, observed_count))
            elif z_score < -1.5:  # Cold powerballs
                self.cold_powerballs.append((num, z_score, observed_count))
        
        # Sort by Z-score
        self.hot_powerballs.sort(key=lambda x: x[1], reverse=True)
        self.cold_powerballs.sort(key=lambda x: x[1])
        
        # Analyze position preferences
        self.analyze_position_patterns()
        
        print(f"Found {len(self.hot_numbers)} hot white balls, {len(self.cold_numbers)} cold white balls")
        print(f"Found {len(self.hot_powerballs)} hot powerballs, {len(self.cold_powerballs)} cold powerballs")
    
    def analyze_position_patterns(self):
        """Analyze position-specific patterns."""
        position_freq = {i: Counter() for i in range(5)}
        
        for _, row in self.df.iterrows():
            sorted_nums = sorted(row['White Balls'])
            for pos, num in enumerate(sorted_nums):
                position_freq[pos][num] += 1
        
        # Get top 5 numbers for each position
        self.position_preferences = {}
        for pos in range(5):
            top_numbers = [num for num, count in position_freq[pos].most_common(5)]
            self.position_preferences[pos] = top_numbers
    
    def generate_ultimate_strategy(self):
        """Generate numbers using the ultimate strategy combining ALL findings."""
        print("\n🚀 ULTIMATE STRATEGY (All Advanced Findings)")
        print("="*50)
        
        white_balls = []
        
        # Strategy: Use position preferences with hot number bias
        for pos in range(5):
            preferred_nums = self.position_preferences[pos]
            
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
        
        # Generate powerball using frequency-based selection
        pb_freq = Counter(self.powerballs)
        most_common_pbs = [num for num, count in pb_freq.most_common(10)]
        powerball = random.choice(most_common_pbs)
        
        return sorted(white_balls), powerball
    
    def generate_super_hot_strategy(self):
        """Generate numbers using maximum hot number bias."""
        print("\n🔥 SUPER HOT STRATEGY (Maximum Hot Bias)")
        print("="*50)
        
        white_balls = []
        
        # Select 4-5 hot numbers
        hot_count = random.randint(4, 5)
        hot_selected = random.sample([num for num, _, _ in self.hot_numbers], hot_count)
        white_balls.extend(hot_selected)
        
        # Fill remaining with position-preferred numbers
        remaining = 5 - len(white_balls)
        if remaining > 0:
            all_preferred = []
            for pos in range(5):
                all_preferred.extend(self.position_preferences[pos])
            
            available_preferred = [num for num in all_preferred if num not in white_balls]
            if available_preferred:
                white_balls.extend(random.sample(available_preferred, min(remaining, len(available_preferred))))
        
        # Fill any remaining with random
        while len(white_balls) < 5:
            all_numbers = list(range(1, 70))
            available = [num for num in all_numbers if num not in white_balls]
            white_balls.append(random.choice(available))
        
        # Generate powerball (favor most frequent)
        pb_freq = Counter(self.powerballs)
        most_common_pbs = [num for num, count in pb_freq.most_common(5)]
        powerball = random.choice(most_common_pbs)
        
        return sorted(white_balls), powerball
    
    def generate_contrarian_ultimate(self):
        """Generate numbers using ultimate contrarian strategy."""
        print("\n🔄 ULTIMATE CONTRARIAN (Maximum Cold Bias)")
        print("="*50)
        
        white_balls = []
        
        # Select 4-5 cold numbers
        cold_count = random.randint(4, 5)
        cold_selected = random.sample([num for num, _, _ in self.cold_numbers], cold_count)
        white_balls.extend(cold_selected)
        
        # Fill remaining with least frequent numbers
        remaining = 5 - len(white_balls)
        if remaining > 0:
            white_freq = Counter(self.white_balls)
            least_frequent = [num for num, count in white_freq.most_common()[-20:]]
            available_least = [num for num in least_frequent if num not in white_balls]
            if available_least:
                white_balls.extend(random.sample(available_least, min(remaining, len(available_least))))
        
        # Fill any remaining with random
        while len(white_balls) < 5:
            all_numbers = list(range(1, 70))
            available = [num for num in all_numbers if num not in white_balls]
            white_balls.append(random.choice(available))
        
        # Generate powerball (favor least frequent)
        pb_freq = Counter(self.powerballs)
        least_frequent_pbs = [num for num, count in pb_freq.most_common()[-10:]]
        powerball = random.choice(least_frequent_pbs)
        
        return sorted(white_balls), powerball
    
    def generate_balanced_ultimate(self):
        """Generate numbers using ultimate balanced strategy."""
        print("\n⚖️  ULTIMATE BALANCED (Perfect Balance)")
        print("="*50)
        
        white_balls = []
        
        # Select 2 hot numbers
        if self.hot_numbers:
            hot_selected = random.sample([num for num, _, _ in self.hot_numbers], min(2, len(self.hot_numbers)))
            white_balls.extend(hot_selected)
        
        # Select 2 cold numbers
        if self.cold_numbers:
            cold_selected = random.sample([num for num, _, _ in self.cold_numbers], min(2, len(self.cold_numbers)))
            white_balls.extend(cold_selected)
        
        # Fill remaining with position-preferred numbers
        remaining = 5 - len(white_balls)
        if remaining > 0:
            all_preferred = []
            for pos in range(5):
                all_preferred.extend(self.position_preferences[pos])
            
            available_preferred = [num for num in all_preferred if num not in white_balls]
            if available_preferred:
                white_balls.extend(random.sample(available_preferred, min(remaining, len(available_preferred))))
        
        # Fill any remaining with random
        while len(white_balls) < 5:
            all_numbers = list(range(1, 70))
            available = [num for num in all_numbers if num not in white_balls]
            white_balls.append(random.choice(available))
        
        # Generate powerball (balanced)
        pb_freq = Counter(self.powerballs)
        if random.random() < 0.6:  # 60% chance for frequent
            most_common_pbs = [num for num, count in pb_freq.most_common(10)]
            powerball = random.choice(most_common_pbs)
        else:  # 40% chance for less frequent
            least_frequent_pbs = [num for num, count in pb_freq.most_common()[-10:]]
            powerball = random.choice(least_frequent_pbs)
        
        return sorted(white_balls), powerball
    
    def generate_frequency_weighted(self):
        """Generate numbers using frequency-weighted selection."""
        print("\n📊 FREQUENCY-WEIGHTED STRATEGY")
        print("="*50)
        
        # Create weighted selection pool based on actual frequencies
        white_freq = Counter(self.white_balls)
        selection_pool = []
        
        for num in range(1, 70):
            count = white_freq.get(num, 0)
            # Weight by actual frequency (not just hot/cold)
            weight = max(1, count // 10)  # Scale down but maintain relative weights
            selection_pool.extend([num] * weight)
        
        # Generate 5 unique numbers
        white_balls = []
        while len(white_balls) < 5:
            num = random.choice(selection_pool)
            if num not in white_balls:
                white_balls.append(num)
        
        # Generate powerball using frequency weighting
        pb_freq = Counter(self.powerballs)
        pb_pool = []
        for num in range(1, 27):
            count = pb_freq.get(num, 0)
            weight = max(1, count // 5)
            pb_pool.extend([num] * weight)
        
        powerball = random.choice(pb_pool)
        
        return sorted(white_balls), powerball
    
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
        
        # Check powerball status
        pb_status = "hot" if powerball in [hot[0] for hot in self.hot_powerballs] else "cold" if powerball in [cold[0] for cold in self.cold_powerballs] else "neutral"
        print(f"Powerball: {pb_status}")
        
        # Calculate sum and other stats
        total_sum = sum(white_balls)
        even_count = sum(1 for num in white_balls if num % 2 == 0)
        print(f"Sum: {total_sum}, Even count: {even_count}")
        
        return white_balls, powerball
    
    def generate_ultimate_sets(self, num_sets=10):
        """Generate multiple sets using ultimate strategies."""
        print("🎰 ULTIMATE LOTTERY NUMBER GENERATOR")
        print("="*60)
        print("Using ALL advanced pattern analysis findings")
        print("="*60)
        
        strategies = [
            ("Ultimate Strategy", self.generate_ultimate_strategy),
            ("Super Hot Strategy", self.generate_super_hot_strategy),
            ("Ultimate Contrarian", self.generate_contrarian_ultimate),
            ("Ultimate Balanced", self.generate_balanced_ultimate),
            ("Frequency-Weighted", self.generate_frequency_weighted)
        ]
        
        generated_sets = []
        
        for i in range(num_sets):
            strategy_name, generator_func = strategies[i % len(strategies)]
            white_balls, powerball = generator_func()
            generated_sets.append((white_balls, powerball, strategy_name))
            self.display_numbers(white_balls, powerball, strategy_name)
        
        return generated_sets
    
    def show_complete_analysis(self):
        """Show the complete analysis from our findings."""
        print("\n" + "="*60)
        print("📊 COMPLETE PATTERN ANALYSIS")
        print("="*60)
        
        print(f"\n🔥 HOTTEST WHITE BALLS (Z-score > 2):")
        for i, (num, z_score, count) in enumerate(self.hot_numbers, 1):
            print(f"   {i:2d}. Number {num:2d}: Z-score = {z_score:6.2f} ({count:3d} times)")
        
        print(f"\n❄️  COLDEST WHITE BALLS (Z-score < -2):")
        for i, (num, z_score, count) in enumerate(self.cold_numbers, 1):
            print(f"   {i:2d}. Number {num:2d}: Z-score = {z_score:6.2f} ({count:3d} times)")
        
        print(f"\n🎯 POSITION PREFERENCES:")
        positions = ['1st (lowest)', '2nd', '3rd (middle)', '4th', '5th (highest)']
        for pos in range(5):
            print(f"   {positions[pos]:12s}: {self.position_preferences[pos]}")
        
        print(f"\n🎯 POWERBALL ANALYSIS:")
        pb_freq = Counter(self.powerballs)
        print(f"   Most frequent: {pb_freq.most_common(1)[0][0]} ({pb_freq.most_common(1)[0][1]} times)")
        print(f"   Least frequent: {pb_freq.most_common()[-1][0]} ({pb_freq.most_common()[-1][1]} times)")

def main():
    """Main function to run the ultimate lottery generator."""
    csv_file = "Lottery_Powerball_Winning_Numbers__Beginning_2010.csv"
    
    try:
        generator = UltimateLotteryGenerator(csv_file)
        generator.show_complete_analysis()
        
        print("\n" + "="*60)
        print("🎲 GENERATING ULTIMATE LOTTERY NUMBERS")
        print("="*60)
        
        # Generate multiple sets
        generated_sets = generator.generate_ultimate_sets(15)
        
        print("\n" + "="*60)
        print("✅ ULTIMATE GENERATION COMPLETE!")
        print("="*60)
        print("🚀 ULTIMATE STRATEGIES:")
        print("   • Ultimate Strategy: Combines ALL findings (position + hot bias)")
        print("   • Super Hot Strategy: Maximum hot number bias (4-5 hot numbers)")
        print("   • Ultimate Contrarian: Maximum cold number bias (contrarian)")
        print("   • Ultimate Balanced: Perfect hot/cold balance")
        print("   • Frequency-Weighted: Uses actual historical frequencies")
        print("\n⚠️  IMPORTANT DISCLAIMER:")
        print("   These are the most intelligent selections possible based on")
        print("   historical data analysis, but lottery numbers are RANDOM!")
        print("   No strategy, no matter how sophisticated, can guarantee winning!")
        print("   Use for entertainment and research purposes only!")
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
