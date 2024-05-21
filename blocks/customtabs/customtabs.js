// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
 
function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}
 
export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');
 
  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  const tabDetails = tabs.map((tab, i) => {
    const id = toClassName(tab.textContent);
 
    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');
    if (!hasWrapper(tabpanel.lastElementChild)) {
      tabpanel.lastElementChild.innerHTML = `<p>${tabpanel.lastElementChild.innerHTML}</p>`;
    }
 
    return { id, tab, tabpanel };
  });
 
  tabDetails.forEach(({ id, tab, tabpanel }, i) => {
    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });
 
  block.prepend(tablist);
 
  const resizeObserver = new ResizeObserver(() => {
    if (window.innerWidth <= 768) {
      switchToDropdown(block, tabDetails);
    } else {
      switchToTabs(block, tablist, tabDetails);
    }
  });
 
  resizeObserver.observe(document.body);
 
  function switchToDropdown(block, tabDetails) {
    if (!block.querySelector('.tabs-dropdown')) {
      const dropdown = document.createElement('select');
      dropdown.className = 'tabs-dropdown';
      dropdown.setAttribute('aria-label', 'Tab selection');
      dropdown.addEventListener('change', () => {
        const selectedId = dropdown.value;
        tabDetails.forEach(({ id, tabpanel }) => {
          if (id === selectedId) {
            tabpanel.setAttribute('aria-hidden', false);
          } else {
            tabpanel.setAttribute('aria-hidden', true);
          }
        });
      });
 
      tabDetails.forEach(({ id, tab, tabpanel }, i) => {
        const option = document.createElement('option');
        option.value = id;
        option.innerHTML = tab.textContent;
        option.selected = !i;
        dropdown.append(option);
      });
 
      tablist.style.display = 'none';
      block.prepend(dropdown);
    }
  }
 
  function switchToTabs(block, tablist, tabDetails) {
    const dropdown = block.querySelector('.tabs-dropdown');
    if (dropdown) {
      dropdown.remove();
      tablist.style.display = 'flex';
      tabDetails.forEach(({ id, tabpanel }, i) => {
        if (!i) {
          tabpanel.setAttribute('aria-hidden', false);
        } else {
          tabpanel.setAttribute('aria-hidden', true);
        }
      });
    }
  }
}