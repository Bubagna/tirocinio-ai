#!/usr/bin/env python3
"""
GitHub Copilot Metrics Downloader
Downloads Copilot usage metrics data from GitHub Enterprise API
"""
 
import os
import sys
import json
import requests
from datetime import datetime
from pathlib import Path
 
class CopilotMetricsDownloader:
    def __init__(self, api_base_url, enterprise, token):
        """
        Initialize the downloader
       
        Args:
            api_base_url: Base URL for GitHub API (e.g., https://api.crifgroup.ghe.com)
            enterprise: Enterprise name (e.g., CRIFGROUP)
            token: GitHub personal access token
        """
        self.api_base_url = api_base_url.rstrip('/')
        self.enterprise = enterprise
        self.token = token
        self.headers = {
            'Accept': 'application/vnd.github+json',
            'Authorization': f'Bearer {token}',
            'X-GitHub-Api-Version': '2022-11-28'
        }
   
    def get_download_links(self, report_type='enterprise-28-day'):
        """
        Retrieve download links from the Copilot metrics API
       
        Args:
            report_type: Type of report (default: enterprise-28-day)
           
        Returns:
            dict: Response containing download_links, report_start_day, report_end_day
        """
        url = f'{self.api_base_url}/enterprises/{self.enterprise}/copilot/metrics/reports/{report_type}/latest'
       
        print(f'Fetching download links from: {url}')
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
       
        data = response.json()
        print(f'Report period: {data["report_start_day"]} to {data["report_end_day"]}')
        print(f'Found {len(data["download_links"])} file(s) to download')
       
        return data
   
    def download_file(self, url, output_path):
        """
        Download a single file from the given URL
       
        Args:
            url: URL to download from
            output_path: Path where to save the file
        """
        print(f'Downloading: {output_path.name}')
        response = requests.get(url, stream=True)
        response.raise_for_status()
       
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
       
        print(f'  Saved: {output_path} ({output_path.stat().st_size} bytes)')
   
    def download_all_files(self, download_links, output_dir='APP/data/raw/', report_type='enterprise'):
        """
        Download all files from the download links
       
        Args:
            download_links: List of URLs to download
            output_dir: Directory to save files (default: APP/data/raw/)
            report_type: Type of report for filename prefix
        """
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
       
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
       
        for idx, url in enumerate(download_links, 1):
            filename = f'copilot_{report_type}_{timestamp}_part{idx:03d}.json'
            file_path = output_path / filename
           
            try:
                self.download_file(url, file_path)
            except Exception as e:
                print(f'  Error downloading file {idx}: {e}')
                raise
       
        print(f'\nAll files downloaded successfully to: {output_path.absolute()}')
        return output_path
   
    def run(self, report_types=['enterprise-28-day', 'users-28-day'], output_dir='APP/data/raw/'):
        """
        Execute the complete download process for multiple report types
       
        Args:
            report_types: List of report types to download (default: enterprise and users)
            output_dir: Directory to save downloaded files
        """
        print('=== GitHub Copilot Metrics Downloader ===\n')
       
        all_metadata = []
       
        for report_type in report_types:
            print(f'\n--- Processing {report_type} report ---')
           
            try:
                # Get download links
                data = self.get_download_links(report_type)
               
                # Download all files
                print('\nDownloading files...')
                report_prefix = report_type.split('-')[0]  # 'enterprise' or 'users'
                output_path = self.download_all_files(data['download_links'], output_dir, report_prefix)
               
                # Save metadata
                metadata = {
                    'report_start_day': data['report_start_day'],
                    'report_end_day': data['report_end_day'],
                    'report_type': report_type,
                    'download_timestamp': datetime.now().isoformat(),
                    'files_count': len(data['download_links'])
                }
                all_metadata.append(metadata)
               
            except requests.exceptions.HTTPError as e:
                print(f'\nWarning: Failed to download {report_type} report')
                print(f'HTTP Error: {e}')
                print(f'Response: {e.response.text}')
                print('Continuing with next report...')
                continue
            except Exception as e:
                print(f'\nWarning: Failed to download {report_type} report: {e}')
                print('Continuing with next report...')
                continue
       
        # Save combined metadata
        if all_metadata:
            output_path = Path(output_dir)
            metadata_path = output_path / 'metadata.json'
            with open(metadata_path, 'w') as f:
                json.dump(all_metadata, f, indent=2)
           
            print(f'\nMetadata saved to: {metadata_path}')
       
        print('\n=== Download Complete ===')
 
def main():
    # Configuration - can be set via environment variables or modified here
    api_base_url = os.getenv('GITHUB_API_URL', 'https://api.crifgroup.ghe.com')
    enterprise = os.getenv('GITHUB_ENTERPRISE', 'CRIFGROUP')
    token = os.getenv('GITHUB_TOKEN')
   
    if not token:
        print('Error: GITHUB_TOKEN environment variable not set')
        print('Usage: set GITHUB_TOKEN=your_token_here')
        print('       python copilot_metrics_downloader.py')
        sys.exit(1)
   
    # Initialize and run downloader
    downloader = CopilotMetricsDownloader(api_base_url, enterprise, token)
   
    # Download both enterprise and user reports
    report_types = ['enterprise-28-day', 'users-28-day']
   
    try:
        output_dir = os.getenv('RAW_DATA_DIR', 'APP/data/raw')
        downloader.run(report_types=report_types, output_dir=output_dir)
    except Exception as e:
        print(f'\nError: {e}')
        sys.exit(1)
 
if __name__ == '__main__':
    main()