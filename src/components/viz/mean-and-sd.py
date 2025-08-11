import os
import glob
import re
import pandas as pd
import matplotlib.pyplot as plt

# --- CONFIG ---
BASE_DIR = os.path.expanduser('~/Desktop/sentiments')
TITLE_COL = 'title'
SENTIMENT_COL = 'sentiment'
DEM_COL = 'more dem'
REP_COL = 'more rep'

# --- Loop through month folders and compute stats ---
month_folders = sorted(glob.glob(os.path.join(BASE_DIR, 'month *')))
summary = []

for month_path in month_folders:
    month_name = os.path.basename(month_path)  # e.g., "month 01"
    month_num = int(re.search(r'\d+', month_name).group())  # gets 1, 2, ..., 12
    csv_files = glob.glob(os.path.join(month_path, '*.csv'))

    all_rows = []

    for csv_file in csv_files:
        try:
            df = pd.read_csv(csv_file)
            if all(col in df.columns for col in [SENTIMENT_COL, DEM_COL, REP_COL]):
                df = df[[SENTIMENT_COL, DEM_COL, REP_COL]].dropna()
                all_rows.append(df)
        except Exception as e:
            print(f"⚠️ Skipping {csv_file}: {e}")

    if not all_rows:
        continue

    month_df = pd.concat(all_rows, ignore_index=True)

    # Compute stats
    def compute_stats(subset):
        return {
            'mean': subset[SENTIMENT_COL].mean(),
            'std': subset[SENTIMENT_COL].std(),
            'count': len(subset)
        }

    stats_all = compute_stats(month_df)
    stats_dem = compute_stats(month_df[month_df[DEM_COL] == True])
    stats_rep = compute_stats(month_df[month_df[REP_COL] == True])

    summary.append({
        'month': month_name,
        'month_num': month_num,
        'mean_all': stats_all['mean'],
        'std_all': stats_all['std'],
        'mean_dem': stats_dem['mean'],
        'std_dem': stats_dem['std'],
        'mean_rep': stats_rep['mean'],
        'std_rep': stats_rep['std'],
        'count_all': stats_all['count'],
        'count_dem': stats_dem['count'],
        'count_rep': stats_rep['count']
    })

# --- Create DataFrame and Sort by Month ---
summary_df = pd.DataFrame(summary)
summary_df = summary_df.sort_values('month_num')

# --- Plot 1: Mean Sentiment ---
plt.figure(figsize=(12, 6))
plt.plot(summary_df['month'], summary_df['mean_all'], marker='o', color='gray', label='All Articles')
plt.plot(summary_df['month'], summary_df['mean_dem'], marker='o', color='blue', label='More Dem')
plt.plot(summary_df['month'], summary_df['mean_rep'], marker='o', color='red', label='More Rep')

plt.xlabel('Month')
plt.ylabel('Average Sentiment Score')
plt.title('Average Sentiment by Month')
plt.xticks(rotation=45)
plt.grid(True, linestyle='--', alpha=0.6)
plt.legend()
plt.tight_layout()
plt.show()

# --- Plot 2: Standard Deviation ---
plt.figure(figsize=(12, 6))
plt.plot(summary_df['month'], summary_df['std_all'], marker='o', color='gray', label='All Articles')
plt.plot(summary_df['month'], summary_df['std_dem'], marker='o', color='blue', label='More Dem')
plt.plot(summary_df['month'], summary_df['std_rep'], marker='o', color='red', label='More Rep')

plt.xlabel('Month')
plt.ylabel('Sentiment Standard Deviation')
plt.title('Sentiment Variability by Month')
plt.xticks(rotation=45)
plt.grid(True, linestyle='--', alpha=0.6)
plt.legend()
plt.tight_layout()
plt.show()
