export function renderController(
  rootContainer: HTMLDivElement,
  container: HTMLDivElement
) {
  function switchClassName(className: string) {
    if (rootContainer.classList.contains(className)) {
      rootContainer.classList.remove(className);
    } else {
      rootContainer.classList.add(className);
    }
  }

  function createControllerButton(iconHtml: string, className: string) {
    const btn = document.createElement('div');
    btn.className = `controller-btn-${className}`;
    btn.addEventListener('click', () => {
      switchClassName(className);
      if (rootContainer.classList.contains(className)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    btn.innerHTML = iconHtml;

    return btn;
  }

  container.append(
    createControllerButton(
      '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="none" stroke="none" /><path fill="currentColor" d="M2 5.27L3.28 4L20 20.72L18.73 22l-3.08-3.08c-1.15.38-2.37.58-3.65.58c-5 0-9.27-3.11-11-7.5c.69-1.76 1.79-3.31 3.19-4.54L2 5.27M12 9a3 3 0 0 1 3 3a3 3 0 0 1-.17 1L11 9.17A3 3 0 0 1 12 9m0-4.5c5 0 9.27 3.11 11 7.5a11.79 11.79 0 0 1-4 5.19l-1.42-1.43A9.862 9.862 0 0 0 20.82 12A9.821 9.821 0 0 0 12 6.5c-1.09 0-2.16.18-3.16.5L7.3 5.47c1.44-.62 3.03-.97 4.7-.97M3.18 12A9.821 9.821 0 0 0 12 17.5c.69 0 1.37-.07 2-.21L11.72 15A3.064 3.064 0 0 1 9 12.28L5.6 8.87c-.99.85-1.82 1.91-2.42 3.13Z"/></svg>',
      'hide'
    )
  );

  container.append(
    createControllerButton(
      '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="none" stroke="none" /><path fill="currentColor" d="M20 8h-2.81c-.45-.8-1.07-1.5-1.82-2L17 4.41L15.59 3l-2.17 2.17a6.002 6.002 0 0 0-2.83 0L8.41 3L7 4.41L8.62 6c-.75.5-1.36 1.21-1.81 2H4v2h2.09c-.06.33-.09.66-.09 1v1H4v2h2v1c0 .34.03.67.09 1H4v2h2.81A5.988 5.988 0 0 0 15 20.18c.91-.52 1.67-1.28 2.19-2.18H20v-2h-2.09c.06-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.03-.67-.09-1H20V8m-4 7a4 4 0 0 1-4 4a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4a4 4 0 0 1 4 4v4m-2-5v2h-4v-2h4m-4 4h4v2h-4v-2Z"/></svg>',
      'debug'
    )
  );

  container.append(
    createControllerButton(
      '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="none" stroke="none" /><path fill="currentColor" d="M4 5h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2m12 12v-1c0-1.33-2.67-2-4-2s-4 .67-4 2v1h8m-4-8a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2Z"/></svg>',
      'hide-preview-video'
    )
  );

  container.append(
    createControllerButton(
      '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="none" stroke="none" /><path fill="currentColor" d="M8.11 19.45a6.948 6.948 0 0 1-4.4-5.1L2.05 6.54c-.24-1.08.45-2.14 1.53-2.37l9.77-2.07l.03-.01c1.07-.21 2.12.48 2.34 1.54l.35 1.67l4.35.93h.03c1.05.24 1.73 1.3 1.51 2.36l-1.66 7.82a6.993 6.993 0 0 1-8.3 5.38a6.888 6.888 0 0 1-3.89-2.34M20 8.18L10.23 6.1l-1.66 7.82v.03c-.57 2.68 1.16 5.32 3.85 5.89c2.69.57 5.35-1.15 5.92-3.84L20 8.18m-4 8.32a2.962 2.962 0 0 1-3.17 1.39a2.974 2.974 0 0 1-2.33-2.55L16 16.5M8.47 5.17L4 6.13l1.66 7.81l.01.03c.15.71.45 1.35.86 1.9c-.1-.77-.08-1.57.09-2.37l.43-2c-.45-.08-.84-.33-1.05-.69c.06-.61.56-1.15 1.25-1.31h.25l.78-3.81c.04-.19.1-.36.19-.52m6.56 7.06c.32-.53 1-.81 1.69-.66c.69.14 1.19.67 1.28 1.29c-.33.52-1 .8-1.7.64c-.69-.13-1.19-.66-1.27-1.27m-4.88-1.04c.32-.53.99-.81 1.68-.66c.67.14 1.2.68 1.28 1.29c-.33.52-1 .81-1.69.68c-.69-.17-1.19-.7-1.27-1.31m1.82-6.76l1.96.42l-.16-.8l-1.8.38Z"/></svg>',
      'hide-preview-guides'
    )
  );
}
