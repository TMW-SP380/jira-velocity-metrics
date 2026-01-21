# Labels-Based AI Story Points - Update Summary

## What Changed

The app now supports tracking AI story points using **Jira Labels** instead of requiring a custom field. This means you can start tracking AI impact **immediately** without admin rights!

## How It Works

### Label Format
Add labels to your issues in this format:
- `AI1` = 1 story point saved
- `AI2` = 2 story points saved
- `AI3` = 3 story points saved
- `AI5` = 5 story points saved
- etc.

### Calculation Logic
- **Actual Story Points**: The story points field value (work done with AI)
- **AI Points Saved**: Extracted from label (e.g., AI3 = 3 points)
- **AI Story Points** (estimated without AI): `Actual SP + Points from Label`
- **Time Saved**: Points from the label

### Example
- Issue has **Story Points: 2**
- Issue has **Label: AI3**
- **Result:**
  - Actual: 2 SP
  - Estimated (without AI): 5 SP (2 + 3)
  - Time Saved: 3 SP (60%)

## Files Updated

1. **jira_client.py**
   - Added `_extract_ai_points_from_labels()` method
   - Updated `_get_ai_story_points()` to use labels as fallback
   - Updated issue processing to extract AI points from labels

2. **Documentation**
   - Created `AI_STORY_POINTS_LABELS_GUIDE.md` - Complete guide for labels approach
   - Updated `README.md` - Added labels option to main documentation

## No Configuration Needed!

Unlike the custom field approach, **you don't need to configure anything**. Just:
1. Add labels to your issues (`AI1`, `AI2`, etc.)
2. Run `python3 main.py`
3. See the AI impact metrics!

## Priority Order

The app checks in this order:
1. **Custom Field** (if `AI_STORY_POINTS_FIELD_ID` is set in .env)
2. **Labels** (AI1, AI2, AI3, etc.) - **NEW!**
3. **None** (if neither is available)

## Testing

The label extraction has been tested and works correctly:
- ✅ `AI1` → 1 point
- ✅ `ai2` → 2 points (case-insensitive)
- ✅ `AI10` → 10 points
- ✅ `AI-saved` → None (invalid format)
- ✅ No labels → None

## Next Steps

1. **Start adding labels** to your issues:
   - Open any issue
   - Add label: `AI1`, `AI2`, `AI3`, etc.
   - Save

2. **Run the app**:
   ```bash
   python3 main.py
   ```

3. **See the results**:
   - Console will show AI impact metrics
   - PowerPoint will include "AI Impact" slide

## Benefits

✅ **No Admin Rights** - Anyone can add labels  
✅ **Instant Setup** - No configuration needed  
✅ **Flexible** - Easy to adjust  
✅ **Visible** - Labels show in issue lists  
✅ **Simple** - Just `AI` + number  

## Support

- See `AI_STORY_POINTS_LABELS_GUIDE.md` for detailed usage
- See `JIRA_AI_STORY_POINTS_SETUP.md` for custom field approach (if you get admin rights later)
