import kagglehub
import os
from pathlib import Path

# Set up the download directory
download_dir = Path("data/chest_xrays")
download_dir.mkdir(parents=True, exist_ok=True)

print("Starting dataset download...")
try:
    # Download the NIH Chest X-ray dataset
    path = kagglehub.dataset_download(
        "nih-chest-xrays/data",
        path=str(download_dir)
    )
    print(f"Dataset downloaded to: {path}")
    
    # List the downloaded files
    print("\nDownloaded files:")
    for root, dirs, files in os.walk(path):
        level = root.replace(str(path), '').count(os.sep)
        indent = ' ' * 4 * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 4 * (level + 1)
        for f in files[:5]:  # Show first 5 files in each directory
            print(f"{subindent}{f}")
        if len(files) > 5:
            print(f"{subindent}... and {len(files) - 5} more files")
            
except Exception as e:
    print(f"Error downloading dataset: {str(e)}")
    print("\nMake sure you have:")
    print("1. A valid kaggle.json in your .kaggle directory")
    print("2. Accepted the competition rules on Kaggle")
    print("3. Sufficient disk space (the dataset is large)")
