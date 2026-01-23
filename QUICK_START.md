# Quick Start Guide

## Step 1: Install Dependencies

```bash
cd jira-velocity-metrics
pip install -r requirements.txt
```

## Step 2: Get Your Jira API Token

1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Copy the token (you'll only see it once!)

## Step 3: Configure Your Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your details:

```env
JIRA_SERVER=https://tailored-prod.atlassian.net
JIRA_EMAIL=your.email@company.com
JIRA_API_TOKEN=paste-your-token-here
TEAMS=ELECOM:58:ELECOM
AI_ADOPTION_DATE=2024-01-01
```

### Finding Your Board ID

Your board ID is in the Jira URL:
- URL: `https://tailored-prod.atlassian.net/jira/software/c/projects/ELECOM/boards/58`
- Board ID: `58` (the number after `/boards/`)

## Step 4: Test Connection

```bash
python test_connection.py
```

This will verify:
- Your credentials work
- You can access the specified boards
- Sprints are available

## Step 5: Generate Report

```bash
python main.py
```

Your PowerPoint report will be saved in the `reports/` folder!

## Adding More Teams

Edit `.env`:

```env
# Single team
TEAMS=ELECOM:58:ELECOM

# Multiple teams (comma-separated)
TEAMS=ELECOM:58:ELECOM,Search and Nav:56:ELECOM

# More teams example
TEAMS=ELECOM:58:ELECOM,Search and Nav:56:ELECOM,Frontend:123:FE,Backend:456:BE
```

**Format:** `team_name:board_id:project_key`

**Finding Board ID:**
- URL: `https://tailored-prod.atlassian.net/jira/software/c/projects/ELECOM/boards/56`
- Board ID: `56` (the number after `/boards/`)

## Troubleshooting

### Story Points Not Showing?

Your Jira instance might use a different custom field for story points. To find it:

1. Open any issue in Jira
2. Right-click on the Story Points field → Inspect
3. Look for `customfield_XXXXX` in the HTML
4. Edit `jira_client.py`, find `_get_story_points` method
5. Add your field ID to the list

Example:
```python
if hasattr(issue.fields, 'customfield_10016'):  # Your field ID
    return float(issue.fields.customfield_10016)
```

### No Sprints Found?

- Make sure your board has at least one sprint (active or closed)
- Verify the board ID is correct
- Check that you have access to the board

### API Errors?

- Double-check your API token
- Ensure your email matches your Jira account
- Verify your account has permission to view the board
