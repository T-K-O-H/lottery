#!/usr/bin/env python3
"""
Simple and robust visualization for lottery analysis
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
import warnings
warnings.filterwarnings('ignore')

def create_simple_visualizations():
    """Create simple, robust visualizations for lottery analysis."""
    print("Creating simple visualizations...")
    
    # Load data
    df = pd.read_csv("Lottery_Powerball_Winning_Numbers__Beginning_2010.csv")
    df['Draw Date'] = pd.to_datetime(df['Draw Date'])
    df['Numbers'] = df['Winning Numbers'].str.split()
    df['White Balls'] = df['Numbers'].apply(lambda x: [int(n) for n in x[:5]])
    df['Powerball'] = df['Numbers'].apply(lambda x: int(x[5]))
    
    # Prepare data
    white_balls = [num for sublist in df['White Balls'] for num in sublist]
    powerballs = df['Powerball'].tolist()
    df['Sum'] = df['White Balls'].apply(sum)
    df['Even_Count'] = df['White Balls'].apply(lambda x: sum(1 for num in x if num % 2 == 0))
    
    # Create visualizations
    fig, axes = plt.subplots(3, 3, figsize=(18, 15))
    fig.suptitle('Powerball Lottery Analysis - Advanced Patterns', fontsize=16, fontweight='bold')
    
    # 1. White ball frequency
    white_freq = Counter(white_balls)
    numbers = list(range(1, 70))
    frequencies = [white_freq.get(num, 0) for num in numbers]
    
    axes[0, 0].bar(numbers, frequencies, alpha=0.7, color='skyblue')
    axes[0, 0].set_title('White Ball Frequency (1-69)')
    axes[0, 0].set_xlabel('Number')
    axes[0, 0].set_ylabel('Frequency')
    axes[0, 0].set_xticks(range(1, 70, 10))
    
    # 2. Powerball frequency
    pb_freq = Counter(powerballs)
    pb_numbers = list(range(1, 27))
    pb_frequencies = [pb_freq.get(num, 0) for num in pb_numbers]
    
    axes[0, 1].bar(pb_numbers, pb_frequencies, alpha=0.7, color='red')
    axes[0, 1].set_title('Powerball Frequency (1-26)')
    axes[0, 1].set_xlabel('Number')
    axes[0, 1].set_ylabel('Frequency')
    
    # 3. Sum distribution
    axes[0, 2].hist(df['Sum'], bins=30, alpha=0.7, edgecolor='black', color='green')
    axes[0, 2].set_title('Distribution of White Ball Sums')
    axes[0, 2].set_xlabel('Sum of White Balls')
    axes[0, 2].set_ylabel('Frequency')
    
    # 4. Top 20 most frequent white balls
    top_20 = white_freq.most_common(20)
    nums, freqs = zip(*top_20)
    axes[1, 0].bar(range(len(nums)), freqs, alpha=0.7, color='orange')
    axes[1, 0].set_title('Top 20 Most Frequent White Balls')
    axes[1, 0].set_xlabel('Rank')
    axes[1, 0].set_ylabel('Frequency')
    axes[1, 0].set_xticks(range(0, len(nums), 2))
    axes[1, 0].set_xticklabels([str(nums[i]) for i in range(0, len(nums), 2)])
    
    # 5. Even/Odd patterns
    even_odd_patterns = []
    for _, row in df.iterrows():
        white_balls = row['White Balls']
        even_count = sum(1 for num in white_balls if num % 2 == 0)
        odd_count = 5 - even_count
        pattern = f"{even_count}E-{odd_count}O"
        even_odd_patterns.append(pattern)
    
    pattern_freq = Counter(even_odd_patterns)
    patterns, counts = zip(*pattern_freq.most_common())
    axes[1, 1].bar(patterns, counts, alpha=0.7, color='purple')
    axes[1, 1].set_title('Even/Odd Patterns')
    axes[1, 1].set_xlabel('Pattern')
    axes[1, 1].set_ylabel('Frequency')
    axes[1, 1].tick_params(axis='x', rotation=45)
    
    # 6. Sum over time
    df_sorted = df.sort_values('Draw Date')
    axes[1, 2].plot(df_sorted['Draw Date'], df_sorted['Sum'], alpha=0.6, linewidth=0.8)
    axes[1, 2].set_title('White Ball Sum Over Time')
    axes[1, 2].set_xlabel('Date')
    axes[1, 2].set_ylabel('Sum')
    axes[1, 2].tick_params(axis='x', rotation=45)
    
    # 7. Monthly patterns
    monthly_means = df.groupby(df['Draw Date'].dt.month)['Sum'].mean()
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    month_values = [monthly_means.get(i, 0) for i in range(1, 13)]
    
    axes[2, 0].bar(months, month_values, alpha=0.7, color='teal')
    axes[2, 0].set_title('Average Sum by Month')
    axes[2, 0].set_xlabel('Month')
    axes[2, 0].set_ylabel('Average Sum')
    axes[2, 0].tick_params(axis='x', rotation=45)
    
    # 8. Even count over time
    even_ma = df['Even_Count'].rolling(window=50).mean()
    axes[2, 1].plot(df['Draw Date'], even_ma, linewidth=2, color='brown')
    axes[2, 1].set_title('Even Count Trend (50-draw MA)')
    axes[2, 1].set_xlabel('Date')
    axes[2, 1].set_ylabel('Average Even Count')
    axes[2, 1].tick_params(axis='x', rotation=45)
    
    # 9. Number range analysis
    ranges = ['1-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-69']
    range_counts = []
    for i in range(7):
        start = i * 10 + 1
        end = min((i + 1) * 10, 69)
        count = sum(1 for num in white_balls if start <= num <= end)
        range_counts.append(count)
    
    axes[2, 2].bar(ranges, range_counts, alpha=0.7, color='pink')
    axes[2, 2].set_title('White Ball Distribution by Range')
    axes[2, 2].set_xlabel('Number Range')
    axes[2, 2].set_ylabel('Frequency')
    axes[2, 2].tick_params(axis='x', rotation=45)
    
    plt.tight_layout()
    plt.savefig('simple_lottery_analysis.png', dpi=300, bbox_inches='tight')
    print("Simple visualizations saved as 'simple_lottery_analysis.png'")
    plt.show()

if __name__ == "__main__":
    create_simple_visualizations()
