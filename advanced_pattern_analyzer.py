#!/usr/bin/env python3
"""
Advanced Powerball Pattern Recognition Analyzer
Uses machine learning and advanced statistical techniques to identify complex patterns.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from scipy import stats
from scipy.spatial.distance import pdist, squareform
import warnings
warnings.filterwarnings('ignore')

class AdvancedPatternAnalyzer:
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
        self.df['Days_Since_Last'] = self.df['Draw Date'].diff().dt.days.fillna(0)
        
        # Rolling statistics
        self.df['Sum_MA_10'] = self.df['Sum'].rolling(window=10).mean()
        self.df['Sum_MA_50'] = self.df['Sum'].rolling(window=50).mean()
        self.df['Sum_Std_10'] = self.df['Sum'].rolling(window=10).std()
        
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
        return low_count / high_count if high_count > 0 else 5.0  # Cap at 5 instead of inf
    
    def _count_primes(self, numbers):
        """Count prime numbers in a draw."""
        primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67}
        return sum(1 for num in numbers if num in primes)
    
    def _count_fibonacci(self, numbers):
        """Count Fibonacci numbers in a draw."""
        fibs = {1, 2, 3, 5, 8, 13, 21, 34, 55}
        return sum(1 for num in numbers if num in fibs)
    
    def sequence_pattern_analysis(self):
        """Analyze sequence patterns and gaps."""
        print("\n" + "="*70)
        print("ADVANCED SEQUENCE PATTERN ANALYSIS")
        print("="*70)
        
        # Gap analysis
        all_gaps = []
        for _, row in self.df.iterrows():
            sorted_nums = sorted(row['White Balls'])
            gaps = [sorted_nums[i+1] - sorted_nums[i] for i in range(len(sorted_nums) - 1)]
            all_gaps.extend(gaps)
        
        gap_freq = Counter(all_gaps)
        print(f"\nMost common gaps between consecutive numbers:")
        for gap, count in gap_freq.most_common(10):
            print(f"Gap of {gap:2d}: {count:4d} times ({count/len(all_gaps)*100:.1f}%)")
        
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
        print(f"\nMaximum consecutive sequence lengths:")
        for length, count in sorted(seq_freq.items()):
            print(f"Length {length}: {count:4d} draws ({count/len(sequence_lengths)*100:.1f}%)")
        
        # Number position analysis
        position_freq = defaultdict(Counter)
        for _, row in self.df.iterrows():
            sorted_nums = sorted(row['White Balls'])
            for pos, num in enumerate(sorted_nums):
                position_freq[pos][num] += 1
        
        print(f"\nMost frequent numbers by position (when sorted):")
        for pos in range(5):
            print(f"Position {pos+1}: {position_freq[pos].most_common(5)}")
    
    def clustering_analysis(self):
        """Perform clustering analysis on lottery draws."""
        print("\n" + "="*70)
        print("CLUSTERING ANALYSIS")
        print("="*70)
        
        # Prepare features for clustering
        features = ['Sum', 'Mean', 'Std', 'Range', 'Even_Count', 'Consecutive_Pairs', 
                   'Gap_Variance', 'Low_High_Ratio', 'Prime_Count']
        
        X = self.df[features].fillna(0)
        # Replace infinite values with large finite values
        X = X.replace([np.inf, -np.inf], np.nan).fillna(0)
        # Cap extreme values
        X = X.clip(-1e6, 1e6)
        
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # K-Means clustering
        print("\nK-Means Clustering Analysis:")
        best_k = 3
        best_score = -1
        
        for k in range(2, 8):
            kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
            cluster_labels = kmeans.fit_predict(X_scaled)
            score = silhouette_score(X_scaled, cluster_labels)
            
            if score > best_score:
                best_score = score
                best_k = k
            
            print(f"K={k}: Silhouette Score = {score:.3f}")
        
        # Final clustering with best k
        kmeans = KMeans(n_clusters=best_k, random_state=42, n_init=10)
        cluster_labels = kmeans.fit_predict(X_scaled)
        self.df['Cluster'] = cluster_labels
        
        print(f"\nBest clustering: K={best_k} (Silhouette Score = {best_score:.3f})")
        
        # Analyze clusters
        print(f"\nCluster characteristics:")
        for cluster_id in range(best_k):
            cluster_data = self.df[self.df['Cluster'] == cluster_id]
            print(f"\nCluster {cluster_id} ({len(cluster_data)} draws):")
            print(f"  Average sum: {cluster_data['Sum'].mean():.1f}")
            print(f"  Average even count: {cluster_data['Even_Count'].mean():.1f}")
            print(f"  Average consecutive pairs: {cluster_data['Consecutive_Pairs'].mean():.1f}")
            print(f"  Average prime count: {cluster_data['Prime_Count'].mean():.1f}")
    
    def temporal_pattern_analysis(self):
        """Analyze temporal patterns in lottery draws."""
        print("\n" + "="*70)
        print("TEMPORAL PATTERN ANALYSIS")
        print("="*70)
        
        # Day of week analysis
        dow_stats = self.df.groupby('Day_of_Week').agg({
            'Sum': ['mean', 'std'],
            'Even_Count': 'mean',
            'Consecutive_Pairs': 'mean'
        }).round(2)
        
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        print(f"\nDay of week patterns:")
        for i, day in enumerate(days):
            if i in dow_stats.index:
                sum_mean = dow_stats.loc[i, ('Sum', 'mean')]
                even_mean = dow_stats.loc[i, ('Even_Count', 'mean')]
                print(f"{day:9s}: Avg Sum={sum_mean:6.1f}, Avg Even={even_mean:.1f}")
        
        # Monthly patterns
        monthly_stats = self.df.groupby('Month').agg({
            'Sum': ['mean', 'std'],
            'Even_Count': 'mean'
        }).round(2)
        
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        print(f"\nMonthly patterns:")
        for month in range(1, 13):
            if month in monthly_stats.index:
                sum_mean = monthly_stats.loc[month, ('Sum', 'mean')]
                even_mean = monthly_stats.loc[month, ('Even_Count', 'mean')]
                print(f"{months[month-1]:3s}: Avg Sum={sum_mean:6.1f}, Avg Even={even_mean:.1f}")
        
        # Yearly trends
        yearly_stats = self.df.groupby('Year').agg({
            'Sum': 'mean',
            'Even_Count': 'mean',
            'Consecutive_Pairs': 'mean'
        }).round(2)
        
        print(f"\nYearly trends (last 5 years):")
        for year in sorted(yearly_stats.index)[-5:]:
            sum_mean = yearly_stats.loc[year, 'Sum']
            even_mean = yearly_stats.loc[year, 'Even_Count']
            print(f"{year}: Avg Sum={sum_mean:6.1f}, Avg Even={even_mean:.1f}")
    
    def correlation_analysis(self):
        """Analyze correlations between different features."""
        print("\n" + "="*70)
        print("CORRELATION ANALYSIS")
        print("="*70)
        
        # Select numerical features
        features = ['Sum', 'Mean', 'Std', 'Range', 'Even_Count', 'Consecutive_Pairs',
                   'Gap_Variance', 'Low_High_Ratio', 'Prime_Count', 'Powerball']
        
        corr_matrix = self.df[features].corr()
        
        print(f"\nTop correlations with Sum:")
        sum_corr = corr_matrix['Sum'].abs().sort_values(ascending=False)
        for feature, corr in sum_corr.head(6).items():
            if feature != 'Sum':
                print(f"{feature:20s}: {corr:.3f}")
        
        print(f"\nTop correlations with Even_Count:")
        even_corr = corr_matrix['Even_Count'].abs().sort_values(ascending=False)
        for feature, corr in even_corr.head(6).items():
            if feature != 'Even_Count':
                print(f"{feature:20s}: {corr:.3f}")
    
    def advanced_frequency_analysis(self):
        """Advanced frequency analysis with statistical tests."""
        print("\n" + "="*70)
        print("ADVANCED FREQUENCY ANALYSIS")
        print("="*70)
        
        # Chi-square test for uniform distribution
        white_freq = Counter(self.white_balls)
        expected_freq = len(self.white_balls) / 69  # 69 possible white ball numbers
        
        observed = [white_freq.get(i, 0) for i in range(1, 70)]
        expected = [expected_freq] * 69
        
        chi2_stat, p_value = stats.chisquare(observed, expected)
        
        print(f"\nChi-square test for white ball uniformity:")
        print(f"Chi-square statistic: {chi2_stat:.2f}")
        print(f"P-value: {p_value:.6f}")
        print(f"Significant deviation from uniform: {'Yes' if p_value < 0.05 else 'No'}")
        
        # Z-score analysis for individual numbers
        print(f"\nNumbers with significant deviation (|Z-score| > 2):")
        for num in range(1, 70):
            observed_count = white_freq.get(num, 0)
            z_score = (observed_count - expected_freq) / np.sqrt(expected_freq)
            if abs(z_score) > 2:
                print(f"Number {num:2d}: Z-score = {z_score:6.2f} ({'Hot' if z_score > 0 else 'Cold'})")
        
        # Powerball analysis
        pb_freq = Counter(self.powerballs)
        expected_pb = len(self.powerballs) / 26  # 26 possible powerball numbers
        
        pb_observed = [pb_freq.get(i, 0) for i in range(1, 27)]
        pb_expected = [expected_pb] * 26
        
        pb_chi2, pb_p_value = stats.chisquare(pb_observed, pb_expected)
        
        print(f"\nChi-square test for powerball uniformity:")
        print(f"Chi-square statistic: {pb_chi2:.2f}")
        print(f"P-value: {pb_p_value:.6f}")
        print(f"Significant deviation from uniform: {'Yes' if pb_p_value < 0.05 else 'No'}")
    
    def create_advanced_visualizations(self):
        """Create advanced visualizations for pattern analysis."""
        print("\n" + "="*70)
        print("CREATING ADVANCED VISUALIZATIONS")
        print("="*70)
        
        plt.style.use('default')
        fig = plt.figure(figsize=(24, 18))
        
        # 1. Feature correlation heatmap
        plt.subplot(4, 4, 1)
        features = ['Sum', 'Mean', 'Std', 'Range', 'Even_Count', 'Consecutive_Pairs',
                   'Gap_Variance', 'Low_High_Ratio', 'Prime_Count', 'Powerball']
        corr_matrix = self.df[features].corr()
        sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0, fmt='.2f')
        plt.title('Feature Correlation Matrix')
        
        # 2. Clustering visualization (PCA)
        plt.subplot(4, 4, 2)
        if 'Cluster' in self.df.columns:
            pca = PCA(n_components=2)
            X_pca = pca.fit_transform(self.df[features].fillna(0))
            scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=self.df['Cluster'], cmap='viridis', alpha=0.6)
            plt.colorbar(scatter)
            plt.title('Clustering Visualization (PCA)')
            plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%})')
            plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%})')
        
        # 3. Temporal trends
        plt.subplot(4, 4, 3)
        self.df['Sum_MA_50'] = self.df['Sum'].rolling(window=50).mean()
        plt.plot(self.df['Draw Date'], self.df['Sum'], alpha=0.3, linewidth=0.5)
        plt.plot(self.df['Draw Date'], self.df['Sum_MA_50'], linewidth=2, color='red')
        plt.title('Sum Trends Over Time (50-draw MA)')
        plt.xlabel('Date')
        plt.ylabel('Sum')
        plt.xticks(rotation=45)
        
        # 4. Gap distribution
        plt.subplot(4, 4, 4)
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
        plt.subplot(4, 4, 5)
        dow_means = self.df.groupby('Day_of_Week')['Sum'].mean()
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        plt.bar(days, dow_means.values, alpha=0.7)
        plt.title('Average Sum by Day of Week')
        plt.ylabel('Average Sum')
        
        # 6. Monthly patterns
        plt.subplot(4, 4, 6)
        monthly_means = self.df.groupby('Month')['Sum'].mean()
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        plt.bar(months, monthly_means.values, alpha=0.7)
        plt.title('Average Sum by Month')
        plt.ylabel('Average Sum')
        plt.xticks(rotation=45)
        
        # 7. Even/Odd distribution over time
        plt.subplot(4, 4, 7)
        even_ma = self.df['Even_Count'].rolling(window=50).mean()
        plt.plot(self.df['Draw Date'], even_ma, linewidth=2)
        plt.title('Even Count Trend (50-draw MA)')
        plt.xlabel('Date')
        plt.ylabel('Average Even Count')
        plt.xticks(rotation=45)
        
        # 8. Consecutive pairs over time
        plt.subplot(4, 4, 8)
        cons_ma = self.df['Consecutive_Pairs'].rolling(window=50).mean()
        plt.plot(self.df['Draw Date'], cons_ma, linewidth=2, color='green')
        plt.title('Consecutive Pairs Trend (50-draw MA)')
        plt.xlabel('Date')
        plt.ylabel('Average Consecutive Pairs')
        plt.xticks(rotation=45)
        
        # 9. Prime number frequency
        plt.subplot(4, 4, 9)
        prime_freq = self.df['Prime_Count'].value_counts().sort_index()
        plt.bar(prime_freq.index, prime_freq.values, alpha=0.7)
        plt.title('Distribution of Prime Numbers per Draw')
        plt.xlabel('Number of Primes')
        plt.ylabel('Frequency')
        
        # 10. Fibonacci number frequency
        plt.subplot(4, 4, 10)
        fib_freq = self.df['Fibonacci_Count'].value_counts().sort_index()
        plt.bar(fib_freq.index, fib_freq.values, alpha=0.7, color='orange')
        plt.title('Distribution of Fibonacci Numbers per Draw')
        plt.xlabel('Number of Fibonacci Numbers')
        plt.ylabel('Frequency')
        
        # 11. Low/High ratio distribution
        plt.subplot(4, 4, 11)
        plt.hist(self.df['Low_High_Ratio'], bins=20, alpha=0.7, edgecolor='black')
        plt.title('Low/High Number Ratio Distribution')
        plt.xlabel('Low/High Ratio')
        plt.ylabel('Frequency')
        
        # 12. Gap variance over time
        plt.subplot(4, 4, 12)
        gap_var_ma = self.df['Gap_Variance'].rolling(window=50).mean()
        plt.plot(self.df['Draw Date'], gap_var_ma, linewidth=2, color='purple')
        plt.title('Gap Variance Trend (50-draw MA)')
        plt.xlabel('Date')
        plt.ylabel('Average Gap Variance')
        plt.xticks(rotation=45)
        
        # 13. Sum distribution by cluster
        plt.subplot(4, 4, 13)
        if 'Cluster' in self.df.columns:
            for cluster_id in sorted(self.df['Cluster'].unique()):
                cluster_data = self.df[self.df['Cluster'] == cluster_id]['Sum']
                plt.hist(cluster_data, alpha=0.5, label=f'Cluster {cluster_id}', bins=15)
            plt.title('Sum Distribution by Cluster')
            plt.xlabel('Sum')
            plt.ylabel('Frequency')
            plt.legend()
        
        # 14. Powerball frequency with trend
        plt.subplot(4, 4, 14)
        pb_freq = Counter(self.powerballs)
        pb_nums = list(range(1, 27))
        pb_counts = [pb_freq.get(num, 0) for num in pb_nums]
        plt.bar(pb_nums, pb_counts, alpha=0.7, color='red')
        plt.title('Powerball Frequency Distribution')
        plt.xlabel('Powerball Number')
        plt.ylabel('Frequency')
        
        # 15. Rolling statistics
        plt.subplot(4, 4, 15)
        plt.plot(self.df['Draw Date'], self.df['Sum_MA_10'], label='10-draw MA', alpha=0.7)
        plt.plot(self.df['Draw Date'], self.df['Sum_MA_50'], label='50-draw MA', linewidth=2)
        plt.title('Rolling Average Trends')
        plt.xlabel('Date')
        plt.ylabel('Sum')
        plt.legend()
        plt.xticks(rotation=45)
        
        # 16. Feature importance (variance)
        plt.subplot(4, 4, 16)
        feature_vars = self.df[features].var().sort_values(ascending=True)
        plt.barh(range(len(feature_vars)), feature_vars.values)
        plt.yticks(range(len(feature_vars)), feature_vars.index)
        plt.title('Feature Variance (Importance)')
        plt.xlabel('Variance')
        
        plt.tight_layout()
        plt.savefig('advanced_pattern_analysis.png', dpi=300, bbox_inches='tight')
        print("Advanced visualizations saved as 'advanced_pattern_analysis.png'")
        plt.show()
    
    def run_advanced_analysis(self):
        """Run the complete advanced pattern analysis."""
        print("ADVANCED POWERBALL PATTERN RECOGNITION ANALYZER")
        print("="*70)
        
        self.sequence_pattern_analysis()
        self.clustering_analysis()
        self.temporal_pattern_analysis()
        self.correlation_analysis()
        self.advanced_frequency_analysis()
        self.create_advanced_visualizations()
        
        print("\n" + "="*70)
        print("ADVANCED ANALYSIS COMPLETE!")
        print("="*70)
        print("Key Advanced Insights:")
        print("- Machine learning clustering reveals hidden draw patterns")
        print("- Temporal analysis shows seasonal and weekly variations")
        print("- Statistical tests identify significant number biases")
        print("- Advanced visualizations reveal complex relationships")
        print("- Pattern recognition helps understand lottery behavior")
        print("\nNote: This is for entertainment and research purposes only!")
        print("Lottery numbers are random - no pattern guarantees future results!")

def main():
    """Main function to run the advanced pattern analyzer."""
    csv_file = "Lottery_Powerball_Winning_Numbers__Beginning_2010.csv"
    
    try:
        analyzer = AdvancedPatternAnalyzer(csv_file)
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
