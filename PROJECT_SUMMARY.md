# Project Summary: Jira Velocity Metrics Generator

## Overview

This project automatically generates PowerPoint presentations with developer velocity metrics from Jira sprint boards. It's designed to help teams track their performance improvements after adopting AI tools.

## Key Features

✅ **Automated Data Collection**: Fetches sprint data directly from Jira API  
✅ **Velocity Tracking**: Calculates baseline vs post-AI velocity  
✅ **Defect Analysis**: Tracks defect counts and reduction  
✅ **Story Points Monitoring**: Committed vs completed tracking  
✅ **Professional PPTs**: Creates visually appealing presentations  
✅ **Multi-Team Support**: Configure multiple teams in one setup  

## Metrics Collected

### Current Sprint
- Story Points Committed
- Story Points Completed  
- Completion Rate
- Defect Count
- Total/Completed Issues

### Velocity Analysis
- Baseline Velocity (before AI)
- Post-AI Velocity
- Improvement Percentage

### Defect Analysis
- Average Defects (baseline)
- Average Defects (post-AI)
- Defect Reduction Percentage

## Project Structure

```
jira-velocity-metrics/
├── main.py                 # Main entry point - run this to generate reports
├── config.py               # Configuration management from .env
├── jira_client.py          # Jira API integration
├── metrics_calculator.py   # All metrics calculation logic
├── ppt_generator.py        # PowerPoint generation with charts
├── test_connection.py      # Test script to verify setup
├── requirements.txt        # Python dependencies
├── .env.example           # Configuration template
├── README.md              # Full documentation
├── QUICK_START.md         # Quick setup guide
└── reports/               # Generated PPT files (auto-created)
```

## How It Works

1. **Configuration**: Reads team/board info from `.env` file
2. **Data Fetching**: Connects to Jira API and fetches sprint data
3. **Metrics Calculation**: 
   - Separates sprints before/after AI adoption date
   - Calculates velocity averages
   - Computes improvement percentages
4. **PPT Generation**: Creates slides with:
   - Current sprint metrics
   - Velocity comparison charts
   - Defect analysis
   - Summary and takeaways

## Usage Flow

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure .env file
cp .env.example .env
# Edit .env with your Jira credentials

# 3. Test connection
python test_connection.py

# 4. Generate reports
python main.py
```

## Customization Points

### Adding More Teams
Edit `.env`:
```env
TEAMS=Team1:BoardID1:Project1,Team2:BoardID2:Project2
```

### Changing AI Adoption Date
```env
AI_ADOPTION_DATE=2024-03-15
```

### Custom Story Points Field
If your Jira uses a different field for story points, edit `jira_client.py`:
- Find `_get_story_points` method
- Add your custom field ID (e.g., `customfield_10016`)

### Customizing PPT Design
Edit `ppt_generator.py` to change:
- Colors and fonts
- Slide layouts
- Chart styles

## Output

PowerPoint files are saved as:
```
reports/{TeamName}_velocity_report_{YYYYMMDD_HHMMSS}.pptx
```

Each presentation includes:
1. Title slide
2. Current sprint metrics
3. Velocity improvement (with chart)
4. Defect metrics (with chart)
5. Summary slide

## Next Steps

1. Set up your `.env` file with Jira credentials
2. Run `test_connection.py` to verify setup
3. Run `main.py` to generate your first report
4. Customize as needed for your team's specific requirements

## Support

- Check `README.md` for detailed documentation
- See `QUICK_START.md` for setup instructions
- Review troubleshooting section in README for common issues
