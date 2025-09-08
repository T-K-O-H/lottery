#!/usr/bin/env python3
"""
Smart Lottery Number Generator
Uses pattern analysis to generate intelligent lottery numbers.
"""

import pandas as pd
import numpy as np
import random
from collections import Counter
import warnings
warnings.filterwarnings('ignore')

class SmartLotteryGenerator:
    def __init__(self, csv_file):
        """Initialize the generator with lottery data."""
        self.csv_file = csv_file
        self.df = None
        self.white_balls = []
        self.powerballs = []
        self.hot_numbers = []
        self.cold_numbers = []
        self.load_data()
        self.analyze_patterns()
    
    def load_data(self):
        """Load and preprocess the lottery data."""
        print("Loading lottery data for smart generation...")
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
    
    def analyze_patterns(self):
        """Analyze patterns to identify hot/cold numbers."""
        print("Analyzing patterns...")
        
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
        
        print(f"Found {len(self.hot_numbers)} hot numbers and {len(self.cold_numbers)} cold numbers")
    
    def generate_hot_strategy(self):
        """Generate numbers favoring hot numbers."""
        print("\n🔥 HOT STRATEGY (Favor Hot Numbers)")
        print("="*40)
        
        white_balls = []
        
        # Select 3-4 hot numbers
        hot_count = random.randint(3, 4)
        hot_selected = random.sample([num for num, _, _ in self.hot_numbers], hot_count)
        white_balls.extend(hot_selected)
        
        # Fill remaining with random numbers
        remaining = 5 - len(white_balls)
        all_numbers = list(range(1, 70))
        available = [num for num in all_numbers if num not in white_balls]
        white_balls.extend(random.sample(available, remaining))
        
        # Generate powerball
        powerball = random.randint(1, 26)
        
        return sorted(white_balls), powerball
    
    def generate_cold_strategy(self):
        """Generate numbers favoring cold numbers (contrarian)."""
        print("\n❄️  COLD STRATEGY (Favor Cold Numbers)")
        print("="*40)
        
        white_balls = []
        
        # Select 3-4 cold numbers
        cold_count = random.randint(3, 4)
        cold_selected = random.sample([num for num, _, _ in self.cold_numbers], cold_count)
        white_balls.extend(cold_selected)
        
        # Fill remaining with random numbers
        remaining = 5 - len(white_balls)
        all_numbers = list(range(1, 70))
        available = [num for num in all_numbers if num not in white_balls]
        white_balls.extend(random.sample(available, remaining))
        
        # Generate powerball
        powerball = random.randint(1, 26)
        
        return sorted(white_balls), powerball
    
    def generate_balanced_strategy(self):
        """Generate numbers with balanced approach."""
        print("\n⚖️  BALANCED STRATEGY (Mix Hot and Cold)")
        print("="*40)
        
        white_balls = []
        
        # Select 2 hot numbers
        if self.hot_numbers:
            hot_selected = random.sample([num for num, _, _ in self.hot_numbers], min(2, len(self.hot_numbers)))
            white_balls.extend(hot_selected)
        
        # Select 2 cold numbers
        if self.cold_numbers:
            cold_selected = random.sample([num for num, _, _ in self.cold_numbers], min(2, len(self.cold_numbers)))
            white_balls.extend(cold_selected)
        
        # Fill remaining with random numbers
        remaining = 5 - len(white_balls)
        all_numbers = list(range(1, 70))
        available = [num for num in all_numbers if num not in white_balls]
        white_balls.extend(random.sample(available, remaining))
        
        # Generate powerball
        powerball = random.randint(1, 26)
        
        return sorted(white_balls), powerball
    
    def generate_position_strategy(self):
        """Generate numbers based on position preferences."""
        print("\n🎯 POSITION STRATEGY (Historical Position Patterns)")
        print("="*40)
        
        # Position preferences from our analysis
        position_preferences = {
            0: [1, 2, 3, 4, 5],  # 1st position (lowest)
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
            if hot_in_position and random.random() < 0.7:
                white_balls.append(random.choice(hot_in_position))
            else:
                white_balls.append(random.choice(preferred_nums))
        
        # Ensure uniqueness
        while len(set(white_balls)) < 5:
            white_balls = list(set(white_balls))
            remaining = 5 - len(white_balls)
            all_numbers = list(range(1, 70))
            available = [num for num in all_numbers if num not in white_balls]
            white_balls.extend(random.sample(available, remaining))
        
        # Generate powerball
        powerball = random.randint(1, 26)
        
        return sorted(white_balls), powerball
    
    def generate_random_strategy(self):
        """Generate completely random numbers."""
        print("\n🎲 RANDOM STRATEGY (Pure Random)")
        print("="*40)
        
        white_balls = sorted(random.sample(range(1, 70), 5))
        powerball = random.randint(1, 26)
        
        return white_balls, powerball
    
    def display_numbers(self, white_balls, powerball, strategy_name):
        """Display the generated numbers."""
        print(f"\n{strategy_name} Generated Numbers:")
        print(f"White Balls: {' '.join(f'{num:02d}' for num in white_balls)}")
        print(f"Powerball: {powerball:02d}")
        
        # Show analysis
        hot_count = sum(1 for num in white_balls if num in [hot[0] for hot in self.hot_numbers])
        cold_count = sum(1 for num in white_balls if num in [cold[0] for cold in self.cold_numbers])
        neutral_count = 5 - hot_count - cold_count
        
        print(f"Analysis: {hot_count} hot, {cold_count} cold, {neutral_count} neutral")
        
        return white_balls, powerball
    
    def generate_multiple_sets(self, num_sets=5):
        """Generate multiple sets of numbers using different strategies."""
        print("🎰 SMART LOTTERY NUMBER GENERATOR")
        print("="*50)
        print("Based on advanced pattern analysis")
        print("="*50)
        
        strategies = [
            ("Hot Strategy", self.generate_hot_strategy),
            ("Cold Strategy", self.generate_cold_strategy),
            ("Balanced Strategy", self.generate_balanced_strategy),
            ("Position Strategy", self.generate_position_strategy),
            ("Random Strategy", self.generate_random_strategy)
        ]
        
        generated_sets = []
        
        for i in range(num_sets):
            strategy_name, generator_func = strategies[i % len(strategies)]
            white_balls, powerball = generator_func()
            generated_sets.append((white_balls, powerball, strategy_name))
            self.display_numbers(white_balls, powerball, strategy_name)
        
        return generated_sets
    
    def show_analysis(self):
        """Show the hot and cold number analysis."""
        print("\n" + "="*50)
        print("📊 HOT AND COLD NUMBER ANALYSIS")
        print("="*50)
        
        print(f"\n🔥 HOTTEST WHITE BALLS (Z-score > 2):")
        for i, (num, z_score, count) in enumerate(self.hot_numbers[:10], 1):
            print(f"   {i:2d}. Number {num:2d}: Z-score = {z_score:6.2f} ({count:3d} times)")
        
        print(f"\n❄️  COLDEST WHITE BALLS (Z-score < -2):")
        for i, (num, z_score, count) in enumerate(self.cold_numbers[:10], 1):
            print(f"   {i:2d}. Number {num:2d}: Z-score = {z_score:6.2f} ({count:3d} times)")

def main():
    """Main function to run the smart lottery generator."""
    csv_file = "Lottery_Powerball_Winning_Numbers__Beginning_2010.csv"
    
    try:
        generator = SmartLotteryGenerator(csv_file)
        generator.show_analysis()
        
        print("\n" + "="*50)
        print("🎲 GENERATING SMART LOTTERY NUMBERS")
        print("="*50)
        
        # Generate multiple sets
        generated_sets = generator.generate_multiple_sets(10)
        
        print("\n" + "="*50)
        print("✅ GENERATION COMPLETE!")
        print("="*50)
        print("💡 STRATEGY EXPLANATIONS:")
        print("   • Hot Strategy: Favors historically hot numbers")
        print("   • Cold Strategy: Favors historically cold numbers (contrarian)")
        print("   • Balanced Strategy: Mix of hot and cold numbers")
        print("   • Position Strategy: Uses historical position preferences")
        print("   • Random Strategy: Pure random selection (baseline)")
        print("\n⚠️  DISCLAIMER:")
        print("   These numbers are for entertainment purposes only!")
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
