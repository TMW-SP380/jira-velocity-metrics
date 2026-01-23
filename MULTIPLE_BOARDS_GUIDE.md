# Generating Metrics for Multiple Boards

This guide shows you how to configure the app to generate metrics and PowerPoint reports for multiple Jira boards simultaneously.

## Quick Setup

### Step 1: Update Your .env File

Edit your `.env` file and update the `TEAMS` configuration:

**Single Board (Current):**
```env
TEAMS=ELECOM:58:ELECOM
```

**Multiple Boards (Updated):**
```env
TEAMS=ELECOM:58:ELECOM,Search and Nav:56:ELECOM
```

### Step 2: Format

The format is: `team_name:board_id:project_key`

- **Team Name**: Any name you want (e.g., "ELECOM", "Search and Nav")
- **Board ID**: The number from the Jira URL (after `/boards/`)
- **Project Key**: The project key (usually the same for boards in the same project)

**From your URLs:**
- Board 58: `https://tailored-prod.atlassian.net/jira/software/c/projects/ELECOM/boards/58`
  - Board ID: `58`
  - Project: `ELECOM`
  - Team Name: `ELECOM` (or any name you prefer)

- Board 56: `https://tailored-prod.atlassian.net/jira/software/c/projects/ELECOM/boards/56`
  - Board ID: `56`
  - Project: `ELECOM`
  - Team Name: `Search and Nav` (or any name you prefer)

### Step 3: Run the App

```bash
python3 main.py
```

## What Happens

The app will:

1. **Process Each Board Sequentially**
   ```
   Found 2 team(s) to process

   ============================================================
   Generating report for team: ELECOM
   Board ID: 58 | Project: ELECOM
   ============================================================
   [Metrics for Board 58...]
   ✓ Successfully generated report: reports/ELECOM_velocity_report_20260120_180213.pptx

   ============================================================
   Generating report for team: Search and Nav
   Board ID: 56 | Project: ELECOM
   ============================================================
   [Metrics for Board 56...]
   ✓ Successfully generated report: reports/Search and Nav_velocity_report_20260120_180214.pptx
   ```

2. **Generate Separate PowerPoint Files**
   - Each board gets its own PowerPoint report
   - Files are saved in the `reports/` folder
   - Filenames include team name and timestamp

3. **Show Summary**
   ```
   ============================================================
   Completed: 2/2 reports generated successfully
   ============================================================
   ```

## Example Configurations

### Two Boards (Your Case)
```env
TEAMS=ELECOM:58:ELECOM,Search and Nav:56:ELECOM
```

### Three or More Boards
```env
TEAMS=ELECOM:58:ELECOM,Search and Nav:56:ELECOM,Frontend:123:ELECOM,Backend:456:ELECOM
```

### Different Projects
```env
TEAMS=ELECOM:58:ELECOM,SearchNav:56:ELECOM,Frontend:100:FE,Backend:200:BE
```

## Important Notes

1. **Team Names**: Can contain spaces (e.g., "Search and Nav")
2. **Comma Separation**: Use commas to separate multiple teams
3. **No Spaces**: Don't add spaces around commas
4. **Same Project**: Multiple boards can share the same project key
5. **AI Labels**: Each board's issues will be analyzed independently for AI impact

## Output Files

After running, you'll find in the `reports/` folder:

```
reports/
  ├── ELECOM_velocity_report_20260120_180213.pptx
  ├── Search and Nav_velocity_report_20260120_180214.pptx
  └── ...
```

Each file contains:
- Current sprint metrics
- AI impact analysis (if labels are used)
- Velocity improvement charts
- Defect metrics
- Summary slides

## Troubleshooting

### "No teams configured" Error
- Check that `TEAMS=` line in `.env` is correct
- Make sure there are no extra spaces
- Verify the format: `name:board_id:project_key`

### "Board not found" Error
- Verify the board ID is correct
- Check that you have access to the board
- Ensure the project key matches

### Only One Report Generated
- Check the console output for errors
- Verify both boards have sprints
- Make sure both board IDs are correct

## Testing

Test your configuration:

```bash
# Check what teams are configured
python3 -c "from config import Config; teams = Config.get_teams(); print(f'Teams: {len(teams)}'); [print(f'  - {t[\"name\"]}: Board {t[\"board_id\"]}') for t in teams]"
```

This will show you all configured teams before running the full report.
