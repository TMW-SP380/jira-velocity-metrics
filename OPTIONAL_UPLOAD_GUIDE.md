# Optional Confluence Upload Guide

## Overview

Confluence upload is now **optional** and controlled by a command-line flag. By default, reports are generated locally without uploading to Confluence.

## Usage

### Generate Reports Only (Default)
```bash
python3 main.py
```
- Generates PPT reports locally
- Saves to `reports/` directory
- **Does NOT upload to Confluence**

### Generate and Upload to Confluence
```bash
python3 main.py --upload
```
or use the short form:
```bash
python3 main.py -u
```
- Generates PPT reports locally
- **Uploads to Confluence** (if `CONFLUENCE_PAGE_ID` is configured)
- Updates page content with attachment links

## Command-Line Options

| Flag | Long Form | Description |
|------|-----------|-------------|
| `-u` | `--upload` | Upload generated reports to Confluence |

## Examples

### Example 1: Local Generation Only
```bash
$ python3 main.py

============================================================
Jira Velocity Metrics Generator
============================================================

📁 Reports will be saved locally (use --upload to upload to Confluence)

Found 1 team(s) to process

...
✓ Successfully generated report: reports/ELECOM_velocity_report_20260121_150000.pptx

💡 Tip: Use --upload flag to upload this report to Confluence
```

### Example 2: With Upload
```bash
$ python3 main.py --upload

============================================================
Jira Velocity Metrics Generator
============================================================

📤 Confluence upload enabled

Found 1 team(s) to process

...
✓ Successfully generated report: reports/ELECOM_velocity_report_20260121_150000.pptx

Uploading to Confluence...
✓ Successfully uploaded: ELECOM_velocity_report_20260121_150000.pptx
✓ Successfully uploaded to Confluence page 279707663
Adding attachment links to page content...
✓ Successfully added attachment links to page content
```

## Configuration

### Required for Upload
To use the `--upload` flag, ensure your `.env` file contains:
```env
CONFLUENCE_PAGE_ID=279707663
CONFLUENCE_SPACE_KEY=TR
JIRA_API_TOKEN=your-token-here
JIRA_EMAIL=your.email@company.com
```

### Without Upload Flag
You can still generate reports even if Confluence is not configured. Only Jira credentials are required:
```env
JIRA_SERVER=https://tailored-prod.atlassian.net
JIRA_EMAIL=your.email@company.com
JIRA_API_TOKEN=your-token-here
TEAMS=TeamName:BoardID:ProjectKey
```

## Help

View all available options:
```bash
python3 main.py --help
```

## Workflow Recommendations

### Daily/Weekly Reports (Local Only)
```bash
python3 main.py
```
- Fast execution
- No network dependency for Confluence
- Reports saved locally for review

### Sharing with Team (Upload)
```bash
python3 main.py --upload
```
- Uploads to shared Confluence page
- Makes reports accessible to team
- Updates page content automatically

## Troubleshooting

### "Confluence upload requested but CONFLUENCE_PAGE_ID not set"
- Add `CONFLUENCE_PAGE_ID` to your `.env` file
- Or remove `--upload` flag to generate locally only

### "Failed to upload to Confluence"
- Check your `CONFLUENCE_PAGE_ID` is correct
- Verify `JIRA_API_TOKEN` has write permissions
- Ensure the Confluence page exists and is published

### Reports Generated But Not Uploaded
- This is expected behavior when `--upload` flag is not used
- Reports are saved in `reports/` directory
- Use `--upload` flag next time to upload

## Benefits

✅ **Control**: You decide when to upload  
✅ **Speed**: Faster execution without upload step  
✅ **Flexibility**: Generate reports without Confluence access  
✅ **Safety**: No accidental uploads to shared pages  
