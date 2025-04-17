document.addEventListener('DOMContentLoaded', function() {
  // Get the current page path
  const currentPath = window.location.pathname;
  
  // Add team tabs to all pages
  const content = document.querySelector('.md-content__inner');
  if (content) {
    // Create team tabs
    const teamTabs = document.createElement('div');
    teamTabs.className = 'team-tabs';
    teamTabs.innerHTML = `
      <a href="./team.html#team-a" class="team-tab team-a">Team A</a>
      <a href="./team.html#team-b" class="team-tab team-b">Team B</a>
    `;
    
    // Create tool navigation
    const toolNav = document.createElement('div');
    toolNav.className = 'tool-nav';
    toolNav.innerHTML = `
      <div class="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </div>
      <a href="./tools.html#git-hub" class="tool-button tool-selected">Git-Hub</a>
      <a href="./tools.html#confluence" class="tool-button tool-unselected">Confluence</a>
      <a href="./tools.html#teams-kanal" class="tool-button tool-unselected">Teams-Kanal</a>
      <a href="./tools.html#sharepoint" class="tool-button tool-unselected">Sharepoint</a>
    `;
    
    // Insert after the first heading
    const firstHeading = content.querySelector('h1');
    if (firstHeading) {
      firstHeading.after(teamTabs);
      teamTabs.after(toolNav);
    }
    
    // Add background image to the main content
    const main = document.querySelector('.md-main');
    if (main) {
      // The background is already handled in CSS
    }
    
    // Highlight the current page in navigation
    if (currentPath.includes('tools.html')) {
      const toolButtons = document.querySelectorAll('.tool-button');
      toolButtons.forEach(button => {
        if (window.location.hash && button.getAttribute('href').includes(window.location.hash)) {
          button.classList.remove('tool-unselected');
          button.classList.add('tool-selected');
        } else {
          button.classList.remove('tool-selected');
          button.classList.add('tool-unselected');
        }
      });
    }
    
    // Handle back button click
    const backButton = document.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', function() {
        window.history.back();
      });
    }
  }
});
