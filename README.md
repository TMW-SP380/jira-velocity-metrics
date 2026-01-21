# Jira Velocity Metrics Generator

A Python tool to automatically generate PowerPoint presentations with developer velocity metrics from Jira sprint boards. This tool helps teams track their velocity improvements after adopting AI tools and monitor key metrics like story points, defects, and sprint completion rates.

## Features

- 📊 **Automated Metrics Collection**: Fetches sprint data directly from Jira API
- 📈 **Velocity Tracking**: Calculates baseline and post-AI velocity improvements
- 🐛 **Defect Analysis**: Tracks defect counts and reduction percentages
- 📋 **Story Points Tracking**: Monitors committed vs completed story points
- 🤖 **AI Impact Analysis**: Track time saved using labels (AI1, AI2, AI3...) or custom fields
- 🎨 **Professional PPT Generation**: Creates visually appealing PowerPoint presentations
- 👥 **Multi-Team Support**: Configure multiple teams/boards in one setup

## Prerequisites

- Python 3.7+
- Jira account with API access
- Jira API token

## Installation

1. Clone or download this repository

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
# Jira Configuration
JIRA_SERVER=https://tailored-prod.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token-here

# Team Configuration (comma-separated)
# Format: team_name:board_id:project_key
TEAMS=ELECOM:58:ELECOM

# AI Adoption Date (YYYY-MM-DD)
AI_ADOPTION_DATE=2024-01-01

# Optional: AI Story Points Custom Field ID (if you have admin rights)
# If not set, the app will use Labels (AI1, AI2, AI3...) to track time saved
# AI_STORY_POINTS_FIELD_ID=customfield_10130
```

### Getting Your Jira API Token

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a label (e.g., "Velocity Metrics Tool")
4. Copy the generated token to your `.env` file

### Finding Your Board ID

The board ID is in the URL when you view your Jira board:
- URL format: `https://your-domain.atlassian.net/jira/software/c/projects/PROJECT/boards/BOARD_ID`
- Example: `https://tailored-prod.atlassian.net/jira/software/c/projects/ELECOM/boards/58`
- Board ID: `58`

## Usage

### Basic Usage

Run the script to generate reports for all configured teams:

```bash
python main.py
```

Reports will be saved in the `reports/` directory with timestamps.

### Adding Multiple Teams

Edit your `.env` file to add multiple teams (comma-separated):

```env
TEAMS=ELECOM:58:ELECOM,Frontend:123:FE,Backend:456:BE
```

### Customizing AI Adoption Date

Set the date when your team started using AI tools. Metrics before this date will be used as baseline:

```env
AI_ADOPTION_DATE=2024-03-15
```

## Metrics Collected

### Current Sprint Metrics
- Story Points Committed
- Story Points Completed
- Completion Rate
- Defect Count
- Total Issues
- Completed Issues

### Velocity Metrics
- Baseline Velocity (before AI adoption)
- Post-AI Velocity (after AI adoption)
- Velocity Improvement Percentage

### Defect Metrics
- Average Defects (baseline)
- Average Defects (post-AI)
- Defect Reduction Percentage

## Output

The tool generates PowerPoint presentations (`.pptx` files) with the following slides:

1. **Title Slide**: Team name, sprint name, and generation date
2. **Current Sprint Metrics**: Key metrics for the current/active sprint
3. **Velocity Improvement**: Comparison chart showing velocity before and after AI adoption
4. **Defect Metrics**: Defect comparison and reduction analysis
5. **Summary**: Key takeaways and highlights

Files are saved as: `reports/{TeamName}_velocity_report_{timestamp}.pptx`

## Tracking AI Impact (Time Saved)

### Option 1: Using Labels (No Admin Rights Required) ⭐ Recommended

Simply add labels to your issues:
- **AI1** = 1 story point saved
- **AI2** = 2 story points saved
- **AI3** = 3 story points saved
- And so on...

**Example:**
- Issue has **Story Points: 2** (actual with AI)
- Issue has **Label: AI3** (3 points saved)
- App calculates: **AI Story Points = 5** (2 + 3)
- **Time Saved: 3 SP** (60% reduction)

See [AI_STORY_POINTS_LABELS_GUIDE.md](AI_STORY_POINTS_LABELS_GUIDE.md) for detailed instructions.

### Option 2: Using Custom Field (Requires Admin Rights)

1. Create a custom "Number" field named "AI Story Points" in Jira
2. Add the field ID to your `.env` file:
   ```env
   AI_STORY_POINTS_FIELD_ID=customfield_10130
   ```
3. Fill in both fields for each issue:
   - **Story Points**: Actual points (with AI)
   - **AI Story Points**: Estimated points (without AI)

See [JIRA_AI_STORY_POINTS_SETUP.md](JIRA_AI_STORY_POINTS_SETUP.md) for detailed instructions.

## Troubleshooting

### Common Issues

1. **"Invalid configuration" error**
   - Ensure your `.env` file exists and contains all required fields
   - Check that JIRA_EMAIL and JIRA_API_TOKEN are set correctly

2. **"No active sprint found"**
   - The tool will try to use the most recent sprint
   - Ensure your board has at least one sprint (active or closed)

3. **"Story points not found"**
   - Jira story points field may vary by instance
   - Check `jira_client.py` and update the `_get_story_points` method with your custom field ID
   - Common field IDs: `customfield_10016`, `customfield_10020`, `customfield_10021`

4. **API Authentication Errors**
   - Verify your API token is correct
   - Ensure your email matches your Jira account
   - Check that your account has access to the specified board

### Finding Custom Field IDs

To find your story points field ID:
1. Go to any issue in Jira
2. Inspect the story points field in browser developer tools
3. Look for `customfield_XXXXX` in the HTML
4. Update `jira_client.py` accordingly

## Project Structure

```
jira-velocity-metrics/
├── main.py                 # Main entry point
├── config.py               # Configuration management
├── jira_client.py          # Jira API integration
├── metrics_calculator.py   # Metrics calculation logic
├── ppt_generator.py        # PowerPoint generation
├── requirements.txt        # Python dependencies
├── .env.example           # Configuration template
├── .gitignore            # Git ignore rules
├── README.md             # This file
└── reports/              # Generated PPT files (created automatically)
```

## Customization

### Adding More Metrics

To add additional metrics:
1. Extend `metrics_calculator.py` with new calculation methods
2. Update `ppt_generator.py` to create new slides
3. Modify `main.py` to include new metrics in the report

### Customizing PPT Design

Edit `ppt_generator.py` to customize:
- Colors and fonts
- Slide layouts
- Chart styles
- Additional visualizations

## License

This project is provided as-is for internal use.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Jira API documentation: https://developer.atlassian.com/cloud/jira/platform/rest/v3/
3. Verify your Jira instance configuration
