"""Confluence API client for uploading reports to wiki pages"""
import os
import requests
from typing import Optional, List, Dict
import config


class ConfluenceUploader:
    """Client for uploading files to Confluence"""
    
    def __init__(self):
        """Initialize Confluence client"""
        self.server = os.getenv('CONFLUENCE_SERVER', config.Config.JIRA_SERVER)
        self.email = os.getenv('CONFLUENCE_EMAIL', config.Config.JIRA_EMAIL)
        self.api_token = os.getenv('CONFLUENCE_API_TOKEN', config.Config.JIRA_API_TOKEN)
        self.page_id = os.getenv('CONFLUENCE_PAGE_ID', '')
        self.space_key = os.getenv('CONFLUENCE_SPACE_KEY', '')
        
        if not self.email or not self.api_token:
            raise ValueError("CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN must be set")
        
        self.auth = (self.email, self.api_token)
        self.base_url = f"{self.server}/wiki/rest/api"
    
    def upload_attachment(self, file_path: str, page_id: Optional[str] = None, comment: str = "") -> bool:
        """Upload a file as attachment to a Confluence page"""
        if not os.path.exists(file_path):
            print(f"Error: File not found: {file_path}")
            return False
        
        page_id = page_id or self.page_id
        if not page_id:
            print("Error: CONFLUENCE_PAGE_ID must be set")
            return False
        
        try:
            # Step 1: Check if page exists and get its status
            page_url = f"{self.base_url}/content/{page_id}?expand=version,status"
            page_response = requests.get(page_url, auth=self.auth)
            
            if page_response.status_code == 404:
                print(f"✗ Error: Page {page_id} not found. Please check CONFLUENCE_PAGE_ID")
                return False
            
            if page_response.status_code != 200:
                print(f"✗ Error accessing page: {page_response.status_code} - {page_response.text}")
                return False
            
            page_data = page_response.json()
            page_status = page_data.get('status', 'current')
            
            # Step 2: Handle draft pages - need to publish first or use draft endpoint
            if page_status == 'draft':
                print(f"⚠ Warning: Page is in draft status. Publishing page first...")
                # Try to publish the draft
                try:
                    version = page_data.get('version', {}).get('number', 1)
                    publish_url = f"{self.base_url}/content/{page_id}"
                    publish_payload = {
                        'version': {'number': version},
                        'status': 'current'
                    }
                    publish_response = requests.put(publish_url, auth=self.auth, json=publish_payload, 
                                                   headers={'Content-Type': 'application/json'})
                    if publish_response.status_code == 200:
                        print(f"✓ Page published successfully")
                    else:
                        print(f"⚠ Could not auto-publish page. Please publish manually in Confluence.")
                        print(f"  Then run the upload again, or upload manually.")
                        return False
                except Exception as e:
                    print(f"⚠ Could not publish page automatically: {str(e)}")
                    print(f"  Please publish the page manually in Confluence, then try again.")
                    return False
            
            # Step 3: Get attachment endpoint
            url = f"{self.base_url}/content/{page_id}/child/attachment"
            
            # Step 4: Check if file already exists
            file_name = os.path.basename(file_path)
            params = {'filename': file_name}
            response = requests.get(url, auth=self.auth, params=params)
            
            # Step 5: Upload file
            headers = {
                'X-Atlassian-Token': 'no-check'  # Required for file uploads
            }
            
            with open(file_path, 'rb') as file:
                files = {
                    'file': (file_name, file, 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
                }
                data = {}
                if comment:
                    data['comment'] = comment
                
                # If attachment exists, update it; otherwise create new
                if response.status_code == 200 and response.json().get('results'):
                    # Update existing attachment
                    attachment_id = response.json()['results'][0]['id']
                    update_url = f"{self.base_url}/content/{page_id}/child/attachment/{attachment_id}/data"
                    response = requests.post(update_url, auth=self.auth, headers=headers, files=files, data=data)
                else:
                    # Create new attachment
                    response = requests.post(url, auth=self.auth, headers=headers, files=files, data=data)
            
            if response.status_code in [200, 201]:
                print(f"✓ Successfully uploaded: {file_name}")
                return True
            else:
                print(f"✗ Failed to upload {file_name}: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"✗ Error uploading {file_path}: {str(e)}")
            return False
    
    def list_attachments(self, page_id: Optional[str] = None) -> List[Dict]:
        """List all attachments on a page"""
        page_id = page_id or self.page_id
        if not page_id:
            return []
        
        try:
            url = f"{self.base_url}/content/{page_id}/child/attachment"
            response = requests.get(url, auth=self.auth)
            
            if response.status_code == 200:
                data = response.json()
                return data.get('results', [])
            return []
        except Exception as e:
            print(f"Error listing attachments: {str(e)}")
            return []
    
    def add_page_content(self, content: str, page_id: Optional[str] = None) -> bool:
        """Add content to a Confluence page"""
        page_id = page_id or self.page_id
        if not page_id:
            print("Error: CONFLUENCE_PAGE_ID must be set")
            return False
        
        try:
            # Get current page version
            url = f"{self.base_url}/content/{page_id}?expand=version,body.storage"
            response = requests.get(url, auth=self.auth)
            
            if response.status_code != 200:
                print(f"Error: Could not fetch page: {response.status_code}")
                return False
            
            page_data = response.json()
            version = page_data['version']['number']
            
            # Get existing content
            existing_content = ""
            if 'body' in page_data and 'storage' in page_data['body']:
                existing_content = page_data['body']['storage'].get('value', '')
            
            # Append new content if existing content doesn't already include it
            if content not in existing_content:
                if existing_content.strip():
                    new_content = existing_content + "\n\n" + content
                else:
                    new_content = content
            else:
                new_content = existing_content  # Content already exists, don't duplicate
            
            # Update page with new content
            update_url = f"{self.base_url}/content/{page_id}"
            payload = {
                'version': {'number': version + 1},
                'type': 'page',
                'title': page_data['title'],
                'body': {
                    'storage': {
                        'value': new_content,
                        'representation': 'storage'
                    }
                }
            }
            
            response = requests.put(update_url, auth=self.auth, json=payload, headers={'Content-Type': 'application/json'})
            
            if response.status_code == 200:
                print(f"✓ Successfully updated page content")
                return True
            else:
                print(f"✗ Failed to update page: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"✗ Error updating page: {str(e)}")
            return False
    
    def add_attachments_to_page_content(self, page_id: Optional[str] = None) -> bool:
        """Add attachment links to page content so they're visible"""
        page_id = page_id or self.page_id
        if not page_id:
            print("Error: CONFLUENCE_PAGE_ID must be set")
            return False
        
        try:
            # Get all attachments
            attachments = self.list_attachments(page_id)
            
            if not attachments:
                print("No attachments found to add to page content")
                return False
            
            # Get current page to check existing content
            url = f"{self.base_url}/content/{page_id}?expand=version,body.storage"
            response = requests.get(url, auth=self.auth)
            
            if response.status_code != 200:
                print(f"Error: Could not fetch page: {response.status_code}")
                return False
            
            page_data = response.json()
            existing_content = ""
            if 'body' in page_data and 'storage' in page_data['body']:
                existing_content = page_data['body']['storage'].get('value', '')
            
            # Check if attachments section already exists
            if 'Sprint Velocity Reports' in existing_content or 'Velocity Reports' in existing_content:
                print("Attachments section already exists in page content")
                return True
            
            # Filter PPTX files and sort by date (newest first)
            from datetime import datetime
            pptx_attachments = [a for a in attachments if a.get('title', '').endswith('.pptx')]
            pptx_attachments.sort(key=lambda x: x.get('version', {}).get('when', ''), reverse=True)
            
            if not pptx_attachments:
                print("No PowerPoint attachments found")
                return False
            
            # Build Confluence storage format content (XML-based)
            # Using Confluence storage format with attachment macro
            new_content = f'''<h2>Sprint Velocity Reports</h2>
<p>The following reports have been uploaded:</p>
<ac:structured-macro ac:name="attachments" ac:schema-version="1" ac:macro-id="attachments-macro">
<ac:parameter ac:name="old">false</ac:parameter>
</ac:structured-macro>
<p><strong>Latest Reports:</strong></p>
<ul>'''
            
            for att in pptx_attachments[:10]:  # Show latest 10
                att_title = att.get('title', 'Unknown')
                
                # Extract date from filename if possible (format: TEAM_velocity_report_YYYYMMDD_HHMMSS.pptx)
                date_str = "Recent"
                try:
                    parts = att_title.replace('.pptx', '').split('_')
                    if len(parts) >= 4:
                        date_part = parts[-2]  # YYYYMMDD
                        if len(date_part) == 8:
                            date_obj = datetime.strptime(date_part, '%Y%m%d')
                            date_str = date_obj.strftime('%B %d, %Y')
                except:
                    pass
                
                # Use Confluence attachment link format
                new_content += f'\n<li><ac:link><ri:attachment ri:filename="{att_title}"/></ac:link> - {date_str}</li>'
            
            new_content += '\n</ul>'
            
            # Append to existing content
            if existing_content.strip():
                final_content = existing_content + "\n\n" + new_content
            else:
                final_content = new_content
            
            # Update page
            version = page_data['version']['number']
            update_url = f"{self.base_url}/content/{page_id}"
            payload = {
                'version': {'number': version + 1},
                'type': 'page',
                'title': page_data['title'],
                'body': {
                    'storage': {
                        'value': final_content,
                        'representation': 'storage'
                    }
                }
            }
            
            response = requests.put(update_url, auth=self.auth, json=payload, 
                                  headers={'Content-Type': 'application/json'})
            
            if response.status_code == 200:
                print(f"✓ Successfully added attachment links to page content")
                print(f"  View your page to see the reports!")
                return True
            else:
                print(f"✗ Failed to update page content: {response.status_code}")
                print(f"  Response: {response.text[:200]}")
                print(f"  Note: Attachments are still uploaded, check the attachments panel (click '...' → 'View attachments')")
                return False
                
        except Exception as e:
            print(f"✗ Error adding attachments to page: {str(e)}")
            print(f"  Note: Attachments are still uploaded, check the attachments panel")
            import traceback
            traceback.print_exc()
            return False


def upload_latest_reports(page_id: str = None, space_key: str = None):
    """Upload the latest generated reports to Confluence"""
    try:
        uploader = ConfluenceUploader()
        
        if page_id:
            uploader.page_id = page_id
        if space_key:
            uploader.space_key = space_key
        
        # Find latest reports
        reports_dir = 'reports'
        if not os.path.exists(reports_dir):
            print(f"Error: Reports directory not found: {reports_dir}")
            return
        
        # Get all .pptx files, sorted by modification time (newest first)
        pptx_files = [
            os.path.join(reports_dir, f) 
            for f in os.listdir(reports_dir) 
            if f.endswith('.pptx') and not f.startswith('~$')
        ]
        
        if not pptx_files:
            print("No PowerPoint reports found to upload")
            return
        
        # Sort by modification time (newest first)
        pptx_files.sort(key=lambda x: os.path.getmtime(x), reverse=True)
        
        print(f"\n{'='*60}")
        print("Uploading Reports to Confluence")
        print(f"{'='*60}\n")
        
        # Upload each file
        success_count = 0
        for file_path in pptx_files:
            file_name = os.path.basename(file_path)
            comment = f"Velocity metrics report - {file_name}"
            
            if uploader.upload_attachment(file_path, comment=comment):
                success_count += 1
        
        print(f"\n{'='*60}")
        print(f"Uploaded: {success_count}/{len(pptx_files)} reports")
        print(f"{'='*60}\n")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        print("\nMake sure CONFLUENCE_PAGE_ID is set in your .env file")


if __name__ == "__main__":
    import sys
    
    # Allow page ID to be passed as argument
    page_id = sys.argv[1] if len(sys.argv) > 1 else None
    
    upload_latest_reports(page_id=page_id)
