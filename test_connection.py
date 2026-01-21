"""Test Jira connection and configuration"""
import sys
from jira_client import JiraClient
import config


def test_connection():
    """Test Jira API connection"""
    print("="*60)
    print("Testing Jira Connection")
    print("="*60)
    
    # Validate config
    if not config.Config.validate():
        print("\n✗ Configuration invalid. Please check your .env file.")
        return False
    
    print(f"\n✓ Configuration loaded")
    print(f"  Server: {config.Config.JIRA_SERVER}")
    print(f"  Email: {config.Config.JIRA_EMAIL}")
    print(f"  AI Adoption Date: {config.Config.AI_ADOPTION_DATE}")
    
    # Test connection
    try:
        print("\nConnecting to Jira...")
        jira_client = JiraClient()
        print("✓ Connected successfully!")
        
        # Test teams
        teams = config.Config.get_teams()
        print(f"\nFound {len(teams)} team(s):")
        
        for team in teams:
            print(f"\n  Team: {team['name']}")
            print(f"    Board ID: {team['board_id']}")
            print(f"    Project: {team['project_key']}")
            
            # Try to get board info
            try:
                board = jira_client.jira.board(int(team['board_id']))
                print(f"    ✓ Board accessible: {board.name}")
                
                # Try to get sprints
                sprints = jira_client.jira.sprints(int(team['board_id']), state='active')
                if sprints:
                    print(f"    ✓ Active sprint found: {sprints[0].name}")
                else:
                    closed_sprints = jira_client.jira.sprints(int(team['board_id']), state='closed')
                    if closed_sprints:
                        print(f"    ⚠ No active sprint, but {len(closed_sprints)} closed sprint(s) found")
                    else:
                        print(f"    ⚠ No sprints found for this board")
                        
            except Exception as e:
                print(f"    ✗ Error accessing board: {str(e)}")
        
        print("\n" + "="*60)
        print("✓ Connection test completed successfully!")
        print("="*60)
        return True
        
    except Exception as e:
        print(f"\n✗ Connection failed: {str(e)}")
        print("\nTroubleshooting:")
        print("1. Verify your JIRA_API_TOKEN is correct")
        print("2. Check that your email matches your Jira account")
        print("3. Ensure you have access to the specified boards")
        return False


if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
