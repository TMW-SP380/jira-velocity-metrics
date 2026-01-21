"""Main script to generate velocity metrics PPT"""
import os
import sys
from datetime import datetime
from jira_client import JiraClient
from metrics_calculator import MetricsCalculator
from ppt_generator import PPTGenerator
import config


def generate_report_for_team(team_config: dict):
    """Generate report for a specific team"""
    team_name = team_config['name']
    board_id = team_config['board_id']
    project_key = team_config['project_key']
    
    print(f"\n{'='*60}")
    print(f"Generating report for team: {team_name}")
    print(f"Board ID: {board_id} | Project: {project_key}")
    print(f"{'='*60}\n")
    
    try:
        # Initialize clients
        jira_client = JiraClient()
        calculator = MetricsCalculator(config.Config.AI_ADOPTION_DATE)
        ppt_generator = PPTGenerator()
        
        # Get current sprint
        print("Fetching current sprint...")
        current_sprint = jira_client.get_current_sprint(board_id)
        
        if not current_sprint:
            print(f"WARNING: No active sprint found for board {board_id}")
            print("Attempting to use most recent sprint...")
            historical = jira_client.get_historical_sprints(board_id, limit=1)
            if historical:
                current_sprint = historical[0]
            else:
                print(f"ERROR: No sprints found for board {board_id}")
                return False
        
        print(f"Current Sprint: {current_sprint.get('name', 'Unknown')}")
        
        # Get historical sprints for comparison
        print("Fetching historical sprints...")
        historical_sprints = jira_client.get_historical_sprints(board_id, limit=20)
        print(f"Found {len(historical_sprints)} historical sprints")
        
        # Calculate metrics
        print("Calculating metrics...")
        comprehensive_metrics = calculator.generate_comprehensive_metrics(
            current_sprint,
            historical_sprints
        )
        
        # Display metrics summary
        print("\n" + "="*60)
        print("METRICS SUMMARY")
        print("="*60)
        current = comprehensive_metrics.get('current_sprint', {})
        improvement = comprehensive_metrics.get('velocity_improvement', {})
        defects = comprehensive_metrics.get('defect_metrics', {})
        
        print(f"\nCurrent Sprint:")
        print(f"  - Story Points Committed: {current.get('committed_story_points', 0)}")
        print(f"  - Story Points Completed: {current.get('completed_story_points', 0)}")
        print(f"  - Completion Rate: {current.get('completion_rate', 0)}%")
        print(f"  - Defects: {current.get('defect_count', 0)}")
        
        # Display AI Story Points metrics if available
        if current.get('has_ai_data', False):
            print(f"\nAI Impact Analysis:")
            print(f"  - AI Story Points (without AI): {current.get('ai_story_points_committed', 0)} SP")
            print(f"  - Actual Story Points (with AI): {current.get('committed_story_points', 0)} SP")
            print(f"  - Time Saved: {current.get('time_saved_total', 0)} SP ({current.get('time_saved_percent', 0)}%)")
            print(f"  - Time Saved (Completed): {current.get('time_saved_completed', 0)} SP")
        
        print(f"\nVelocity Improvement:")
        print(f"  - Baseline Velocity: {improvement.get('baseline_velocity', 0)} SP")
        print(f"  - Post-AI Velocity: {improvement.get('post_ai_velocity', 0)} SP")
        print(f"  - Improvement: {improvement.get('improvement_percent', 0)}%")
        
        print(f"\nDefect Metrics:")
        print(f"  - Baseline Avg Defects: {defects.get('baseline_avg_defects', 0)}")
        print(f"  - Post-AI Avg Defects: {defects.get('post_ai_avg_defects', 0)}")
        print(f"  - Defect Reduction: {defects.get('defect_reduction_percent', 0)}%")
        print("="*60 + "\n")
        
        # Generate PowerPoint
        print("Generating PowerPoint presentation...")
        os.makedirs('reports', exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = f"reports/{team_name}_velocity_report_{timestamp}.pptx"
        
        ppt_generator.generate_presentation(team_name, comprehensive_metrics, output_file)
        
        print(f"\n✓ Successfully generated report: {output_file}")
        return True
        
    except Exception as e:
        print(f"\n✗ Error generating report for {team_name}: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Main entry point"""
    print("="*60)
    print("Jira Velocity Metrics Generator")
    print("="*60)
    
    # Validate configuration
    if not config.Config.validate():
        print("\nPlease create a .env file based on .env.example")
        print("You can get your Jira API token from:")
        print("https://id.atlassian.com/manage-profile/security/api-tokens")
        sys.exit(1)
    
    # Get teams
    teams = config.Config.get_teams()
    
    if not teams:
        print("\nERROR: No teams configured. Please set TEAMS in .env file")
        print("Format: TEAMS=TeamName:BoardID:ProjectKey")
        sys.exit(1)
    
    print(f"\nFound {len(teams)} team(s) to process\n")
    
    # Generate reports for each team
    success_count = 0
    for team in teams:
        if generate_report_for_team(team):
            success_count += 1
    
    print("\n" + "="*60)
    print(f"Completed: {success_count}/{len(teams)} reports generated successfully")
    print("="*60)


if __name__ == "__main__":
    main()
