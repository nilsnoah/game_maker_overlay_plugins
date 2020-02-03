vueScript = document.createElement('script')
vueScript.src = 'https://unpkg.com/vue@2.4.2';
componentScript = document.createElement('script')
componentScript.src = '../../overlay/dist/developer-overlay.js'

window.$overlay = {};
window.$overlay.containers = [];

let createOverlay = () => {
    if (window.componentLoaded) {
        if (!window.$overlay.element) {
            window.$overlay.containers.push({
                name: 'default',
                style: {
                    top: 0,
                    left: 0,
                    minWidth: '100px',
                    minHeight: '100px'
                },
                tabs: {
                    'Actors': {
                        components: [
                            {
                                name: 'database-list',
                                data: {
                                    head: ['id', 'name'],
                                    items: window.$dataActors ? window.$dataActors.slice(1) : []
                                }
                            }
                        ]
                    },
                    'Classes': {
                        components: [
                            {
                                name: 'database-list',
                                data: {
                                    head: window.$dataClasses ? Object.keys(window.$dataClasses[1]) : [],
                                    items: window.$dataClasses ? window.$dataClasses.slice(1) : []
                                }
                            }
                        ]
                    }
                }
            });
            window.$overlay.containers.push({
                name: 'default',
                style: {
                    top: 0,
                    left: 0,
                    minWidth: '100px',
                    minHeight: '100px'
                },
                tabs: {
                    'Tile Selector': {
                        components: [
                            {
                                name: 'tile-selector',
                                data: {
                                    createContainer: {
                                        name: 'default',
                                        style: {
                                            top: 0,
                                            left: 0,
                                            minWidth: '100px',
                                            minHeight: '100px'
                                        },
                                        tabs: {
                                            'Actors': {
                                                components: [
                                                    {
                                                        name: 'database-list',
                                                        data: {
                                                            head: ['id', 'name'],
                                                            items: window.$dataActors ? window.$dataActors.slice(1) : []
                                                        }
                                                    }
                                                ]
                                            },
                                        }
                                    }
                                }
                            }
                        ]
                    },
                }
            });
            window.$overlay.element = document.createElement('developer-overlay');
            $overlay.element.style.position = 'fixed';
            $overlay.element.style.top = 0;
            $overlay.element.style.left = 0;
            $overlay.element.style.width = '100vw'
            $overlay.element.style.height = '100vh'
            $overlay.element.style.display = 'none'

            document.addEventListener('keydown', (e) => {
                if (e.code == 'KeyP') {
                    $overlay.element.style.display = $overlay.element.style.display == 'none' ? 'block' : 'none';
                    $overlay.element.style.zIndex = $overlay.element.style.zIndex != 0 ? 0 : 98;
                    if ($overlay.element.style.display == 'none') {
                        SceneManager._stopped = false
                    } else {
                        SceneManager._stopped = true
                    }
                    SceneManager.requestUpdate();
                }
            });
            document.body.appendChild($overlay.element)
        }
    } else {
        componentScript.onload = ()=>{
            window.conponentLoaded = true;
            createOverlay()
        };
    }
}
$ev.on('CreateGameObjects', createOverlay);
componentScript.onload = () => {window.componentLoaded = true}
vueScript.onload = () => { document.body.appendChild(componentScript) }
document.body.appendChild(vueScript)
