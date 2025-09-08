#!/usr/bin/env python3
"""
Intelligent Lottery Number Generator
Uses advanced pattern analysis to generate "smart" lottery numbers based on historical data.
"""

import pandas as pd
import numpy as np
import random
from collections import Counter
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class IntelligentLotteryGenerator:
    def __init__(self, csv_file):
        """Initialize the generator with lottery data."""
        self.csv_file = csv_file
        self.df = None
        self.white_balls = []
        self.powerballs = []
        self.hot_numbers = []
        self.cold_numbers = []
        self.hot_powerballs = []
        self.cold_powerballs = []
        self.load_data()
        self.analyze_patterns()
    
    def load_data(self):
        """Load and preprocess the lottery data."""
        print("Loading lottery data for intelligent generation...")
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
        
        print(f"Loaded {len(self.df)} lottery draws from {self.df['Draw Date'].min().strftime('%Y-%m-%d')} to {self.df['Draw Date'].max().strftime('%Y-%m-%d')}")
    
    def analyze_patterns(self):
        """Analyze patterns to identify hot/cold numbers and other insights."""
        print("Analyzing patterns for intelligent generation...")
        
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
        
        print(f"Identified {len(self.hot_numbers)} hot white balls and {len(self.cold_numbers)} cold white balls")
        print(f"Identified {len(self.hot_powerballs)} hot powerballs and {len(self.cold_powerballs)} cold powerballs")
    
    def generate_conservative_numbers(self):
        """Generate numbers using conservative approach (favor hot numbers)."""
        print("\n🎯 CONSERVATIVE APPROACH (Favor Hot Numbers)")
        print("="*50)
        
        # Weight hot numbers more heavily
        hot_weight = 0.7
        cold_weight = 0.1
        neutral_weight = 0.2
        
        # Create weighted selection pool
        selection_pool = []
        
        # Add hot numbers with high weight
        for num, z_score, count in self.hot_numbers:
            weight = int(hot_weight * 100)
            selection_pool.extend([num] * weight)
        
        # Add cold numbers with low weight
        for num, z_score, count in self.cold_numbers:
            weight = int(cold_weight * 10)
            selection_pool.extend([num] * weight)
        
        # Add neutral numbers (not hot or cold)
        neutral_numbers = [num for num in range(1, 70) 
                          if not any(num == hot[0] for hot in self.hot_numbers) and
                          not any(num == cold[0] for cold in self.cold_numbers)]
        for num in neutral_numbers:
            weight = int(neutral_weight * 20)
            selection_pool.extend([num] * weight)
        
        # Generate 5 unique white balls
        white_balls = []
        while len(white_balls) < 5:
            num = random.choice(selection_pool)
            if num not in white_balls:
                white_balls.append(num)
        
        # Generate powerball (favor hot powerballs)
        pb_pool = []
        for num, z_score, count in self.hot_powerballs:
            weight = int(0.8 * 50)
            pb_pool.extend([num] * weight)
        
        # Add neutral powerballs
        neutral_pbs = [num for num in range(1, 27) 
                      if not any(num == hot[0] for hot in self.hot_powerballs) and
                      not any(num == cold[0] for cold in self.cold_powerballs)]
        for num in neutral_pbs:
            pb_pool.extend([num] * 10)
        
        powerball = random.choice(pb_pool)
        
        return sorted(white_balls), powerball
    
    def generate_balanced_numbers(self):
        """Generate numbers using balanced approach (mix of hot and cold)."""
        print("\n⚖️  BALANCED APPROACH (Mix Hot and Cold)")
        print("="*50)
        
        # Select 2-3 hot numbers, 1-2 cold numbers, 1-2 neutral
        white_balls = []
        
        # Add 2-3 hot numbers
        hot_count = random.randint(2, 3)
        hot_selected = random.sample([num for num, _, _ in self.hot_numbers], hot_count)
        white_balls.extend(hot_selected)
        
        # Add 1-2 cold numbers
        cold_count = random.randint(1, 2)
        cold_selected = random.sample([num for num, _, _ in self.cold_numbers], cold_count)
        white_balls.extend(cold_selected)
        
        # Fill remaining with neutral numbers
        remaining = 5 - len(white_balls)
        neutral_numbers = [num for num in range(1, 70) 
                          if num not in white_balls and
                          not any(num == hot[0] for hot in self.hot_numbers) and
                          not any(num == cold[0] for cold in self.cold_numbers)]
        neutral_selected = random.sample(neutral_numbers, remaining)
        white_balls.extend(neutral_selected)
        
        # Generate powerball (balanced)
        if self.hot_powerballs and random.random() < 0.6:  # 60% chance for hot powerball
            powerball = random.choice([num for num, _, _ in self.hot_powerballs])
        else:  # 40% chance for neutral powerball
            neutral_pbs = [num for num in range(1, 27) 
                          if not any(num == hot[0] for hot in self.hot_powerballs) and
                          not any(num == cold[0] for cold in self.cold_powerballs)]
            powerball = random.choice(neutral_pbs)
        
        return sorted(white_balls), powerball
    
    def generate_contrarian_numbers(self):
        """Generate numbers using contrarian approach (favor cold numbers)."""
        print("\n🔄 CONTRARIAN APPROACH (Favor Cold Numbers)")
        print("="*50)
        
        # Weight cold numbers more heavily (contrarian strategy)
        white_balls = []
        
        # Add 3-4 cold numbers
        cold_count = random.randint(3, 4)
        cold_selected = random.sample([num for num, _, _ in self.cold_numbers], cold_count)
        white_balls.extend(cold_selected)
        
        # Fill remaining with neutral numbers
        remaining = 5 - len(white_balls)
        neutral_numbers = [num for num in range(1, 70) 
                          if num not in white_balls and
                          not any(num == hot[0] for hot in self.hot_numbers) and
                          not any(num == cold[0] for cold in self.cold_numbers)]
        neutral_selected = random.sample(neutral_numbers, remaining)
        white_balls.extend(neutral_selected)
        
        # Generate powerball (contrarian)
        if self.cold_powerballs and random.random() < 0.7:  # 70% chance for cold powerball
            powerball = random.choice([num for num, _, _ in self.cold_powerballs])
        else:  # 30% chance for neutral powerball
            neutral_pbs = [num for num in range(1, 27) 
                          if not any(num == hot[0] for hot in self.hot_powerballs) and
                          not any(num == cold[0] for cold in self.cold_numbers)]
            powerball = random.choice(neutral_pbs)
        
        return sorted(white_balls), powerball
    
    def generate_pattern_based_numbers(self):
        """Generate numbers based on historical patterns."""
        print("\n🔍 PATTERN-BASED APPROACH (Historical Patterns)")
        print("="*50)
        
        # Analyze historical patterns
        white_balls = []
        
        # Position-based selection (from our analysis)
        position_preferences = {
            0: [1, 2, 3, 4, 5],  # 1st position (lowest)
            1: [12, 21, 28, 16, 15],  # 2nd position
            2: [37, 33, 35, 34, 32],  # 3rd position (middle)
            3: [52, 53, 45, 47, 39],  # 4th position
            4: [69, 59, 58, 67, 68]   # 5th position (highest)
        }
        
        # Select one number from each position preference
        for pos in range(5):
            preferred_nums = position_preferences[pos]
            # Weight towards hot numbers in this position
            hot_in_position = [num for num in preferred_nums if num in [hot[0] for hot in self.hot_numbers]]
            if hot_in_position and random.random() < 0.7:
                white_balls.append(random.choice(hot_in_position))
            else:
                white_balls.append(random.choice(preferred_nums))
        
        # Ensure uniqueness
        while len(set(white_balls)) < 5:
            white_balls = list(set(white_balls))
            remaining = 5 - len(white_balls)
            neutral_numbers = [num for num in range(1, 70) if num not in white_balls]
            white_balls.extend(random.sample(neutral_numbers, remaining))
        
        # Generate powerball based on historical frequency
        pb_freq = Counter(self.powerballs)
        most_common_pbs = [num for num, count in pb_freq.most_common(10)]
        powerball = random.choice(most_common_pbs)
        
        return sorted(white_balls), powerball
    
    def generate_random_numbers(self):
        """Generate completely random numbers (baseline)."""
        print("\n🎲 RANDOM APPROACH (Pure Random)")
        print("="*50)
        
        white_balls = sorted(random.sample(range(1, 70), 5))
        powerball = random.randint(1, 26)
        
        return white_balls, powerball
    
    def display_generated_numbers(self, white_balls, powerball, approach_name):
        """Display the generated numbers in a nice format."""
        print(f"\n{approach_name} Generated Numbers:")
        print(f"White Balls: {' '.join(f'{num:02d}' for num in white_balls)}")
        print(f"Powerball: {powerball:02d}")
        
        # Show analysis of generated numbers
        hot_count = sum(1 for num in white_balls if num in [hot[0] for hot in self.hot_numbers])
        cold_count = sum(1 for num in white_balls if num in [cold[0] for cold in self.cold_numbers])
        neutral_count = 5 - hot_count - cold_count
        
        print(f"Analysis: {hot_count} hot, {cold_count} cold, {neutral_count} neutral")
        
        # Check if powerball is hot or cold
        pb_status = "hot" if powerball in [hot[0] for hot in self.hot_powerballs] else "cold" if powerball in [cold[0] for cold in self.cold_powerballs] else "neutral"
        print(f"Powerball: {pb_status}")
        
        return white_balls, powerball
    
    def generate_multiple_sets(self, num_sets=5):
        """Generate multiple sets of numbers using different approaches."""
        print("🎰 INTELLIGENT LOTTERY NUMBER GENERATOR")
        print("="*60)
        print("Based on advanced pattern analysis of historical data")
        print("="*60)
        
        approaches = [
            ("Conservative", self.generate_conservative_numbers),
            ("Balanced", self.generate_balanced_numbers),
            ("Contrarian", self.generate_contrarian_numbers),
            ("Pattern-Based", self.generate_pattern_based_numbers),
            ("Random", self.generate_random_numbers)
        ]
        
        generated_sets = []
        
        for i in range(num_sets):
            approach_name, generator_func = approaches[i % len(approaches)]
            white_balls, powerball = generator_func()
            generated_sets.append((white_balls, powerball, approach_name))
            self.display_generated_numbers(white_balls, powerball, approach_name)
        
        return generated_sets
    
    def show_hot_cold_analysis(self):
        """Show the hot and cold number analysis."""
        print("\n" + "="*60)
        print("📊 HOT AND COLD NUMBER ANALYSIS")
        print("="*60)
        
        print(f"\n🔥 HOTTEST WHITE BALLS (Z-score > 2):")
        for i, (num, z_score, count) in enumerate(self.hot_numbers[:10], 1):
            print(f"   {i:2d}. Number {num:2d}: Z-score = {z_score:6.2f} ({count:3d} times)")
        
        print(f"\n❄️  COLDEST WHITE BALLS (Z-score < -2):")
        for i, (num, z_score, count) in enumerate(self.cold_numbers[:10], 1):
            print(f"   {i:2d}. Number {num:2d}: Z-score = {z_score:6.2f} ({count:3d} times)")
        
        print(f"\n🎯 HOTTEST POWERBALLS (Z-score > 1.5):")
        for i, (num, z_score, count) in enumerate(self.hot_powerballs[:5], 1):
            print(f"   {i:2d}. Number {num:2d}: Z-score = {z_score:6.2f} ({count:3d} times)")
        
        print(f"\n❄️  COLDEST POWERBALLS (Z-score < -1.5):")
        for i, (num, z_score, count) in enumerate(self.cold_powerballs[:5], 1):
            print(f"   {i:2d}. Number {num:2d}: Z-score = {z_score:6.2f} ({count:3d} times)")

def main():
    """Main function to run the intelligent lottery generator."""
    csv_file = "Lottery_Powerball_Winning_Numbers__Beginning_2010.csv"
    
    try:
        generator = IntelligentLotteryGenerator(csv_file)
        generator.show_hot_cold_analysis()
        
        print("\n" + "="*60)
        print("🎲 GENERATING INTELLIGENT LOTTERY NUMBERS")
        print("="*60)
        
        # Generate multiple sets
        generated_sets = generator.generate_multiple_sets(10)
        
        print("\n" + "="*60)
        print("✅ GENERATION COMPLETE!")
        print("="*60)
        print("💡 TIPS:")
        print("   • Conservative: Favors historically hot numbers")
        print("   • Balanced: Mix of hot, cold, and neutral numbers")
        print("   • Contrarian: Favors historically cold numbers (contrarian strategy)")
        print("   • Pattern-Based: Uses position preferences from historical analysis")
        print("   • Random: Pure random selection (baseline)")
        print("\n⚠️  DISCLAIMER:")
        print("   These numbers are generated for entertainment purposes only!")
        print("   Lottery numbers are random - no strategy guarantees winning!")
        print("   Use responsibly and within your means!")
        
    except FileNotFoundError:
        print(f"Error: Could not find the file '{csv_file}'")
        print("Please make sure the CSV file is in the same directory as this script.")
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
