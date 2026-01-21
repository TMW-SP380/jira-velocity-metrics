# AI Story Points - Complete Setup Guide

## Overview

This feature allows you to compare **actual story points** (work done with AI assistance) vs **estimated story points** (work that would have been done without AI) to measure productivity gains and time saved.

## Quick Setup Steps

### 1. Create Custom Field in Jira

1. Go to **Jira Settings** → **Issues** → **Custom fields**
2. Click **"Create custom field"**
3. Select **"Number"** field type
4. Name it: **"AI Story Points"**
5. Add description: `Estimated story points if this work was done without AI assistance`
6. **Note the Field ID** (e.g., `customfield_10130`)

### 2. Add Field to Your Screens

- Add the field to your issue screens (Default Screen, etc.)
- Make sure it appears in the **Details** panel (right sidebar)

### 3. Update Your .env File

Add the field ID to your `.env` file:

```env
AI_STORY_POINTS_FIELD_ID=customfield_10130
```

### 4. Populate the Field

For each issue in your sprints:
- **Story Points**: Actual points (with AI assistance)
- **AI Story Points**: Estimated points (without AI)

**Example:**
- Issue: "Implement Email Notifications"
- **Story Points**: 2 (actual, with AI)
- **AI Story Points**: 5 (estimated, without AI)
- **Time Saved**: 3 story points (60% reduction)

## How It Works

### Metrics Calculated

1. **Time Saved Total**: `AI Story Points - Actual Story Points`
2. **Time Saved Percentage**: `(Time Saved / AI Story Points) × 100`
3. **Time Saved Completed**: For completed issues only

### Reports Generated

The app will now show:

**Console Output:**
```
AI Impact Analysis:
  - AI Story Points (without AI): 55.0 SP
  - Actual Story Points (with AI): 30.0 SP
  - Time Saved: 25.0 SP (45.45%)
  - Time Saved (Completed): 15.0 SP
```

**PowerPoint Slide:**
- New "AI Impact: Time Saved Analysis" slide
- Visual comparison chart
- Time saved metrics

## Finding Your Field ID

### Method 1: Browser Developer Tools
1. Open any issue in Jira
2. Right-click on "AI Story Points" field → **Inspect**
3. Look for `data-testid="issue.views.issue-base.context.story-point-estimate.customfield_XXXXX"`
4. The number after `customfield_` is your field ID

### Method 2: Field Settings
1. Go to **Settings** → **Issues** → **Custom fields**
2. Find "AI Story Points" in the list
3. Click on it
4. Check the URL: `.../fields/customfield_XXXXX`

## Usage Tips

### During Sprint Planning
- Estimate **AI Story Points** first (how long without AI)
- Then estimate **Story Points** (how long with AI)
- The difference shows expected time savings

### During Sprint Execution
- Update **Story Points** as you complete work
- Keep **AI Story Points** as the original estimate
- Track actual vs estimated savings

### Best Practices
- Be honest with estimates (both fields)
- Use consistent estimation methodology
- Track this over multiple sprints for trends
- Share results with stakeholders

## Troubleshooting

### Field Not Showing in Reports
- Check that `AI_STORY_POINTS_FIELD_ID` is set correctly in `.env`
- Verify the field ID matches your Jira instance
- Ensure the field is added to your issue screens

### Zero Values Showing
- Make sure you've populated the "AI Story Points" field in Jira
- Check that issues have both fields filled
- Verify field permissions allow reading

### Field ID Not Working
- Field IDs are unique per Jira instance
- Double-check using browser developer tools
- Ensure you're using the correct format: `customfield_XXXXX`

## Example Workflow

1. **Sprint Planning:**
   - Team estimates: "This feature would take 8 SP without AI"
   - Team estimates: "With AI, we can do it in 3 SP"
   - Set **AI Story Points**: 8
   - Set **Story Points**: 3

2. **During Sprint:**
   - Complete the work
   - Update status to "Done"

3. **Sprint Review:**
   - Run `python3 main.py`
   - See: "Time Saved: 5 SP (62.5%)"
   - Present findings in generated PowerPoint

## Benefits

✅ **Quantify AI Impact**: Show measurable productivity gains  
✅ **ROI Calculation**: Demonstrate value of AI tools  
✅ **Team Motivation**: Showcase improvements  
✅ **Stakeholder Reporting**: Data-driven insights  
✅ **Continuous Improvement**: Track trends over time

## Next Steps

1. Create the custom field in Jira
2. Add field ID to `.env` file
3. Start populating fields in your next sprint
4. Generate reports to see the impact!

For detailed setup instructions, see `JIRA_AI_STORY_POINTS_SETUP.md`
