/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const HEADERS = {
    level1: 'Level 1',
    level2: 'Level 2',
    level3: 'Level 3',
    hidden: 'Hidden',
    link: 'Link',
    type: 'Type',
    excludeFromMetadata: 'ExcludeFromMetadata',
  };
  
  const NO_INTERLINKS = 'no-interlinks';
  
  const MOVIES = 'movies';
  const ARTISTS = 'artists';
  const NEWS = 'news';
  const MUSIC = 'music';
  const POLITICS = 'politics';
  
  /**
   * Filters a string to become a filename of a url
    * @param {*} name The name of the target page
   * @returns {string} The filter
   */
  function filter(name) {
    return name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .replace(/\s/gm, '-') // replace whitespace with -
      .replace(/&amp;/gm, '') // remove encoded ampersands
      .replace(/&/gm, '') // remove unencoded ampersands
      .replace(/\./gm, '') // remove dots
      .replace(/--+/g, '-'); // remove multiple dashes
  }
  
  /**
   * Returns the taxonomy object
   * @param {string} lang Language of the taxonomy
   * @param {*} url URL to use to load the taxonomy
   * @returns {object} The taxonomy object
   */
  export default async (url) => {
    const root = '/tags';
    const escapeTopic = (topic) => {
      if (!topic) return null;
      return topic.replace(/\n/gm, ' ').trim();
    };
  
    const target = url || `${root}/taxonomy.json`;
  
    return fetch(target)
      .then((response) => response.json())
      .then((json) => {
        const data = {
          categories: {},
          topics: {},
          topicChildren: {},
        };
  
        if (json && json.data && json.data.length > 0) {
          const H = HEADERS;
          let level1; let
            level2;
          json.data.forEach((row) => {
            let level = 3;
            const level3 = escapeTopic(row[H.level3] !== '' ? row[H.level3] : null);
            if (!level3) {
              level = 2;
              level2 = escapeTopic(row[H.level2] !== '' ? row[H.level2] : null);
              if (!level2) {
                level = 1;
                level1 = escapeTopic(row[H.level1]);
              }
            }
  
            const name = level3 || level2 || level1;
  
            const category = row[H.type] ;
  
            // skip duplicates
            if (data.topics[name]) return;
  
            let link = row[H.link] !== '' ? row[H.link] : null;
            if (link) {
              const u = new URL(link);
              const current = new URL(window.location.href);
              link = `${current.origin}${u.pathname}`;
            } else {
              link = `${root}/${filter(name)}`;
            }
  
            const item = {
              name,
              level,
              level1,
              level2,
              level3,
              link,
              category,
              hidden: row[H.hidden] ? row[H.hidden].trim() !== '' : false,
              skipMeta: row[H.excludeFromMetadata] ? row[H.excludeFromMetadata].trim() !== '' : false,
            };
  
            data[name] = item;
  
            if (!data.categories[item.category]) {
              data.categories[item.category] = [];
            }
  
            if (data.categories[item.category].indexOf(name) === -1) {
              data.categories[item.category].push(item.name);
            }
  
            const children = data.topicChildren;
            if (level3) {
              if (!children[level2]) {
                children[level2] = [];
              }
              if (children[level2].indexOf(level3) === -1) {
                children[level2].push(level3);
              }
            }
  
            if (level2) {
              if (!children[level1]) {
                children[level1] = [];
              }
              if (children[level1].indexOf(level2) === -1) {
                children[level1].push(level2);
              }
            }
          });
        }
  
        const findItem = (topic, cat) => {
          return data[topic];
        };
  
        return {
          NEWS,
          ARTISTS,
          MUSIC,
          MOVIES,
          POLITICS,
          NO_INTERLINKS,
  
          get(topic, cat) {
            // take first one of the list
            const t = findItem(topic, cat);
            if (t) {
              return {
                name: t.name,
                link: this.getLink(t.name, cat),
                isUFT: this.isUFT(t.name, cat),
                skipMeta: this.skipMeta(t.name, cat),
  
                level: t.level,
                parents: this.getParents(t.name, cat),
                children: this.getChildren(t.name, cat),
  
                category: this.getCategoryTitle(t.category),
              };
            }
            return null;
          },
  
          isUFT(topic, cat) {
            const t = findItem(topic, cat);
            return t && !t.hidden;
          },
  
          skipMeta(topic, cat) {
            const t = findItem(topic, cat);
            return t && t.skipMeta;
          },
  
          getLink(topic, cat) {
            const t = findItem(topic, cat);
            return t?.link?.replace('.html', '');
          },
  
          getParents(topics, cat) {
            const list = typeof topics === 'string' ? [topics] : topics;
            const parents = [];
            list.forEach((topic) => {
              const t = findItem(topic, cat);
              if (t) {
                if (t.level3) {
                  if (parents.indexOf(t.level2) === -1) parents.push(t.level2);
                  if (parents.indexOf(t.level1) === -1) parents.push(t.level1);
                } else if (t.level2 && parents.indexOf(t.level1) === -1) {
                  parents.push(t.level1);
                }
              }
            });
            return parents;
          },
  
          getChildren(topic, cat) {
            return data.topicChildren[topic] || [];
          },
  
          getCategory(cat) {
            return data.categories[cat.toLowerCase()] || [];
          },
  
          getCategoryTitle(cat) {
            return cat.charAt(0).toUpperCase() + cat.substring(1);
          },
        };
      });
  };