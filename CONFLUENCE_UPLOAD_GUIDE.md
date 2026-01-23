# Uploading Reports to Confluence Wiki

This guide shows you how to upload your generated PowerPoint reports to a Confluence wiki page.

## Option 1: Automatic Upload (Recommended) ⭐

The app automatically uploads reports to Confluence after generation if configured.

### Setup

Add to your `.env` file:

```env
# Confluence Configuration
CONFLUENCE_PAGE_ID=279707663
CONFLUENCE_SPACE_KEY=TR
```

**Important Notes:**
- **API Token**: Uses the same `JIRA_API_TOKEN` as your Jira configuration (no separate token needed)
- **Page Status**: The page must be **published** (not in draft mode) for the API to work
- If your page is a draft, publish it first in Confluence, then run the upload

### Usage

Just run the app as usual:

```bash
python3 main.py
```

The app will:
1. Generate PowerPoint reports
2. Automatically upload each report to Confluence
3. Show upload status for each file

### Example Output

```
✓ Successfully generated report: reports/ELECOM_velocity_report_20260120_180213.pptx

Uploading to Confluence...
✓ Successfully uploaded: ELECOM_velocity_report_20260120_180213.pptx
✓ Successfully uploaded to Confluence page 279707663
```

## Option 2: Manual Upload

### Step 1: Generate Reports
```bash
python3 main.py
```

### Step 2: Upload to Confluence
1. Go to your Confluence page: https://tailored-prod.atlassian.net/wiki/spaces/TR/pages/279707663
2. Click **"Edit"** button
3. Click the **"+"** button or drag and drop
4. Select **"Files and images"** or **"Attachment"**
5. Browse to your `reports/` folder
6. Select the PowerPoint file(s) you want to upload
7. Click **"Publish"** or **"Update"**

### Step 3: Organize Files
- You can add descriptions for each attachment
- Organize by sprint date or team name
- Add links to the attachments in your page content

## Option 2: Automated Upload via Confluence API

For automated uploads, you can use the Confluence REST API. Here's a Python script to do this:

### Prerequisites

Install additional dependency:
```bash
pip3 install requests
```

### Configuration

Add to your `.env` file:
```env
# Confluence Configuration (optional)
CONFLUENCE_SERVER=https://tailored-prod.atlassian.net
CONFLUENCE_EMAIL=your.email@company.com
CONFLUENCE_API_TOKEN=your-api-token-here
CONFLUENCE_PAGE_ID=279707663
CONFLUENCE_SPACE_KEY=TR
```

**Note:** Use the same API token as your Jira token (they're the same for Atlassian Cloud).

### Finding Your Page ID

From your URL: `https://tailored-prod.atlassian.net/wiki/spaces/TR/pages/edit-v2/279707663`
- **Space Key**: `TR`
- **Page ID**: `279707663` (the number in the URL)

## Option 3: Integration Script

I can create a script that:
1. Generates the reports
2. Automatically uploads them to Confluence
3. Updates the wiki page with links to the reports

Would you like me to create this integration script?

## Manual Process (Recommended for Now)

Since Confluence API requires additional setup, here's the recommended workflow:

### Weekly Workflow

1. **Generate Reports**
   ```bash
   python3 main.py
   ```

2. **Navigate to Confluence Page**
   - Go to: https://tailored-prod.atlassian.net/wiki/spaces/TR/pages/279707663
   - Click **"Edit"**

3. **Upload Latest Reports**
   - Find the latest files in `reports/` folder
   - Upload them as attachments
   - Add a section with sprint date and team name

4. **Organize by Sprint**
   - Create sections for each sprint
   - Link to the PowerPoint files
   - Add summary metrics in the page content

### Example Page Structure

```markdown
# Sprint Velocity Metrics

## Sprint 26 (Jan 7-21, 2026)

### ELECOM Team
- [Velocity Report](link-to-attachment)
- Story Points: 61 SP
- Completion Rate: 57.38%
- AI Impact: 6 SP saved (8.96%)

### Search and Nav Team
- [Velocity Report](link-to-attachment)
- Story Points: XX SP
- Completion Rate: XX%

## Previous Sprints
[Links to older reports...]
```

## Tips

1. **File Naming**: The app already includes timestamps in filenames, making it easy to identify the latest reports
2. **Version Control**: Confluence keeps version history, so you can track changes
3. **Permissions**: Make sure you have edit permissions on the Confluence page
4. **Space**: Verify you have access to the `TR` space

## Next Steps

Would you like me to:
1. Create an automated upload script using Confluence API?
2. Add a feature to the main script to upload after generation?
3. Create a template for organizing reports in Confluence?

Let me know which option you prefer!
