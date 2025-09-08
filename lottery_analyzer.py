#!/usr/bin/env python3
"""
Powerball Lottery Number Analyzer
Analyzes lottery data to find patterns, frequencies, and statistical insights.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class LotteryAnalyzer:
    def __init__(self, csv_file):
        """Initialize the analyzer with lottery data."""
        self.csv_file = csv_file
        self.df = None
        self.white_balls = []
        self.powerballs = []
        self.load_data()
    
    def load_data(self):
        """Load and preprocess the lottery data."""
        print("Loading lottery data...")
        self.df = pd.read_csv(self.csv_file)
        
        # Convert date column
        self.df['Draw Date'] = pd.to_datetime(self.df['Draw Date'])
        
        # Parse winning numbers
        self.df['Numbers'] = self.df['Winning Numbers'].str.split()
        
        # Extract white balls (first 5) and powerball (last number)
        self.df['White Balls'] = self.df['Numbers'].apply(lambda x: [int(n) for n in x[:5]])
        self.df['Powerball'] = self.df['Numbers'].apply(lambda x: int(x[5]))
        
        # Flatten all white balls and powerballs for analysis
        self.white_balls = [num for sublist in self.df['White Balls'] for num in sublist]
        self.powerballs = self.df['Powerball'].tolist()
        
        print(f"Loaded {len(self.df)} lottery draws from {self.df['Draw Date'].min().strftime('%Y-%m-%d')} to {self.df['Draw Date'].max().strftime('%Y-%m-%d')}")
    
    def basic_stats(self):
        """Display basic statistics about the data."""
        print("\n" + "="*60)
        print("BASIC STATISTICS")
        print("="*60)
        print(f"Total draws analyzed: {len(self.df)}")
        print(f"Date range: {self.df['Draw Date'].min().strftime('%Y-%m-%d')} to {self.df['Draw Date'].max().strftime('%Y-%m-%d')}")
        print(f"Years covered: {self.df['Draw Date'].max().year - self.df['Draw Date'].min().year + 1}")
        print(f"Average draws per year: {len(self.df) / (self.df['Draw Date'].max().year - self.df['Draw Date'].min().year + 1):.1f}")
    
    def frequency_analysis(self):
        """Analyze frequency of each number."""
        print("\n" + "="*60)
        print("NUMBER FREQUENCY ANALYSIS")
        print("="*60)
        
        # White ball frequencies
        white_freq = Counter(self.white_balls)
        powerball_freq = Counter(self.powerballs)
        
        print("\nTOP 10 MOST FREQUENT WHITE BALLS:")
        for num, count in white_freq.most_common(10):
            print(f"Number {num:2d}: {count:3d} times ({count/len(self.white_balls)*100:.1f}%)")
        
        print("\nTOP 10 LEAST FREQUENT WHITE BALLS:")
        for num, count in white_freq.most_common()[-10:]:
            print(f"Number {num:2d}: {count:3d} times ({count/len(self.white_balls)*100:.1f}%)")
        
        print("\nTOP 10 MOST FREQUENT POWERBALLS:")
        for num, count in powerball_freq.most_common(10):
            print(f"Number {num:2d}: {count:3d} times ({count/len(self.powerballs)*100:.1f}%)")
        
        print("\nTOP 10 LEAST FREQUENT POWERBALLS:")
        for num, count in powerball_freq.most_common()[-10:]:
            print(f"Number {num:2d}: {count:3d} times ({count/len(self.powerballs)*100:.1f}%)")
        
        return white_freq, powerball_freq
    
    def hot_cold_analysis(self, recent_draws=100):
        """Analyze hot and cold numbers in recent draws."""
        print(f"\n" + "="*60)
        print(f"HOT & COLD NUMBERS (Last {recent_draws} draws)")
        print("="*60)
        
        recent_data = self.df.tail(recent_draws)
        recent_white_balls = [num for sublist in recent_data['White Balls'] for num in sublist]
        recent_powerballs = recent_data['Powerball'].tolist()
        
        recent_white_freq = Counter(recent_white_balls)
        recent_powerball_freq = Counter(recent_powerballs)
        
        print(f"\nHOT WHITE BALLS (Last {recent_draws} draws):")
        for num, count in recent_white_freq.most_common(10):
            print(f"Number {num:2d}: {count:3d} times")
        
        print(f"\nCOLD WHITE BALLS (Last {recent_draws} draws):")
        for num, count in recent_white_freq.most_common()[-10:]:
            print(f"Number {num:2d}: {count:3d} times")
        
        print(f"\nHOT POWERBALLS (Last {recent_draws} draws):")
        for num, count in recent_powerball_freq.most_common(10):
            print(f"Number {num:2d}: {count:3d} times")
    
    def consecutive_analysis(self):
        """Analyze consecutive numbers in winning combinations."""
        print("\n" + "="*60)
        print("CONSECUTIVE NUMBER ANALYSIS")
        print("="*60)
        
        consecutive_count = 0
        consecutive_examples = []
        
        for _, row in self.df.iterrows():
            white_balls = sorted(row['White Balls'])
            consecutive_in_draw = 0
            
            for i in range(len(white_balls) - 1):
                if white_balls[i+1] - white_balls[i] == 1:
                    consecutive_in_draw += 1
            
            if consecutive_in_draw > 0:
                consecutive_count += 1
                if len(consecutive_examples) < 10:
                    consecutive_examples.append((row['Draw Date'], white_balls, consecutive_in_draw))
        
        print(f"Draws with consecutive numbers: {consecutive_count} out of {len(self.df)} ({consecutive_count/len(self.df)*100:.1f}%)")
        
        if consecutive_examples:
            print("\nExamples of consecutive numbers:")
            for date, numbers, count in consecutive_examples:
                print(f"{date.strftime('%Y-%m-%d')}: {numbers} ({count} consecutive pairs)")
    
    def sum_analysis(self):
        """Analyze sum patterns of winning numbers."""
        print("\n" + "="*60)
        print("SUM ANALYSIS")
        print("="*60)
        
        self.df['Sum'] = self.df['White Balls'].apply(sum)
        
        print(f"Average sum of white balls: {self.df['Sum'].mean():.1f}")
        print(f"Median sum of white balls: {self.df['Sum'].median():.1f}")
        print(f"Min sum: {self.df['Sum'].min()}")
        print(f"Max sum: {self.df['Sum'].max()}")
        print(f"Standard deviation: {self.df['Sum'].std():.1f}")
        
        # Sum ranges
        sum_ranges = [
            (50, 100, "Low"),
            (100, 150, "Medium-Low"),
            (150, 200, "Medium"),
            (200, 250, "Medium-High"),
            (250, 300, "High")
        ]
        
        print("\nSum distribution:")
        for min_sum, max_sum, label in sum_ranges:
            count = len(self.df[(self.df['Sum'] >= min_sum) & (self.df['Sum'] < max_sum)])
            percentage = count / len(self.df) * 100
            print(f"{label:12s} ({min_sum:3d}-{max_sum:3d}): {count:3d} draws ({percentage:4.1f}%)")
    
    def even_odd_analysis(self):
        """Analyze even/odd patterns."""
        print("\n" + "="*60)
        print("EVEN/ODD PATTERN ANALYSIS")
        print("="*60)
        
        even_odd_patterns = []
        for _, row in self.df.iterrows():
            white_balls = row['White Balls']
            even_count = sum(1 for num in white_balls if num % 2 == 0)
            odd_count = 5 - even_count
            pattern = f"{even_count}E-{odd_count}O"
            even_odd_patterns.append(pattern)
        
        pattern_freq = Counter(even_odd_patterns)
        
        print("Even/Odd patterns in white balls:")
        for pattern, count in pattern_freq.most_common():
            percentage = count / len(self.df) * 100
            print(f"{pattern:6s}: {count:3d} times ({percentage:4.1f}%)")
    
    def create_visualizations(self):
        """Create visualizations of the analysis."""
        print("\n" + "="*60)
        print("CREATING VISUALIZATIONS")
        print("="*60)
        
        # Set up the plotting style
        plt.style.use('default')
        fig = plt.figure(figsize=(20, 15))
        
        # 1. White ball frequency
        white_freq = Counter(self.white_balls)
        plt.subplot(3, 3, 1)
        numbers = list(range(1, 70))
        frequencies = [white_freq.get(num, 0) for num in numbers]
        plt.bar(numbers, frequencies, alpha=0.7)
        plt.title('White Ball Frequency (1-69)')
        plt.xlabel('Number')
        plt.ylabel('Frequency')
        plt.xticks(range(1, 70, 5))
        
        # 2. Powerball frequency
        powerball_freq = Counter(self.powerballs)
        plt.subplot(3, 3, 2)
        pb_numbers = list(range(1, 27))
        pb_frequencies = [powerball_freq.get(num, 0) for num in pb_numbers]
        plt.bar(pb_numbers, pb_frequencies, alpha=0.7, color='red')
        plt.title('Powerball Frequency (1-26)')
        plt.xlabel('Number')
        plt.ylabel('Frequency')
        
        # 3. Sum distribution
        plt.subplot(3, 3, 3)
        self.df['Sum'] = self.df['White Balls'].apply(sum)
        plt.hist(self.df['Sum'], bins=30, alpha=0.7, edgecolor='black')
        plt.title('Distribution of White Ball Sums')
        plt.xlabel('Sum of White Balls')
        plt.ylabel('Frequency')
        
        # 4. Top 20 most frequent white balls
        plt.subplot(3, 3, 4)
        top_20 = white_freq.most_common(20)
        nums, freqs = zip(*top_20)
        plt.bar(range(len(nums)), freqs, alpha=0.7)
        plt.title('Top 20 Most Frequent White Balls')
        plt.xlabel('Rank')
        plt.ylabel('Frequency')
        plt.xticks(range(0, len(nums), 2), [str(nums[i]) for i in range(0, len(nums), 2)])
        
        # 5. Even/Odd patterns
        plt.subplot(3, 3, 5)
        even_odd_patterns = []
        for _, row in self.df.iterrows():
            white_balls = row['White Balls']
            even_count = sum(1 for num in white_balls if num % 2 == 0)
            odd_count = 5 - even_count
            pattern = f"{even_count}E-{odd_count}O"
            even_odd_patterns.append(pattern)
        
        pattern_freq = Counter(even_odd_patterns)
        patterns, counts = zip(*pattern_freq.most_common())
        plt.bar(patterns, counts, alpha=0.7)
        plt.title('Even/Odd Patterns')
        plt.xlabel('Pattern')
        plt.ylabel('Frequency')
        plt.xticks(rotation=45)
        
        # 6. Recent frequency (last 100 draws)
        plt.subplot(3, 3, 6)
        recent_data = self.df.tail(100)
        recent_white_balls = [num for sublist in recent_data['White Balls'] for num in sublist]
        recent_freq = Counter(recent_white_balls)
        recent_nums = list(range(1, 70))
        recent_frequencies = [recent_freq.get(num, 0) for num in recent_nums]
        plt.bar(recent_nums, recent_frequencies, alpha=0.7, color='orange')
        plt.title('White Ball Frequency (Last 100 Draws)')
        plt.xlabel('Number')
        plt.ylabel('Frequency')
        plt.xticks(range(1, 70, 5))
        
        # 7. Time series of sums
        plt.subplot(3, 3, 7)
        plt.plot(self.df['Draw Date'], self.df['Sum'], alpha=0.6, linewidth=0.8)
        plt.title('White Ball Sum Over Time')
        plt.xlabel('Date')
        plt.ylabel('Sum')
        plt.xticks(rotation=45)
        
        # 8. Multiplier analysis
        plt.subplot(3, 3, 8)
        multiplier_freq = Counter(self.df['Multiplier'])
        multipliers, mult_counts = zip(*multiplier_freq.most_common())
        plt.bar(multipliers, mult_counts, alpha=0.7, color='green')
        plt.title('Multiplier Frequency')
        plt.xlabel('Multiplier')
        plt.ylabel('Frequency')
        
        # 9. Number range analysis
        plt.subplot(3, 3, 9)
        ranges = ['1-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-69']
        range_counts = []
        for i in range(7):
            start = i * 10 + 1
            end = min((i + 1) * 10, 69)
            count = sum(1 for num in self.white_balls if start <= num <= end)
            range_counts.append(count)
        
        plt.bar(ranges, range_counts, alpha=0.7, color='purple')
        plt.title('White Ball Distribution by Range')
        plt.xlabel('Number Range')
        plt.ylabel('Frequency')
        plt.xticks(rotation=45)
        
        plt.tight_layout()
        plt.savefig('lottery_analysis.png', dpi=300, bbox_inches='tight')
        print("Visualizations saved as 'lottery_analysis.png'")
        plt.show()
    
    def run_full_analysis(self):
        """Run the complete lottery analysis."""
        print("POWERBALL LOTTERY NUMBER ANALYZER")
        print("="*60)
        
        self.basic_stats()
        white_freq, powerball_freq = self.frequency_analysis()
        self.hot_cold_analysis()
        self.consecutive_analysis()
        self.sum_analysis()
        self.even_odd_analysis()
        self.create_visualizations()
        
        print("\n" + "="*60)
        print("ANALYSIS COMPLETE!")
        print("="*60)
        print("Check 'lottery_analysis.png' for visualizations.")
        print("\nKey Insights:")
        print("- This analysis shows historical patterns, not predictions")
        print("- Lottery numbers are random - past results don't predict future")
        print("- Use this data for entertainment and pattern recognition only")

def main():
    """Main function to run the lottery analyzer."""
    csv_file = "Lottery_Powerball_Winning_Numbers__Beginning_2010.csv"
    
    try:
        analyzer = LotteryAnalyzer(csv_file)
        analyzer.run_full_analysis()
    except FileNotFoundError:
        print(f"Error: Could not find the file '{csv_file}'")
        print("Please make sure the CSV file is in the same directory as this script.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
