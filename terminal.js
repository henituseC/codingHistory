/* =========================================================================
                                  DATABASE
   ========================================================================= */

const db = {
    // Core Base Pages Folder Destination (/pages/)
    aboutsite:            '/pages/about_site.txt',
    links:                '/pages/links.txt',
    
    precolonization:      '/history/pre_colonization.txt',
    spanishoccupation:    '/history/spanish_occupation.txt',
    americanoccupation:   '/history/american_occupation.txt',
    japaneseoccupation:   '/history/japanese_occupation.txt',
    postcolonization:     '/history/post_colonization.txt',
    
    literature:           '/pages/literature.txt',
    movies:               '/pages/movies.txt',
    videos:               '/pages/videos.txt'
    
};



/* =========================================================================
                              COMMANDS STUFF
   ========================================================================= */

const textBlocks = {
    help: `
    <span class="c-cmd">about</span>                  <span class="c-desc">Prints available commands under 'About'.</span>
    <span class="c-cmd">history</span>                <span class="c-desc">Opens the Philippine history module directory.</span>
    <span class="c-cmd">media</span>                  <span class="c-desc">Prints available educational media categories.</span>
    <span class="c-cmd">help</span>                   <span class="c-desc">Prints this command list.</span>
    <span class="c-cmd">clear</span>                  <span class="c-desc">Clears the terminal.</span>\n`,

    about: `
    <span class="c-cmd">aboutSite</span>              <span class="c-desc">About this site, its purpose, and the team behind it.</span>
    <span class="c-cmd">links</span>                  <span class="c-desc">External resources and project links.</span>\n`,

    history: `
    <span class="c-cmd">preColonization</span>        <span class="c-desc">The Philippines before Spanish colonization.</span>
    <span class="c-cmd">spanishOccupation</span>      <span class="c-desc">The Philippines under Spanish colonial rule.</span>
    <span class="c-cmd">americanOccupation</span>     <span class="c-desc">The Philippines under American colonial rule.</span>
    <span class="c-cmd">japaneseOccupation</span>     <span class="c-desc">The Philippines during the Japanese occupation.</span>
    <span class="c-cmd">postColonization</span>       <span class="c-desc">The Philippines after colonial rule.</span>\n`,
    
    media: `
    <span class="c-cmd">literature</span>             <span class="c-desc">Literary works related to Philippine history.</span>
    <span class="c-cmd">movies</span>                 <span class="c-desc">Films related to Philippine history and society.</span>
    <span class="c-cmd">videos</span>                 <span class="c-desc">Documentaries and educational videos.</span>\n`
};


let currentContext = 'main';
let currentView = null;
let parentPage = null;

const parentMap = {
    aboutsite: 'about',

    precolonization: 'history',
    spanishoccupation: 'history',
    americanoccupation: 'history',
    japaneseoccupation: 'history',
    postcolonization: 'history',

    literature: 'media',
    movies: 'media',
    videos: 'media'
};

let historyStack = [];  

function pushHistory(page) {
    historyStack.push(page);
}

function peekHistory() {
    return historyStack[historyStack.length - 1];
}

function popHistory() {
    return historyStack.pop();
}


// Navigation arrays to group child pages with their right parent directory
const historySubPages = [
    'precolonization',
    'spanishoccupation',
    'americanoccupation',
    'japaneseoccupation',
    'postcolonization'
];

const mediaSubPages = [
    'literature',
    'movies',
    'videos'
];

const hubPages = [
    'blog',
    'characters',
    'media'
];

const childPages = [
    'blog_post1',
    'blog_post2',
    'altair',
    'icarus',
    'manager',
    'books',
    'movies',
    'tv',
    'games',
    'videos',
    'music'
];

const input = document.getElementById('user-input');
const history = document.getElementById('history');
const mainPanel = document.getElementById('main-panel');



/* =========================================================================
                              WINDOW POP-UPS
   ========================================================================= */

async function openView(fileKey) {

    const safeKey = fileKey.toLowerCase();

    // Inline menus
    if (textBlocks[safeKey]) {

        const inlineWrapper = document.createElement('div');

        inlineWrapper.innerHTML = textBlocks[safeKey];

        history.appendChild(inlineWrapper);

        input.value = '';

        return;
    }

    const filePath = db[safeKey];

    if (!filePath) {
        history.innerHTML += `
            <span style="color:#ff3333">
                [ERROR] Unknown command: ${fileKey}
            </span>
        `;

        input.value = '';

        return;
    }

    // Record current page and parent
    currentView = safeKey;
    parentPage = parentMap[safeKey] || 'main';

    currentContext = 'display';

    document.getElementById('terminal-view').style.display = 'none';
    document.getElementById('content-view').style.display = 'block';

    const title = document.getElementById('content-title');
    const body = document.getElementById('content-body');

    title.innerText = `display / ${safeKey}`;

    body.innerHTML = `
        <span class="c-desc">
            Accessing directory core network... Processing data.
        </span>
    `;

    try {

        const response = await fetch(
            `${filePath}?v=${Date.now()}`
        );

        if (!response.ok) {
            throw new Error();
        }

        const text = await response.text();

        body.innerHTML = text;

    } catch (e) {

        body.innerHTML = `
            <span style="color:#ff3333">
                [CRITICAL READ FAULT]
                Could not resolve data from target file path:
                ${filePath}
            </span>
        `;
    }
}



/* =========================================================================
                              EXIT BUTTON
   ========================================================================= */

function closeView() {

  popHistory();
  const previous = peekHistory();
  
  if (!previous) {
    historyStack = [];
    currentContext = 'main';
  
    document.getElementById('content-view').style.display = 'none';
    document.getElementById('terminal-view').style.display = 'block';
  
    input.value = '';
    input.focus();
  
    return;
  }
  
    openView(previous, false);
}



/* =========================================================================
          PLEASE JUST DONT TOUCH THIS OR ELSE EVERYTHING WILL BREAK
   ========================================================================= */

document.addEventListener('click', () => {
  if (currentContext === 'main') input.focus();
});

input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const raw = input.value.trim();
    const cmd = raw.toLowerCase();
        
    history.innerHTML += '\n<span class="c-sys">guest@bnnuy.neocities:~$</span> <span class="c-cmd">' + raw + '</span>';
        
    if (db[cmd] || textBlocks[cmd]) {
      openView(cmd);
      input.value = '';
      return;
    }

    let output = '';
    
    switch(cmd) {
      case '': 
        input.value = ''; 
        return;
      case 'clear':
        history.innerHTML = '';
        input.value = '';
        return;
      default:
        output = `
        <span style="color:#ff3333">
        Command execution fault. Input reference code '${cmd}' unrecognized.
        </span>\n`;
    }
        
    if (output) history.innerHTML += output;
      input.value = '';
      mainPanel.scrollTo(0, mainPanel.scrollHeight);
  }
});



















