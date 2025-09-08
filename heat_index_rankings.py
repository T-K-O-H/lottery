#!/usr/bin/env python3
"""
Lottery Number Heat Index Rankings
Comprehensive ranking of all lottery numbers by their "heat index" based on statistical analysis.
"""

import pandas as pd
import numpy as np
from collections import Counter
import warnings
warnings.filterwarnings('ignore')

class HeatIndexRankings:
    def __init__(self, csv_file):
        """Initialize the heat index analyzer."""
        self.csv_file = csv_file
        self.df = None
        self.white_balls = []
        self.powerballs = []
        self.load_data()
        self.calculate_heat_index()
    
    def load_data(self):
        """Load and preprocess the lottery data."""
        print("Loading lottery data for heat index analysis...")
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
    
    def calculate_heat_index(self):
        """Calculate comprehensive heat index for all numbers."""
        print("Calculating heat index rankings...")
        
        # Calculate frequencies
        white_freq = Counter(self.white_balls)
        pb_freq = Counter(self.powerballs)
        
        # Calculate expected frequencies
        expected_white = len(self.white_balls) / 69
        expected_pb = len(self.powerballs) / 26
        
        # Calculate Z-scores for white balls
        self.white_heat_data = []
        for num in range(1, 70):
            observed_count = white_freq.get(num, 0)
            z_score = (observed_count - expected_white) / np.sqrt(expected_white)
            
            # Calculate additional metrics
            frequency = observed_count
            percentage = (observed_count / len(self.white_balls)) * 100
            deviation = observed_count - expected_white
            
            # Create heat index (0-100 scale)
            # Z-score of +3 = 100, Z-score of -3 = 0, Z-score of 0 = 50
            heat_index = max(0, min(100, 50 + (z_score * 16.67)))
            
            self.white_heat_data.append({
                'number': num,
                'frequency': frequency,
                'expected': expected_white,
                'deviation': deviation,
                'percentage': percentage,
                'z_score': z_score,
                'heat_index': heat_index,
                'category': self.get_heat_category(z_score)
            })
        
        # Calculate Z-scores for powerballs
        self.pb_heat_data = []
        for num in range(1, 27):
            observed_count = pb_freq.get(num, 0)
            z_score = (observed_count - expected_pb) / np.sqrt(expected_pb)
            
            # Calculate additional metrics
            frequency = observed_count
            percentage = (observed_count / len(self.powerballs)) * 100
            deviation = observed_count - expected_pb
            
            # Create heat index (0-100 scale)
            heat_index = max(0, min(100, 50 + (z_score * 16.67)))
            
            self.pb_heat_data.append({
                'number': num,
                'frequency': frequency,
                'expected': expected_pb,
                'deviation': deviation,
                'percentage': percentage,
                'z_score': z_score,
                'heat_index': heat_index,
                'category': self.get_heat_category(z_score)
            })
        
        # Sort by heat index (descending)
        self.white_heat_data.sort(key=lambda x: x['heat_index'], reverse=True)
        self.pb_heat_data.sort(key=lambda x: x['heat_index'], reverse=True)
    
    def get_heat_category(self, z_score):
        """Categorize numbers based on Z-score."""
        if z_score >= 2:
            return "🔥 BLAZING HOT"
        elif z_score >= 1:
            return "🔥 HOT"
        elif z_score >= 0.5:
            return "🌡️ WARM"
        elif z_score >= -0.5:
            return "🌡️ NEUTRAL"
        elif z_score >= -1:
            return "❄️ COOL"
        elif z_score >= -2:
            return "❄️ COLD"
        else:
            return "🧊 FREEZING"
    
    def display_white_ball_rankings(self):
        """Display comprehensive white ball heat index rankings."""
        print("\n" + "="*80)
        print("🔥 WHITE BALL HEAT INDEX RANKINGS (1-69)")
        print("="*80)
        print(f"{'Rank':<4} {'Number':<6} {'Heat Index':<10} {'Category':<15} {'Freq':<5} {'Z-Score':<8} {'%':<6}")
        print("-" * 80)
        
        for i, data in enumerate(self.white_heat_data, 1):
            print(f"{i:<4} {data['number']:<6} {data['heat_index']:<10.1f} {data['category']:<15} "
                  f"{data['frequency']:<5} {data['z_score']:<8.2f} {data['percentage']:<6.2f}")
    
    def display_powerball_rankings(self):
        """Display comprehensive powerball heat index rankings."""
        print("\n" + "="*80)
        print("🎯 POWERBALL HEAT INDEX RANKINGS (1-26)")
        print("="*80)
        print(f"{'Rank':<4} {'Number':<6} {'Heat Index':<10} {'Category':<15} {'Freq':<5} {'Z-Score':<8} {'%':<6}")
        print("-" * 80)
        
        for i, data in enumerate(self.pb_heat_data, 1):
            print(f"{i:<4} {data['number']:<6} {data['heat_index']:<10.1f} {data['category']:<15} "
                  f"{data['frequency']:<5} {data['z_score']:<8.2f} {data['percentage']:<6.2f}")
    
    def display_hot_numbers(self):
        """Display the hottest numbers."""
        print("\n" + "="*60)
        print("🔥 HOTTEST NUMBERS (Heat Index > 70)")
        print("="*60)
        
        hot_white = [data for data in self.white_heat_data if data['heat_index'] > 70]
        hot_pb = [data for data in self.pb_heat_data if data['heat_index'] > 70]
        
        print("\nWhite Balls:")
        for data in hot_white:
            print(f"   Number {data['number']:2d}: Heat Index {data['heat_index']:5.1f} "
                  f"({data['frequency']:3d} times, Z-score {data['z_score']:5.2f})")
        
        print("\nPowerballs:")
        for data in hot_pb:
            print(f"   Number {data['number']:2d}: Heat Index {data['heat_index']:5.1f} "
                  f"({data['frequency']:3d} times, Z-score {data['z_score']:5.2f})")
    
    def display_cold_numbers(self):
        """Display the coldest numbers."""
        print("\n" + "="*60)
        print("❄️ COLDEST NUMBERS (Heat Index < 30)")
        print("="*60)
        
        cold_white = [data for data in self.white_heat_data if data['heat_index'] < 30]
        cold_pb = [data for data in self.pb_heat_data if data['heat_index'] < 30]
        
        print("\nWhite Balls:")
        for data in cold_white:
            print(f"   Number {data['number']:2d}: Heat Index {data['heat_index']:5.1f} "
                  f"({data['frequency']:3d} times, Z-score {data['z_score']:5.2f})")
        
        print("\nPowerballs:")
        for data in cold_pb:
            print(f"   Number {data['number']:2d}: Heat Index {data['heat_index']:5.1f} "
                  f"({data['frequency']:3d} times, Z-score {data['z_score']:5.2f})")
    
    def display_category_summary(self):
        """Display summary by heat categories."""
        print("\n" + "="*60)
        print("📊 HEAT CATEGORY SUMMARY")
        print("="*60)
        
        # Count by category for white balls
        white_categories = {}
        for data in self.white_heat_data:
            category = data['category']
            white_categories[category] = white_categories.get(category, 0) + 1
        
        print("\nWhite Balls by Category:")
        for category, count in white_categories.items():
            print(f"   {category}: {count} numbers")
        
        # Count by category for powerballs
        pb_categories = {}
        for data in self.pb_heat_data:
            category = data['category']
            pb_categories[category] = pb_categories.get(category, 0) + 1
        
        print("\nPowerballs by Category:")
        for category, count in pb_categories.items():
            print(f"   {category}: {count} numbers")
    
    def get_top_numbers_by_heat(self, count=10):
        """Get top numbers by heat index."""
        print(f"\n🔥 TOP {count} HOTTEST WHITE BALLS:")
        for i, data in enumerate(self.white_heat_data[:count], 1):
            print(f"   {i:2d}. Number {data['number']:2d}: Heat Index {data['heat_index']:5.1f} "
                  f"({data['frequency']:3d} times)")
        
        print(f"\n🎯 TOP {count} HOTTEST POWERBALLS:")
        for i, data in enumerate(self.pb_heat_data[:count], 1):
            print(f"   {i:2d}. Number {data['number']:2d}: Heat Index {data['heat_index']:5.1f} "
                  f"({data['frequency']:3d} times)")
    
    def get_bottom_numbers_by_heat(self, count=10):
        """Get bottom numbers by heat index."""
        print(f"\n❄️ TOP {count} COLDEST WHITE BALLS:")
        for i, data in enumerate(self.white_heat_data[-count:], 1):
            print(f"   {i:2d}. Number {data['number']:2d}: Heat Index {data['heat_index']:5.1f} "
                  f"({data['frequency']:3d} times)")
        
        print(f"\n🧊 TOP {count} COLDEST POWERBALLS:")
        for i, data in enumerate(self.pb_heat_data[-count:], 1):
            print(f"   {i:2d}. Number {data['number']:2d}: Heat Index {data['heat_index']:5.1f} "
                  f"({data['frequency']:3d} times)")
    
    def run_complete_analysis(self):
        """Run complete heat index analysis."""
        print("🔥 LOTTERY NUMBER HEAT INDEX ANALYSIS")
        print("="*80)
        print("Comprehensive ranking of all lottery numbers by statistical 'heat'")
        print("="*80)
        
        self.display_white_ball_rankings()
        self.display_powerball_rankings()
        self.display_hot_numbers()
        self.display_cold_numbers()
        self.display_category_summary()
        self.get_top_numbers_by_heat(15)
        self.get_bottom_numbers_by_heat(15)
        
        print("\n" + "="*80)
        print("✅ HEAT INDEX ANALYSIS COMPLETE!")
        print("="*80)
        print("💡 HEAT INDEX EXPLANATION:")
        print("   • Heat Index 90-100: BLAZING HOT (Z-score > 2)")
        print("   • Heat Index 70-89:  HOT (Z-score 1-2)")
        print("   • Heat Index 50-69:  WARM (Z-score 0-1)")
        print("   • Heat Index 30-49:  COOL (Z-score -1 to 0)")
        print("   • Heat Index 10-29:  COLD (Z-score -2 to -1)")
        print("   • Heat Index 0-9:    FREEZING (Z-score < -2)")
        print("\n⚠️  DISCLAIMER:")
        print("   Heat index is based on historical frequency analysis.")
        print("   Past performance does not predict future results!")
        print("   Lottery numbers are random - use for entertainment only!")

def main():
    """Main function to run the heat index analysis."""
    csv_file = "Lottery_Powerball_Winning_Numbers__Beginning_2010.csv"
    
    try:
        analyzer = HeatIndexRankings(csv_file)
        analyzer.run_complete_analysis()
    except FileNotFoundError:
        print(f"Error: Could not find the file '{csv_file}'")
        print("Please make sure the CSV file is in the same directory as this script.")
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
