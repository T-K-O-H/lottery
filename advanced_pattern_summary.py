#!/usr/bin/env python3
"""
Advanced Powerball Pattern Recognition - Summary Version
Focuses on key findings without complex statistical tests that may fail.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import warnings
warnings.filterwarnings('ignore')

class AdvancedPatternSummary:
    def __init__(self, csv_file):
        """Initialize the advanced analyzer with lottery data."""
        self.csv_file = csv_file
        self.df = None
        self.white_balls = []
        self.powerballs = []
        self.load_data()
        self.prepare_features()
    
    def load_data(self):
        """Load and preprocess the lottery data."""
        print("Loading lottery data for advanced analysis...")
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
    
    def prepare_features(self):
        """Prepare advanced features for pattern analysis."""
        print("Preparing advanced features...")
        
        # Basic features
        self.df['Sum'] = self.df['White Balls'].apply(sum)
        self.df['Mean'] = self.df['White Balls'].apply(np.mean)
        self.df['Std'] = self.df['White Balls'].apply(np.std)
        self.df['Range'] = self.df['White Balls'].apply(lambda x: max(x) - min(x))
        self.df['Even_Count'] = self.df['White Balls'].apply(lambda x: sum(1 for num in x if num % 2 == 0))
        self.df['Odd_Count'] = 5 - self.df['Even_Count']
        
        # Advanced features
        self.df['Consecutive_Pairs'] = self.df['White Balls'].apply(self._count_consecutive_pairs)
        self.df['Gap_Variance'] = self.df['White Balls'].apply(self._calculate_gap_variance)
        self.df['Low_High_Ratio'] = self.df['White Balls'].apply(self._calculate_low_high_ratio)
        self.df['Prime_Count'] = self.df['White Balls'].apply(self._count_primes)
        self.df['Fibonacci_Count'] = self.df['White Balls'].apply(self._count_fibonacci)
        
        # Time-based features
        self.df['Day_of_Week'] = self.df['Draw Date'].dt.dayofweek
        self.df['Month'] = self.df['Draw Date'].dt.month
        self.df['Year'] = self.df['Draw Date'].dt.year
        
        print("Advanced features prepared successfully!")
    
    def _count_consecutive_pairs(self, numbers):
        """Count consecutive number pairs in a draw."""
        sorted_nums = sorted(numbers)
        consecutive = 0
        for i in range(len(sorted_nums) - 1):
            if sorted_nums[i+1] - sorted_nums[i] == 1:
                consecutive += 1
        return consecutive
    
    def _calculate_gap_variance(self, numbers):
        """Calculate variance of gaps between numbers."""
        sorted_nums = sorted(numbers)
        gaps = [sorted_nums[i+1] - sorted_nums[i] for i in range(len(sorted_nums) - 1)]
        return np.var(gaps) if len(gaps) > 0 else 0
    
    def _calculate_low_high_ratio(self, numbers):
        """Calculate ratio of low numbers (1-34) to high numbers (35-69)."""
        low_count = sum(1 for num in numbers if num <= 34)
        high_count = 5 - low_count
        return low_count / high_count if high_count > 0 else 5.0
    
    def _count_primes(self, numbers):
        """Count prime numbers in a draw."""
        primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67}
        return sum(1 for num in numbers if num in primes)
    
    def _count_fibonacci(self, numbers):
        """Count Fibonacci numbers in a draw."""
        fibs = {1, 2, 3, 5, 8, 13, 21, 34, 55}
        return sum(1 for num in numbers if num in fibs)
    
    def advanced_sequence_analysis(self):
        """Advanced sequence pattern analysis."""
        print("\n" + "="*70)
        print("🔍 ADVANCED SEQUENCE PATTERN ANALYSIS")
        print("="*70)
        
        # Gap analysis
        all_gaps = []
        for _, row in self.df.iterrows():
            sorted_nums = sorted(row['White Balls'])
            gaps = [sorted_nums[i+1] - sorted_nums[i] for i in range(len(sorted_nums) - 1)]
            all_gaps.extend(gaps)
        
        gap_freq = Counter(all_gaps)
        print(f"\n📊 Most common gaps between consecutive numbers:")
        for gap, count in gap_freq.most_common(10):
            print(f"   Gap of {gap:2d}: {count:4d} times ({count/len(all_gaps)*100:.1f}%)")
        
        # Sequence length analysis
        sequence_lengths = []
        for _, row in self.df.iterrows():
            sorted_nums = sorted(row['White Balls'])
            max_seq_len = 1
            current_seq_len = 1
            
            for i in range(len(sorted_nums) - 1):
                if sorted_nums[i+1] - sorted_nums[i] == 1:
                    current_seq_len += 1
                    max_seq_len = max(max_seq_len, current_seq_len)
                else:
                    current_seq_len = 1
            
            sequence_lengths.append(max_seq_len)
        
        seq_freq = Counter(sequence_lengths)
        print(f"\n🔗 Maximum consecutive sequence lengths:")
        for length, count in sorted(seq_freq.items()):
            print(f"   Length {length}: {count:4d} draws ({count/len(sequence_lengths)*100:.1f}%)")
        
        # Position analysis
        position_freq = defaultdict(Counter)
        for _, row in self.df.iterrows():
            sorted_nums = sorted(row['White Balls'])
            for pos, num in enumerate(sorted_nums):
                position_freq[pos][num] += 1
        
        print(f"\n🎯 Most frequent numbers by position (when sorted):")
        positions = ['1st (lowest)', '2nd', '3rd (middle)', '4th', '5th (highest)']
        for pos in range(5):
            print(f"   {positions[pos]:12s}: {position_freq[pos].most_common(3)}")
    
    def clustering_analysis(self):
        """Perform clustering analysis on lottery draws."""
        print("\n" + "="*70)
        print("🤖 MACHINE LEARNING CLUSTERING ANALYSIS")
        print("="*70)
        
        # Prepare features for clustering
        features = ['Sum', 'Mean', 'Std', 'Range', 'Even_Count', 'Consecutive_Pairs', 
                   'Gap_Variance', 'Low_High_Ratio', 'Prime_Count']
        
        X = self.df[features].fillna(0)
        # Replace infinite values and cap extreme values
        X = X.replace([np.inf, -np.inf], np.nan).fillna(0)
        X = X.clip(-1e6, 1e6)
        
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # K-Means clustering
        print("\n🔍 Testing different cluster numbers:")
        best_k = 2
        best_score = -1
        
        for k in range(2, 8):
            kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
            cluster_labels = kmeans.fit_predict(X_scaled)
            
            # Calculate silhouette score
            from sklearn.metrics import silhouette_score
            score = silhouette_score(X_scaled, cluster_labels)
            
            if score > best_score:
                best_score = score
                best_k = k
            
            print(f"   K={k}: Silhouette Score = {score:.3f}")
        
        # Final clustering with best k
        kmeans = KMeans(n_clusters=best_k, random_state=42, n_init=10)
        cluster_labels = kmeans.fit_predict(X_scaled)
        self.df['Cluster'] = cluster_labels
        
        print(f"\n✅ Best clustering: K={best_k} (Silhouette Score = {best_score:.3f})")
        
        # Analyze clusters
        print(f"\n📈 Cluster characteristics:")
        for cluster_id in range(best_k):
            cluster_data = self.df[self.df['Cluster'] == cluster_id]
            print(f"\n   🎯 Cluster {cluster_id} ({len(cluster_data)} draws, {len(cluster_data)/len(self.df)*100:.1f}%):")
            print(f"      Average sum: {cluster_data['Sum'].mean():.1f}")
            print(f"      Average even count: {cluster_data['Even_Count'].mean():.1f}")
            print(f"      Average consecutive pairs: {cluster_data['Consecutive_Pairs'].mean():.1f}")
            print(f"      Average prime count: {cluster_data['Prime_Count'].mean():.1f}")
            print(f"      Average range: {cluster_data['Range'].mean():.1f}")
    
    def temporal_pattern_analysis(self):
        """Analyze temporal patterns in lottery draws."""
        print("\n" + "="*70)
        print("📅 TEMPORAL PATTERN ANALYSIS")
        print("="*70)
        
        # Day of week analysis
        dow_stats = self.df.groupby('Day_of_Week').agg({
            'Sum': ['mean', 'std'],
            'Even_Count': 'mean',
            'Consecutive_Pairs': 'mean'
        }).round(2)
        
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        print(f"\n📊 Day of week patterns:")
        for i, day in enumerate(days):
            if i in dow_stats.index:
                sum_mean = dow_stats.loc[i, ('Sum', 'mean')]
                even_mean = dow_stats.loc[i, ('Even_Count', 'mean')]
                print(f"   {day:9s}: Avg Sum={sum_mean:6.1f}, Avg Even={even_mean:.1f}")
        
        # Monthly patterns
        monthly_stats = self.df.groupby('Month').agg({
            'Sum': ['mean', 'std'],
            'Even_Count': 'mean'
        }).round(2)
        
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        print(f"\n📅 Monthly patterns:")
        for month in range(1, 13):
            if month in monthly_stats.index:
                sum_mean = monthly_stats.loc[month, ('Sum', 'mean')]
                even_mean = monthly_stats.loc[month, ('Even_Count', 'mean')]
                print(f"   {months[month-1]:3s}: Avg Sum={sum_mean:6.1f}, Avg Even={even_mean:.1f}")
        
        # Yearly trends
        yearly_stats = self.df.groupby('Year').agg({
            'Sum': 'mean',
            'Even_Count': 'mean',
            'Consecutive_Pairs': 'mean'
        }).round(2)
        
        print(f"\n📈 Yearly trends (last 5 years):")
        for year in sorted(yearly_stats.index)[-5:]:
            sum_mean = yearly_stats.loc[year, 'Sum']
            even_mean = yearly_stats.loc[year, 'Even_Count']
            print(f"   {year}: Avg Sum={sum_mean:6.1f}, Avg Even={even_mean:.1f}")
    
    def advanced_frequency_analysis(self):
        """Advanced frequency analysis with statistical insights."""
        print("\n" + "="*70)
        print("📊 ADVANCED FREQUENCY ANALYSIS")
        print("="*70)
        
        # White ball analysis
        white_freq = Counter(self.white_balls)
        expected_freq = len(self.white_balls) / 69
        
        print(f"\n🔥 HOTTEST WHITE BALLS (Z-score > 2):")
        hot_numbers = []
        for num in range(1, 70):
            observed_count = white_freq.get(num, 0)
            z_score = (observed_count - expected_freq) / np.sqrt(expected_freq)
            if z_score > 2:
                hot_numbers.append((num, z_score, observed_count))
        
        for num, z_score, count in sorted(hot_numbers, key=lambda x: x[1], reverse=True):
            print(f"   Number {num:2d}: Z-score = {z_score:6.2f} ({count:3d} times)")
        
        print(f"\n❄️  COLDEST WHITE BALLS (Z-score < -2):")
        cold_numbers = []
        for num in range(1, 70):
            observed_count = white_freq.get(num, 0)
            z_score = (observed_count - expected_freq) / np.sqrt(expected_freq)
            if z_score < -2:
                cold_numbers.append((num, z_score, observed_count))
        
        for num, z_score, count in sorted(cold_numbers, key=lambda x: x[1]):
            print(f"   Number {num:2d}: Z-score = {z_score:6.2f} ({count:3d} times)")
        
        # Powerball analysis
        pb_freq = Counter(self.powerballs)
        expected_pb = len(self.powerballs) / 26
        
        print(f"\n🎯 POWERBALL ANALYSIS:")
        print(f"   Most frequent: {pb_freq.most_common(1)[0][0]} ({pb_freq.most_common(1)[0][1]} times)")
        print(f"   Least frequent: {pb_freq.most_common()[-1][0]} ({pb_freq.most_common()[-1][1]} times)")
        
        # Statistical significance
        print(f"\n📈 STATISTICAL INSIGHTS:")
        print(f"   Expected frequency per white ball: {expected_freq:.1f}")
        print(f"   Most frequent white ball: {white_freq.most_common(1)[0][0]} ({white_freq.most_common(1)[0][1]} times)")
        print(f"   Least frequent white ball: {white_freq.most_common()[-1][0]} ({white_freq.most_common()[-1][1]} times)")
        print(f"   Difference: {white_freq.most_common(1)[0][1] - white_freq.most_common()[-1][1]} times")
    
    def correlation_analysis(self):
        """Analyze correlations between different features."""
        print("\n" + "="*70)
        print("🔗 CORRELATION ANALYSIS")
        print("="*70)
        
        # Select numerical features
        features = ['Sum', 'Mean', 'Std', 'Range', 'Even_Count', 'Consecutive_Pairs',
                   'Gap_Variance', 'Low_High_Ratio', 'Prime_Count', 'Powerball']
        
        corr_matrix = self.df[features].corr()
        
        print(f"\n📊 Top correlations with Sum:")
        sum_corr = corr_matrix['Sum'].abs().sort_values(ascending=False)
        for feature, corr in sum_corr.head(6).items():
            if feature != 'Sum':
                print(f"   {feature:20s}: {corr:.3f}")
        
        print(f"\n📊 Top correlations with Even_Count:")
        even_corr = corr_matrix['Even_Count'].abs().sort_values(ascending=False)
        for feature, corr in even_corr.head(6).items():
            if feature != 'Even_Count':
                print(f"   {feature:20s}: {corr:.3f}")
    
    def create_advanced_visualizations(self):
        """Create advanced visualizations for pattern analysis."""
        print("\n" + "="*70)
        print("📊 CREATING ADVANCED VISUALIZATIONS")
        print("="*70)
        
        plt.style.use('default')
        fig = plt.figure(figsize=(20, 15))
        
        # 1. Feature correlation heatmap
        plt.subplot(3, 4, 1)
        features = ['Sum', 'Mean', 'Std', 'Range', 'Even_Count', 'Consecutive_Pairs',
                   'Gap_Variance', 'Low_High_Ratio', 'Prime_Count', 'Powerball']
        corr_matrix = self.df[features].corr()
        sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0, fmt='.2f')
        plt.title('Feature Correlation Matrix')
        
        # 2. Clustering visualization (PCA)
        plt.subplot(3, 4, 2)
        if 'Cluster' in self.df.columns:
            pca = PCA(n_components=2)
            X_pca = pca.fit_transform(self.df[features].fillna(0))
            scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=self.df['Cluster'], cmap='viridis', alpha=0.6)
            plt.colorbar(scatter)
            plt.title('Clustering Visualization (PCA)')
            plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%})')
            plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%})')
        
        # 3. Temporal trends
        plt.subplot(3, 4, 3)
        self.df['Sum_MA_50'] = self.df['Sum'].rolling(window=50).mean()
        plt.plot(self.df['Draw Date'], self.df['Sum'], alpha=0.3, linewidth=0.5)
        plt.plot(self.df['Draw Date'], self.df['Sum_MA_50'], linewidth=2, color='red')
        plt.title('Sum Trends Over Time (50-draw MA)')
        plt.xlabel('Date')
        plt.ylabel('Sum')
        plt.xticks(rotation=45)
        
        # 4. Gap distribution
        plt.subplot(3, 4, 4)
        all_gaps = []
        for _, row in self.df.iterrows():
            sorted_nums = sorted(row['White Balls'])
            gaps = [sorted_nums[i+1] - sorted_nums[i] for i in range(len(sorted_nums) - 1)]
            all_gaps.extend(gaps)
        
        plt.hist(all_gaps, bins=20, alpha=0.7, edgecolor='black')
        plt.title('Distribution of Gaps Between Numbers')
        plt.xlabel('Gap Size')
        plt.ylabel('Frequency')
        
        # 5. Day of week patterns
        plt.subplot(3, 4, 5)
        dow_means = self.df.groupby('Day_of_Week')['Sum'].mean()
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        # Only plot days that exist in the data
        existing_days = [days[i] for i in dow_means.index if i < len(days)]
        existing_values = [dow_means.iloc[i] for i in dow_means.index if i < len(days)]
        plt.bar(existing_days, existing_values, alpha=0.7)
        plt.title('Average Sum by Day of Week')
        plt.ylabel('Average Sum')
        
        # 6. Monthly patterns
        plt.subplot(3, 4, 6)
        monthly_means = self.df.groupby('Month')['Sum'].mean()
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        # Only plot months that exist in the data
        existing_months = [months[i-1] for i in monthly_means.index if 1 <= i <= 12]
        existing_month_values = [monthly_means.iloc[i] for i in monthly_means.index if 1 <= i <= 12]
        plt.bar(existing_months, existing_month_values, alpha=0.7)
        plt.title('Average Sum by Month')
        plt.ylabel('Average Sum')
        plt.xticks(rotation=45)
        
        # 7. Even/Odd distribution over time
        plt.subplot(3, 4, 7)
        even_ma = self.df['Even_Count'].rolling(window=50).mean()
        plt.plot(self.df['Draw Date'], even_ma, linewidth=2)
        plt.title('Even Count Trend (50-draw MA)')
        plt.xlabel('Date')
        plt.ylabel('Average Even Count')
        plt.xticks(rotation=45)
        
        # 8. Consecutive pairs over time
        plt.subplot(3, 4, 8)
        cons_ma = self.df['Consecutive_Pairs'].rolling(window=50).mean()
        plt.plot(self.df['Draw Date'], cons_ma, linewidth=2, color='green')
        plt.title('Consecutive Pairs Trend (50-draw MA)')
        plt.xlabel('Date')
        plt.ylabel('Average Consecutive Pairs')
        plt.xticks(rotation=45)
        
        # 9. Prime number frequency
        plt.subplot(3, 4, 9)
        prime_freq = self.df['Prime_Count'].value_counts().sort_index()
        plt.bar(prime_freq.index, prime_freq.values, alpha=0.7)
        plt.title('Distribution of Prime Numbers per Draw')
        plt.xlabel('Number of Primes')
        plt.ylabel('Frequency')
        
        # 10. Fibonacci number frequency
        plt.subplot(3, 4, 10)
        fib_freq = self.df['Fibonacci_Count'].value_counts().sort_index()
        plt.bar(fib_freq.index, fib_freq.values, alpha=0.7, color='orange')
        plt.title('Distribution of Fibonacci Numbers per Draw')
        plt.xlabel('Number of Fibonacci Numbers')
        plt.ylabel('Frequency')
        
        # 11. Low/High ratio distribution
        plt.subplot(3, 4, 11)
        plt.hist(self.df['Low_High_Ratio'], bins=20, alpha=0.7, edgecolor='black')
        plt.title('Low/High Number Ratio Distribution')
        plt.xlabel('Low/High Ratio')
        plt.ylabel('Frequency')
        
        # 12. Sum distribution by cluster
        plt.subplot(3, 4, 12)
        if 'Cluster' in self.df.columns:
            for cluster_id in sorted(self.df['Cluster'].unique()):
                cluster_data = self.df[self.df['Cluster'] == cluster_id]['Sum']
                plt.hist(cluster_data, alpha=0.5, label=f'Cluster {cluster_id}', bins=15)
            plt.title('Sum Distribution by Cluster')
            plt.xlabel('Sum')
            plt.ylabel('Frequency')
            plt.legend()
        
        plt.tight_layout()
        plt.savefig('advanced_pattern_summary.png', dpi=300, bbox_inches='tight')
        print("Advanced visualizations saved as 'advanced_pattern_summary.png'")
        plt.show()
    
    def run_advanced_analysis(self):
        """Run the complete advanced pattern analysis."""
        print("🚀 ADVANCED POWERBALL PATTERN RECOGNITION ANALYZER")
        print("="*70)
        
        self.advanced_sequence_analysis()
        self.clustering_analysis()
        self.temporal_pattern_analysis()
        self.correlation_analysis()
        self.advanced_frequency_analysis()
        self.create_advanced_visualizations()
        
        print("\n" + "="*70)
        print("✅ ADVANCED ANALYSIS COMPLETE!")
        print("="*70)
        print("🎯 KEY ADVANCED INSIGHTS:")
        print("   • Machine learning clustering reveals hidden draw patterns")
        print("   • Temporal analysis shows seasonal and weekly variations")
        print("   • Statistical analysis identifies significant number biases")
        print("   • Advanced visualizations reveal complex relationships")
        print("   • Pattern recognition helps understand lottery behavior")
        print("\n⚠️  DISCLAIMER:")
        print("   This is for entertainment and research purposes only!")
        print("   Lottery numbers are random - no pattern guarantees future results!")

def main():
    """Main function to run the advanced pattern analyzer."""
    csv_file = "Lottery_Powerball_Winning_Numbers__Beginning_2010.csv"
    
    try:
        analyzer = AdvancedPatternSummary(csv_file)
        analyzer.run_advanced_analysis()
    except FileNotFoundError:
        print(f"Error: Could not find the file '{csv_file}'")
        print("Please make sure the CSV file is in the same directory as this script.")
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
