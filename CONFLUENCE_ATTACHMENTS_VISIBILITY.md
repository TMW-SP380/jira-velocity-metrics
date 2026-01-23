# Viewing Attachments in Confluence

## The Upload is Working! ✅

Your PowerPoint files **are being uploaded successfully** to Confluence. However, attachments in Confluence are not always visible in the main page content by default.

## How to View Attachments

### Method 1: View Attachments Panel (Easiest)

1. Go to your Confluence page: https://tailored-prod.atlassian.net/wiki/spaces/TR/pages/279707663/RentalSprintMetrics
2. Look for the **"..."** (three dots) menu in the top right
3. Click **"..."** → **"View attachments"** or **"Attachments"**
4. You'll see all uploaded PowerPoint files listed there

### Method 2: Add Attachment Macro to Page

To make attachments visible directly on the page:

1. Click **"Edit"** on your Confluence page
2. Type `/` to open the insert menu
3. Type "attachment" and select **"Attachments"** macro
4. The macro will show all attachments on the page
5. Click **"Publish"** or **"Update"**

### Method 3: Direct Link

Attachments are accessible via direct links:
- Format: `https://tailored-prod.atlassian.net/wiki/download/attachments/{PAGE_ID}/{FILENAME}`

## Verify Upload Status

You can check if files are uploaded by running:

```bash
python3 -c "from confluence_uploader import ConfluenceUploader; uploader = ConfluenceUploader(); atts = uploader.list_attachments(); print(f'Attachments: {len(atts)}'); [print(f'  - {a.get(\"title\")}') for a in atts]"
```

## Current Status

Based on the test, your page currently has:
- ✅ **1 attachment** uploaded successfully
- File: `ELECOM_velocity_report_20260121_123547.pptx`

## Making Attachments More Visible

### Option 1: Add to Page Content

Edit your page and add this Confluence markup:

```
h2. Sprint Reports

{attachments:page=279707663}
```

This will display all attachments in a nice list format.

### Option 2: Create a Table

Add a table to your page listing all reports:

| Sprint | Team | Report | Date |
|--------|------|--------|------|
| Sprint 26 | ELECOM | [Download Report|^ELECOM_velocity_report_20260121_123547.pptx] | Jan 21, 2026 |

### Option 3: Use Attachment List Macro

1. Edit page
2. Type `/attachment` 
3. Select "Attachments List" macro
4. This will show all attachments with download links

## Troubleshooting

### "I don't see attachments"

1. **Check the attachments panel**: Click "..." → "View attachments"
2. **Refresh the page**: Press F5 or Cmd+R
3. **Check page permissions**: Make sure you have view access
4. **Verify upload**: Run the verification command above

### "Upload says success but no file"

- Check the attachments panel (Method 1 above)
- Verify the page ID is correct in `.env`
- Check Confluence page permissions

## Next Steps

1. **View your attachments**: Use Method 1 above to see uploaded files
2. **Add attachment macro**: Use Method 2 to make them visible on the page
3. **Organize by sprint**: Create sections for each sprint with links to reports

Your uploads are working! The files are there, you just need to view them in the attachments panel or add them to the page content.
