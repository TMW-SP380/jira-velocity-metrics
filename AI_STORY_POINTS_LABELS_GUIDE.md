# AI Story Points Using Labels - Setup Guide

## Overview

This approach uses **Jira Labels** to track AI story points saved, eliminating the need for admin rights to create custom fields. Simply add labels like `AI1`, `AI2`, `AI3` to indicate how many story points were saved with AI assistance.

## How It Works

### Label Format
- **AI1** = 1 story point saved
- **AI2** = 2 story points saved  
- **AI3** = 3 story points saved
- **AI5** = 5 story points saved
- And so on...

### Calculation
- **Story Points** (actual): The actual story points for the work done with AI
- **AI Story Points** (estimated): `Story Points + Points from Label`
- **Time Saved**: Points from the label (e.g., AI3 = 3 points saved)

## Usage Example

### Example Issue

**Issue:** "Implement Email Notifications"

1. **Set Story Points:** 2 (actual work with AI)
2. **Add Label:** `AI3` (3 points saved with AI)
3. **Result:**
   - Actual Story Points: 2 SP
   - AI Story Points (without AI): 5 SP (2 + 3)
   - Time Saved: 3 SP (60% reduction)

### During Sprint Planning

1. Estimate how long the work would take **without AI** (e.g., 8 SP)
2. Estimate how long it will take **with AI** (e.g., 3 SP)
3. Set **Story Points**: 3
4. Add **Label**: `AI5` (because 8 - 3 = 5 points saved)

### During Sprint Execution

1. Complete the work
2. Update status to "Done"
3. Keep the label as-is (it represents the savings)

## Step-by-Step Instructions

### 1. Add Labels to Issues

1. Open any issue in Jira
2. In the **Details** panel (right sidebar), find **"Labels"**
3. Click **"Labels"** or the **"+"** button
4. Type `AI1`, `AI2`, `AI3`, etc. (based on points saved)
5. Press Enter to add
6. Save the issue

### 2. No Configuration Needed!

Unlike the custom field approach, **no .env configuration is required**. The app automatically:
- Scans all labels on issues
- Finds labels starting with "AI" followed by a number
- Calculates AI story points automatically

### 3. Run the App

Simply run:
```bash
python3 main.py
```

The app will automatically:
- Extract AI points from labels
- Calculate time saved
- Generate reports with AI impact metrics

## Label Examples

| Actual SP | Label | AI SP (Estimated) | Time Saved |
|-----------|-------|-------------------|------------|
| 2 | AI1 | 3 | 1 SP (33%) |
| 3 | AI2 | 5 | 2 SP (40%) |
| 5 | AI3 | 8 | 3 SP (38%) |
| 2 | AI5 | 7 | 5 SP (71%) |
| 8 | AI10 | 18 | 10 SP (56%) |

## Best Practices

### ✅ Do:
- Use consistent label format: `AI` + number
- Be honest with estimates (both actual SP and label)
- Add labels during sprint planning
- Use whole numbers (AI1, AI2, not AI1.5)

### ❌ Don't:
- Use labels like "AI-saved" or "AI-help" (must be AI + number)
- Use decimal numbers in labels (use whole numbers)
- Change labels after work is done (unless correcting an error)

## How Labels Are Parsed

The app looks for labels that:
1. Start with "AI" (case-insensitive)
2. Are followed by a number
3. Examples that work: `AI1`, `ai2`, `AI10`, `ai5`
4. Examples that don't work: `AI-saved`, `ai-help`, `saved-AI`

## Reports Generated

### Console Output
```
AI Impact Analysis:
  - AI Story Points (without AI): 55.0 SP
  - Actual Story Points (with AI): 30.0 SP
  - Time Saved: 25.0 SP (45.45%)
  - Time Saved (Completed): 15.0 SP
```

### PowerPoint Slide
- "AI Impact: Time Saved Analysis" slide
- Visual comparison chart
- Time saved metrics

## Troubleshooting

### Labels Not Being Detected
- Ensure labels start with "AI" followed by a number
- Check that labels are actually saved on the issue
- Verify the issue is in the sprint being analyzed

### Zero Time Saved Showing
- Make sure issues have both Story Points AND AI labels
- Check label format: must be `AI` + number (e.g., `AI3`)
- Verify labels are saved on the issues

### Multiple AI Labels
- If an issue has multiple AI labels (e.g., `AI1` and `AI2`), the app uses the **first one found**
- Best practice: use only one AI label per issue

## Comparison: Labels vs Custom Field

| Feature | Labels Approach | Custom Field Approach |
|---------|----------------|----------------------|
| Admin Rights Required | ❌ No | ✅ Yes |
| Setup Time | ⚡ Instant | 🕐 5-10 minutes |
| Flexibility | ✅ Easy to add/remove | ⚠️ Requires field config |
| Visibility | ✅ Visible in issue list | ✅ Visible in details |
| Best For | Quick start, no admin | Long-term, structured |

## Migration Path

If you later get admin rights and want to use a custom field:
1. The app supports both approaches
2. Custom field takes priority if configured
3. Labels are used as fallback
4. You can migrate gradually

## Example Workflow

### Sprint Planning Session

**Team estimates:**
- "This feature would take 8 SP without AI"
- "With AI, we can do it in 3 SP"
- "So we save 5 SP"

**Action:**
1. Set **Story Points**: 3
2. Add **Label**: `AI5`
3. Done! ✅

### Sprint Review

**Run the app:**
```bash
python3 main.py
```

**See results:**
- Actual: 3 SP
- Estimated (without AI): 8 SP
- Time Saved: 5 SP (62.5%)

## Benefits

✅ **No Admin Rights Needed** - Anyone can add labels  
✅ **Quick Setup** - Start tracking immediately  
✅ **Flexible** - Easy to adjust as you learn  
✅ **Visible** - Labels show in issue lists  
✅ **Simple** - Just add `AI` + number  

## Next Steps

1. Start adding `AI` labels to your issues
2. Use format: `AI1`, `AI2`, `AI3`, etc.
3. Run `python3 main.py` to see the impact!

No configuration needed - just start labeling! 🚀
