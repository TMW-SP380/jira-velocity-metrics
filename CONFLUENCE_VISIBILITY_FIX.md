# Confluence Attachments Visibility Fix

## Problem
Attachments uploaded to Confluence don't automatically appear in the page content - they're stored separately and need to be accessed via the attachments panel.

## Solution
The code has been enhanced to automatically add attachment links to the page content after uploading, making reports visible directly on the page.

## What Changed

### 1. Enhanced `confluence_uploader.py`
- Added `add_attachments_to_page_content()` method that:
  - Lists all PowerPoint attachments
  - Adds a formatted section to the page with download links
  - Includes an attachments macro for easy viewing
  - Shows the latest 10 reports with dates

### 2. Updated `main.py`
- After uploading a report, it now automatically updates the page content
- Adds attachment links so reports are visible on the page

### 3. New Helper Script
- `check_confluence_attachments.py` - Check existing attachments and update page content

## Usage

### Automatic (Recommended)
Just run your normal workflow:
```bash
python3 main.py
```

The script will:
1. Generate PPT reports
2. Upload them to Confluence
3. **Automatically add attachment links to the page content**

### Check Existing Attachments
If you already have uploaded reports but they're not visible:

```bash
python3 check_confluence_attachments.py
```

This will:
- Show all attachments on the page
- Optionally update the page content to make them visible

### Manual Update (if needed)
If automatic update fails, you can manually add attachments to the page:

1. Go to your Confluence page
2. Click **"Edit"**
3. Type `/` and search for **"attachments"**
4. Select **"Attachments"** macro
5. Click **"Publish"**

## Viewing Attachments

### Method 1: Page Content (New!)
After running the updated code, attachments will appear directly on the page in a formatted list.

### Method 2: Attachments Panel
1. Go to your Confluence page
2. Click **"..."** (three dots) in the top right
3. Select **"View attachments"**

### Method 3: Direct Download
Attachments are accessible via:
```
https://tailored-prod.atlassian.net/wiki/download/attachments/{PAGE_ID}/{FILENAME}
```

## Troubleshooting

### "Attachments still not visible"
1. Run `python3 check_confluence_attachments.py` to verify uploads
2. Check if page content was updated (refresh the page)
3. Verify `CONFLUENCE_PAGE_ID` is correct in `.env`

### "Page content update failed"
- Attachments are still uploaded successfully
- Check the attachments panel (Method 2 above)
- You can manually add the attachments macro

### "Permission denied"
- Make sure you have edit permissions on the Confluence page
- Verify your API token has write access

## Example Output

After running `main.py`, you'll see:
```
✓ Successfully uploaded: ELECOM_velocity_report_20260121_123547.pptx
✓ Successfully uploaded to Confluence page 279707663
Adding attachment links to page content...
✓ Successfully added attachment links to page content
  View your page to see the reports!
```

## Next Steps

1. **Run your report generation**: `python3 main.py`
2. **Check the page**: Reports should now be visible on the page
3. **Organize by sprint**: The page will show latest reports with dates

Your reports will now be visible directly on the Confluence page! 🎉
