document.addEventListener('DOMContentLoaded', function() {
    // Add scroll reveal effect to elements as they enter viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Apply to paragraphs, list items, and other elements
    document.querySelectorAll('.md-content p, .md-content li, .md-content h2, .md-content h3').forEach(el => {
        el.classList.add('reveal-element');
        observer.observe(el);
    });

    // Add progress tracking for onboarding page
    if (window.location.pathname.includes('onboarding')) {
        addProgressTracking();
    }

    // Add interactive tooltips to key terms
    addTooltips();
    
    // Add floating action button for navigation
    addFloatingActionButton();
    
    // Add code block enhancements
    enhanceCodeBlocks();
});

// Add completion checkboxes to steps in onboarding guide
function addProgressTracking() {
    const steps = document.querySelectorAll('.md-content h3');
    
    steps.forEach((step, index) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `step-${index}`;
        checkbox.className = 'step-checkbox';
        
        // Check if item is already completed in localStorage
        const isCompleted = localStorage.getItem(`step-${index}`) === 'true';
        checkbox.checked = isCompleted;
        
        checkbox.addEventListener('change', function() {
            localStorage.setItem(`step-${index}`, this.checked);
            
            // Update visual style
            if (this.checked) {
                step.classList.add('completed-step');
            } else {
                step.classList.remove('completed-step');
            }
            
            // Update progress indicator
            updateProgressIndicator();
        });
        
        if (isCompleted) {
            step.classList.add('completed-step');
        }
        
        step.prepend(checkbox);
    });
    
    // Add progress indicator at the top
    const content = document.querySelector('.md-content');
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <div class="progress-text">0% Complete</div>
    `;
    content.prepend(progressContainer);
    
    updateProgressIndicator();
}

function updateProgressIndicator() {
    const totalSteps = document.querySelectorAll('.step-checkbox').length;
    const completedSteps = document.querySelectorAll('.step-checkbox:checked').length;
    const percentage = Math.round((completedSteps / totalSteps) * 100);
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill && progressText) {
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% Complete`;
    }
}

// Add interactive tooltips to technical terms
function addTooltips() {
    const techTerms = {
        'GitHub': 'A web-based hosting service for version control using Git.',
        'Repository': 'A storage location for software packages.',
        'Git': 'A distributed version-control system for tracking changes in source code.',
        'Pull Request': 'A method of submitting contributions to a project.',
        'Branch': 'A parallel version of a repository.',
        'Commit': 'A recorded change to a repository.',
        'SSH Keys': 'A secure way to connect to GitHub without supplying your username and password each time.',
        'Environment Variables': 'Variables whose values are set outside the program, typically through the operating system.',
        'IDE': 'Integrated Development Environment - software for building applications.',
        'Code Review': 'Systematic examination of computer source code.'
    };
    
    const content = document.querySelector('.md-content');
    if (!content) return;
    
    Object.keys(techTerms).forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'g');
        content.innerHTML = content.innerHTML.replace(regex, `<span class="tooltip" data-tooltip="${techTerms[term]}">${term}</span>`);
    });
}

// Add floating action button for quick navigation
function addFloatingActionButton() {
    const fab = document.createElement('div');
    fab.className = 'floating-action-button';
    fab.innerHTML = `
        <button class="fab-main">+</button>
        <div class="fab-options">
            <button class="fab-option" data-action="top">↑</button>
            <button class="fab-option" data-action="home">🏠</button>
            <button class="fab-option" data-action="theme">🌓</button>
        </div>
    `;
    document.body.appendChild(fab);
    
    const fabMain = fab.querySelector('.fab-main');
    fabMain.addEventListener('click', () => {
        fab.classList.toggle('active');
    });
    
    const fabOptions = fab.querySelectorAll('.fab-option');
    fabOptions.forEach(option => {
        option.addEventListener('click', () => {
            const action = option.getAttribute('data-action');
            
            if (action === 'top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (action === 'home') {
                window.location.href = './index.html';
            } else if (action === 'theme') {
                document.body.classList.toggle('dark-theme');
                localStorage.setItem('dark-theme', document.body.classList.contains('dark-theme'));
            }
            
            fab.classList.remove('active');
        });
    });
    
    // Check for saved theme preference
    if (localStorage.getItem('dark-theme') === 'true') {
        document.body.classList.add('dark-theme');
    }
}

// Enhance code blocks with copy button and syntax highlighting
function enhanceCodeBlocks() {
    document.querySelectorAll('pre code').forEach(codeBlock => {
        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.textContent = 'Copy';
        
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            });
        });
        
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        codeBlock.parentNode.insertBefore(wrapper, codeBlock);
        wrapper.appendChild(codeBlock);
        wrapper.appendChild(copyButton);
    });
}

// Add CSS for the JavaScript-created elements
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .reveal-element {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s, transform 0.8s;
    }
    
    .reveal-element.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .step-checkbox {
        margin-right: 10px;
        width: 18px;
        height: 18px;
        cursor: pointer;
    }
    
    .completed-step {
        text-decoration: line-through;
        opacity: 0.7;
    }
    
    .progress-container {
        margin: 20px 0;
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        position: sticky;
        top: 0;
        z-index: 100;
        animation: slideInRight 1s;
    }
    
    .progress-bar {
        height: 10px;
        background-color: #e0e0e0;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 5px;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        width: 0;
        transition: width 0.5s ease;
    }
    
    .progress-text {
        font-size: 14px;
        text-align: center;
        font-weight: bold;
    }
    
    .tooltip {
        position: relative;
        border-bottom: 1px dotted #666;
        cursor: help;
        font-weight: 500;
        color: #2196f3;
    }
    
    .tooltip:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        white-space: nowrap;
        z-index: 10;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: fadeIn 0.3s;
    }
    
    .floating-action-button {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 200;
    }
    
    .fab-main {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: #2196f3;
        color: white;
        border: none;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        font-size: 24px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .fab-main:hover {
        background-color: #1976d2;
        transform: scale(1.05);
    }
    
    .fab-options {
        position: absolute;
        bottom: 70px;
        right: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s;
    }
    
    .floating-action-button.active .fab-options {
        opacity: 1;
        visibility: visible;
    }
    
    .fab-option {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-bottom: 10px;
        background-color: white;
        color: #333;
        border: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .fab-option:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    .code-block-wrapper {
        position: relative;
    }
    
    .copy-code-button {
        position: absolute;
        top: 5px;
        right: 5px;
        padding: 5px 10px;
        background-color: rgba(255,255,255,0.7);
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .copy-code-button:hover {
        background-color: rgba(255,255,255,0.9);
    }
    
    /* Dark theme */
    body.dark-theme {
        background-color: #1e1e1e;
        color: #e0e0e0;
    }
    
    body.dark-theme .progress-container {
        background-color: #2d2d2d;
    }
    
    body.dark-theme .tooltip:hover::after {
        background-color: #e0e0e0;
        color: #333;
    }
    
    body.dark-theme .copy-code-button {
        background-color: rgba(80,80,80,0.7);
        border-color: #555;
        color: #e0e0e0;
    }
`;
document.head.appendChild(additionalStyles);
